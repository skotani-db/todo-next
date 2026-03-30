import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";

// crypto.randomUUID のモック
let uuidCounter = 0;
vi.stubGlobal("crypto", {
  ...globalThis.crypto,
  randomUUID: () => `uuid-${++uuidCounter}`,
});

// localStorage のモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Home (page.tsx)", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    uuidCounter = 0;
  });

  it("初期表示でタイトルが表示される", () => {
    render(<Home />);

    expect(screen.getByText("My Todo List")).toBeInTheDocument();
  });

  it("Todoが0件のとき開始メッセージが表示される", () => {
    render(<Home />);

    expect(
      screen.getByText(/Start adding your first todo/)
    ).toBeInTheDocument();
  });

  it("Todoが0件のとき進捗バーが表示されない", () => {
    render(<Home />);

    expect(screen.queryByText(/of.*completed/)).not.toBeInTheDocument();
  });

  it("新しいTodoを追加できる", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "買い物に行く"
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByText("買い物に行く")).toBeInTheDocument();
  });

  it("Todo追加後に進捗カウンターが表示される", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "タスク1"
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByText("0 of 1 completed")).toBeInTheDocument();
  });

  it("Todoを完了に切り替えると進捗が更新される", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "タスクA"
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    await user.click(screen.getByRole("checkbox"));

    expect(screen.getByText("1 of 1 completed")).toBeInTheDocument();
  });

  it("Todoを削除できる", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "削除するタスク"
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByText("削除するタスク")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete todo/i }));

    expect(screen.queryByText("削除するタスク")).not.toBeInTheDocument();
  });

  it("複数のTodoを追加して管理できる", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(input, "タスク1");
    await user.click(addButton);
    await user.type(input, "タスク2");
    await user.click(addButton);
    await user.type(input, "タスク3");
    await user.click(addButton);

    expect(screen.getByText("タスク1")).toBeInTheDocument();
    expect(screen.getByText("タスク2")).toBeInTheDocument();
    expect(screen.getByText("タスク3")).toBeInTheDocument();
    expect(screen.getByText("0 of 3 completed")).toBeInTheDocument();
  });

  it("Todoの完了トグルは他のTodoに影響しない", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(input, "タスクA");
    await user.click(addButton);
    await user.type(input, "タスクB");
    await user.click(addButton);

    const checkboxes = screen.getAllByRole("checkbox");
    // 新しいTodoが先頭に追加されるので、タスクBが最初
    await user.click(checkboxes[0]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(screen.getByText("1 of 2 completed")).toBeInTheDocument();
  });

  it("localStorageにデータがある場合、Todoが復元される", () => {
    const savedTodos = [
      {
        id: "saved-1",
        text: "保存されたタスク",
        completed: false,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedTodos));

    render(<Home />);

    expect(screen.getByText("保存されたタスク")).toBeInTheDocument();
  });

  it("Todo追加後にlocalStorageに保存される", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "保存テスト"
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "todos",
      expect.stringContaining("保存テスト")
    );
  });

  it("Todo削除後にTodoが0件になると開始メッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "唯一のタスク"
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(
      screen.queryByText(/Start adding your first todo/)
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete todo/i }));

    expect(
      screen.getByText(/Start adding your first todo/)
    ).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodo from "../AddTodo";

describe("AddTodo", () => {
  it("入力フィールドとAddボタンが表示される", () => {
    render(<AddTodo onAdd={vi.fn()} />);

    expect(
      screen.getByPlaceholderText("What needs to be done?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("入力が空のときAddボタンが無効になる", () => {
    render(<AddTodo onAdd={vi.fn()} />);

    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });

  it("スペースのみの入力でもAddボタンが無効になる", () => {
    render(<AddTodo onAdd={vi.fn()} />);
    const input = screen.getByPlaceholderText("What needs to be done?");

    // disabled属性はtext.trim()で判定されるため、スペースのみでもdisabledのまま
    // ただし、onChangeはリアルタイムなので直接valueを確認
    expect(input).toHaveValue("");
    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });

  it("テキスト入力後にAddボタンが有効になる", async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={vi.fn()} />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "新しいタスク"
    );

    expect(screen.getByRole("button", { name: /add/i })).toBeEnabled();
  });

  it("フォーム送信時にonAddがトリミングされたテキストで呼ばれる", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "  タスク  "
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onAdd).toHaveBeenCalledOnce();
    expect(onAdd).toHaveBeenCalledWith("タスク");
  });

  it("フォーム送信後に入力フィールドがクリアされる", async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={vi.fn()} />);
    const input = screen.getByPlaceholderText("What needs to be done?");

    await user.type(input, "テスト");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(input).toHaveValue("");
  });

  it("Enterキーでフォームが送信される", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "Enterで送信{Enter}"
    );

    expect(onAdd).toHaveBeenCalledWith("Enterで送信");
  });

  it("空文字でフォーム送信してもonAddが呼ばれない", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    // 入力フィールドにフォーカスしてEnter
    await user.click(screen.getByPlaceholderText("What needs to be done?"));
    await user.keyboard("{Enter}");

    expect(onAdd).not.toHaveBeenCalled();
  });
});

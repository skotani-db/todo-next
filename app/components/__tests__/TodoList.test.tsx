import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TodoList from "../TodoList";
import { Todo } from "../../types/todo";

const mockTodos: Todo[] = [
  {
    id: "1",
    text: "最初のタスク",
    completed: false,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "2",
    text: "二番目のタスク",
    completed: true,
    createdAt: new Date("2026-01-02"),
  },
  {
    id: "3",
    text: "三番目のタスク",
    completed: false,
    createdAt: new Date("2026-01-03"),
  },
];

describe("TodoList", () => {
  it("Todoが空の場合、空状態メッセージを表示する", () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("No todos yet")).toBeInTheDocument();
    expect(
      screen.getByText("Add your first task to get started!")
    ).toBeInTheDocument();
  });

  it("Todoが空の場合、TodoItemが表示されない", () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("Todoが存在する場合、全てのTodoが表示される", () => {
    render(
      <TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("最初のタスク")).toBeInTheDocument();
    expect(screen.getByText("二番目のタスク")).toBeInTheDocument();
    expect(screen.getByText("三番目のタスク")).toBeInTheDocument();
  });

  it("Todoが存在する場合、空状態メッセージが表示されない", () => {
    render(
      <TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.queryByText("No todos yet")).not.toBeInTheDocument();
  });

  it("チェックボックスの数がTodoの数と一致する", () => {
    render(
      <TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("完了済みTodoのチェックボックスがオンになっている", () => {
    render(
      <TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked(); // 最初のタスク: 未完了
    expect(checkboxes[1]).toBeChecked(); // 二番目のタスク: 完了
    expect(checkboxes[2]).not.toBeChecked(); // 三番目のタスク: 未完了
  });

  it("1件のTodoだけでも正しく表示される", () => {
    const singleTodo = [mockTodos[0]];
    render(
      <TodoList todos={singleTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("最初のタスク")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  });
});

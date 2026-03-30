import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "../TodoItem";
import { Todo } from "../../types/todo";

const baseTodo: Todo = {
  id: "test-id-1",
  text: "テストタスク",
  completed: false,
  createdAt: new Date("2026-01-01"),
};

describe("TodoItem", () => {
  it("Todoのテキストが表示される", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("テストタスク")).toBeInTheDocument();
  });

  it("未完了のTodoはチェックボックスがオフ", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("完了済みのTodoはチェックボックスがオン", () => {
    const completedTodo = { ...baseTodo, completed: true };
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("完了済みのTodoのテキストにline-throughクラスが適用される", () => {
    const completedTodo = { ...baseTodo, completed: true };
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("テストタスク")).toHaveClass("line-through");
  });

  it("未完了のTodoのテキストにline-throughクラスが適用されない", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("テストタスク")).not.toHaveClass("line-through");
  });

  it("チェックボックスをクリックするとonToggleが正しいIDで呼ばれる", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} />
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledOnce();
    expect(onToggle).toHaveBeenCalledWith("test-id-1");
  });

  it("削除ボタンをクリックするとonDeleteが正しいIDで呼ばれる", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} />
    );

    await user.click(screen.getByRole("button", { name: /delete todo/i }));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith("test-id-1");
  });
});

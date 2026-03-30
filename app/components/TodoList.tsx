"use client";

import { Todo } from "../types/todo";
import TodoItem from "./TodoItem";
import { ClipboardList } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
          <ClipboardList size={40} className="text-indigo-600" />
        </div>
        <p className="text-xl text-gray-500 font-medium">
          No todos yet
        </p>
        <p className="text-gray-400 mt-2">
          Add your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

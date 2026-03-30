"use client";

import { Todo } from "../types/todo";
import { Trash2 } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-2">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="peer w-6 h-6 rounded-lg border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all duration-200 hover:border-indigo-400"
        />
        <div className="absolute inset-0 rounded-lg bg-indigo-100 opacity-0 peer-checked:opacity-20 transition-opacity pointer-events-none" />
      </div>
      <span
        className={`flex-1 text-lg font-medium transition-all duration-300 ${
          todo.completed
            ? "line-through text-gray-400 opacity-60"
            : "text-gray-800"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
        aria-label="Delete todo"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Todo } from "./types/todo";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      // Convert string dates back to Date objects
      const todosWithDates = parsedTodos.map((todo: Todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
      setTodos(todosWithDates);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            My Todo List
          </h1>
          <div className="flex items-center justify-center gap-2">
            {totalCount > 0 ? (
              <>
                <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                  <span className="text-sm font-semibold text-gray-700">
                    {completedCount} of {totalCount} completed
                  </span>
                </div>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{
                      width: `${(completedCount / totalCount) * 100}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-lg">
                Start adding your first todo! ✨
              </p>
            )}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
          <AddTodo onAdd={addTodo} />
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </div>
      </main>
    </div>
  );
}

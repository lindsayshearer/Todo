"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  Todo,
  TodoList,
  TodoPriority,
  getTodoList,
  getListTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
} from "@/lib/firebase/todos";

export default function TodoListPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { listId } = use(params);
  const [todoList, setTodoList] = useState<TodoList | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>("medium");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await loadData();
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, listId]);

  const loadData = async () => {
    try {
      const [list, listTodos] = await Promise.all([
        getTodoList(listId),
        getListTodos(listId),
      ]);
      setTodoList(list);
      setTodos(listTodos);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim() && userId) {
      try {
        await createTodo({
          listId,
          userId,
          title: newTodoTitle.trim(),
          priority: newTodoPriority,
        });
        await loadData();
        setNewTodoTitle("");
        setNewTodoPriority("medium");
        setIsCreating(false);
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await toggleTodoComplete(id);
      await loadData();
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      await loadData();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleSaveEdit = async (id: string) => {
    if (editingTitle.trim()) {
      try {
        await updateTodo(id, { title: editingTitle.trim() });
        await loadData();
        setEditingTodoId(null);
        setEditingTitle("");
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTitle("");
  };

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!todoList) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            List not found
          </h2>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Back to lists
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {todoList.name}
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            {todoList.completedCount}/{todoList.todoCount} tasks completed
          </p>
        </div>

        {/* Create New Todo Form */}
        {isCreating ? (
          <form
            onSubmit={handleCreateTodo}
            className="mb-6 rounded-2xl border border-solid border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-[#0a0a0a]"
          >
            <div className="mb-4">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                className="w-full rounded-lg border border-solid border-black/[.08] bg-white px-4 py-3 text-base text-black transition-colors placeholder:text-zinc-400 focus:border-black/[.2] focus:outline-none focus:ring-2 focus:ring-black/[.1] dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.3] dark:focus:ring-white/[.1]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Priority:</span>
                <select
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(e.target.value as TodoPriority)}
                  className="rounded-lg border border-solid border-black/[.08] bg-white px-3 py-2 text-sm text-black dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewTodoTitle("");
                  }}
                  className="rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                >
                  Add Todo
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="mb-6 flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Todo
          </button>
        )}

        {/* Todos List */}
        {todos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/[.08] bg-white p-12 text-center dark:border-white/[.145] dark:bg-[#0a0a0a]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-black dark:text-zinc-50">
              No todos yet
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Add your first todo to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center gap-4 rounded-xl border border-solid border-black/[.08] bg-white p-4 shadow-sm transition-all dark:border-white/[.145] dark:bg-[#0a0a0a] ${
                  todo.status === "completed" ? "opacity-60" : ""
                }`}
              >
                <button
                  onClick={() => handleToggleComplete(todo.id)}
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    todo.status === "completed"
                      ? "border-green-500 bg-green-500"
                      : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
                  }`}
                >
                  {todo.status === "completed" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="white"
                      className="h-3 w-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  {editingTodoId === todo.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(todo.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        autoFocus
                        className="flex-1 rounded-lg border border-solid border-black/[.08] bg-white px-3 py-1 text-base text-black dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50"
                      />
                      <button
                        onClick={() => handleSaveEdit(todo.id)}
                        className="text-green-600 hover:text-green-700 dark:text-green-400"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <p
                      className={`text-base text-black dark:text-zinc-50 ${
                        todo.status === "completed" ? "line-through" : ""
                      }`}
                    >
                      {todo.title}
                    </p>
                  )}
                </div>

                <span
                  className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                    todo.priority
                  )}`}
                >
                  {todo.priority}
                </span>

                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleStartEdit(todo)}
                    className="rounded p-1 text-zinc-400 transition-colors hover:text-black dark:hover:text-zinc-50"
                    aria-label="Edit todo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="rounded p-1 text-zinc-400 transition-colors hover:text-red-500"
                    aria-label="Delete todo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


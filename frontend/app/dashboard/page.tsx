"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  TodoList,
  getUserTodoLists,
  createTodoList,
  deleteTodoList,
} from "@/lib/firebase/todos";

export default function DashboardPage() {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Check auth state and load todo lists
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await loadTodoLists(user.uid);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadTodoLists = async (uid: string) => {
    try {
      const lists = await getUserTodoLists(uid);
      setTodoLists(lists);
    } catch (error) {
      console.error("Error loading todo lists:", error);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim() && userId) {
      try {
        await createTodoList({
          userId,
          name: newListName.trim(),
        });
        await loadTodoLists(userId);
        setNewListName("");
        setIsCreating(false);
      } catch (error) {
        console.error("Error creating todo list:", error);
      }
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      await deleteTodoList(id);
      if (userId) {
        await loadTodoLists(userId);
      }
    } catch (error) {
      console.error("Error deleting todo list:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (timestamp: { toDate: () => Date } | null) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
              My Todo Lists
            </h1>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
              Organize your tasks with multiple todo lists
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
          >
            Sign out
          </button>
        </div>

        {/* Create New List Form */}
        {isCreating ? (
          <form
            onSubmit={handleCreateList}
            className="mb-8 rounded-2xl border border-solid border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-[#0a0a0a]"
          >
            <div className="flex gap-4">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name..."
                autoFocus
                className="flex-1 rounded-lg border border-solid border-black/[.08] bg-white px-4 py-3 text-base text-black transition-colors placeholder:text-zinc-400 focus:border-black/[.2] focus:outline-none focus:ring-2 focus:ring-black/[.1] dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.3] dark:focus:ring-white/[.1]"
              />
              <button
                type="submit"
                className="rounded-full bg-foreground px-6 py-3 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewListName("");
                }}
                className="rounded-full border border-solid border-black/[.08] px-6 py-3 text-base font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="mb-8 flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
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
            Create New List
          </button>
        )}

        {/* Todo Lists Grid */}
        {todoLists.length === 0 ? (
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
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h5.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-black dark:text-zinc-50">
              No todo lists yet
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Get started by creating your first todo list
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {todoLists.map((list) => (
              <div
                key={list.id}
                className="group relative rounded-2xl border border-solid border-black/[.08] bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/[.145] dark:bg-[#0a0a0a]"
              >
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Delete list"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5 text-zinc-400 transition-colors hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>

                <div className="pr-8">
                  <h3 className="mb-2 text-xl font-semibold text-black dark:text-zinc-50">
                    {list.name}
                  </h3>
                  <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {list.completedCount}/{list.todoCount}{" "}
                    {list.todoCount === 1 ? "task" : "tasks"} completed
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Created {formatDate(list.createdAt)}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => router.push(`/dashboard/${list.id}`)}
                    className="w-full rounded-lg border border-solid border-black/[.08] bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50 dark:hover:bg-[#2a2a2a]"
                  >
                    Open List
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

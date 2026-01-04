"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateTodoPage() {
  const router = useRouter();

  // Redirect to dashboard since todo creation is handled there
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-lg text-zinc-600 dark:text-zinc-400">
        Redirecting...
      </div>
    </div>
  );
}


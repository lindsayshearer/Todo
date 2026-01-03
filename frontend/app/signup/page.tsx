"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { createUser } from "@/lib/firebase/users";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, {
        displayName: name,
      });

      // Store user data in Firestore
      await createUser({
        uid: user.uid,
        name: name,
        email: email,
      });

      // Redirect to dashboard after successful signup
      router.push("/dashboard");
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      switch (firebaseError.code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please use a stronger password");
          break;
        default:
          setError("An error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Create an account
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Sign up to get started with your todo lists
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-solid border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.145] dark:bg-[#0a0a0a]"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mb-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-black dark:text-zinc-50"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-solid border-black/[.08] bg-white px-4 py-3 text-base text-black transition-colors placeholder:text-zinc-400 focus:border-black/[.2] focus:outline-none focus:ring-2 focus:ring-black/[.1] disabled:opacity-50 dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.3] dark:focus:ring-white/[.1]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-black dark:text-zinc-50"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-solid border-black/[.08] bg-white px-4 py-3 text-base text-black transition-colors placeholder:text-zinc-400 focus:border-black/[.2] focus:outline-none focus:ring-2 focus:ring-black/[.1] disabled:opacity-50 dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.3] dark:focus:ring-white/[.1]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-black dark:text-zinc-50"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-solid border-black/[.08] bg-white px-4 py-3 text-base text-black transition-colors placeholder:text-zinc-400 focus:border-black/[.2] focus:outline-none focus:ring-2 focus:ring-black/[.1] disabled:opacity-50 dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.3] dark:focus:ring-white/[.1]"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-black dark:text-zinc-50"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-solid border-black/[.08] bg-white px-4 py-3 text-base text-black transition-colors placeholder:text-zinc-400 focus:border-black/[.2] focus:outline-none focus:ring-2 focus:ring-black/[.1] disabled:opacity-50 dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.3] dark:focus:ring-white/[.1]"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-foreground px-5 py-3 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-black transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

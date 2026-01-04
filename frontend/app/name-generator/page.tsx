"use client";

import { useState } from "react";

export default function NameGeneratorPage() {
  const [businessPlan, setBusinessPlan] = useState("");
  const [generatedName, setGeneratedName] = useState("");

  const handleGenerate = () => {
    // Placeholder for future AI functionality
    // For now, just show a placeholder name
    setGeneratedName("Your business name will appear here...");
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Business Name Generator
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Enter your business plan and let AI create the perfect name for you
          </p>
        </div>

        {/* Business Plan Input */}
        <div className="mb-8 rounded-2xl border border-solid border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-[#0a0a0a]">
          <label
            htmlFor="business-plan"
            className="mb-3 block text-sm font-medium text-black dark:text-zinc-50"
          >
            Business Plan
          </label>
          <textarea
            id="business-plan"
            value={businessPlan}
            onChange={(e) => setBusinessPlan(e.target.value)}
            placeholder="Describe your business idea, target market, products/services, and vision..."
            rows={10}
            className="w-full rounded-lg border border-solid border-black/[.08] bg-white px-4 py-3 text-base text-black transition-colors placeholder:text-zinc-400 focus:border-black/[.2] focus:outline-none focus:ring-2 focus:ring-black/[.1] dark:border-white/[.145] dark:bg-[#1a1a1a] dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-white/[.3] dark:focus:ring-white/[.1]"
          />
          <button
            onClick={handleGenerate}
            disabled={!businessPlan.trim()}
            className="mt-4 w-full rounded-full bg-foreground px-6 py-3 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-[#ccc]"
          >
            Generate Business Name
          </button>
        </div>

        {/* Generated Name Display */}
        <div className="rounded-2xl border border-solid border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.145] dark:bg-[#0a0a0a]">
          <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
            Generated Business Name
          </h2>
          {generatedName ? (
            <div className="rounded-lg border border-solid border-black/[.08] bg-zinc-50 p-6 dark:border-white/[.145] dark:bg-[#1a1a1a]">
              <p className="text-2xl font-semibold text-black dark:text-zinc-50">
                {generatedName}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-black/[.08] bg-zinc-50 p-12 text-center dark:border-white/[.145] dark:bg-[#1a1a1a]">
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
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Your generated business name will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


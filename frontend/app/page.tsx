import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-indigo-500/20 blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-fuchsia-500/10 blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Greeting badge */}
        <div className="mb-8 animate-[fadeIn_0.6s_ease-out] rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium tracking-wide text-purple-300 backdrop-blur-sm">
          ✨ Welcome aboard
        </div>

        {/* Main heading */}
        <h1 
          className="mb-6 animate-[fadeIn_0.8s_ease-out] bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Get things done.
        </h1>

        {/* Subtitle */}
        <p className="mb-12 max-w-md animate-[fadeIn_1s_ease-out] text-lg leading-relaxed text-slate-400 sm:text-xl">
          Your tasks, organized beautifully. Simple, focused, and designed to help you accomplish what matters most.
        </p>

        {/* CTA Button */}
        <Link
          href="/login"
          className="group relative animate-[fadeIn_1.2s_ease-out] overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
        >
          <span className="relative z-10">Get Started →</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        {/* Secondary link */}
        <p className="mt-6 animate-[fadeIn_1.4s_ease-out] text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 underline-offset-4 transition-colors hover:text-purple-300 hover:underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  UserPlus,
  Zap,
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create account.");
        setLoading(false);
        return;
      }

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070a] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[15%] h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] h-96 w-96 rounded-full bg-violet-500/10 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Top branding */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-10">
        <Link
          href="/auth"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
            <Zap size={18} fill="currentColor" />
          </div>

          <span className="font-black tracking-[0.22em]">
            ACR_AGENT
          </span>
        </Link>

        <Link
          href="/login"
          className="text-sm text-white/50 transition hover:text-white"
        >
          Already have an account?
          <span className="ml-2 font-semibold text-white">
            Sign in
          </span>
        </Link>
      </header>

      {/* Main */}
      <div className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/50 backdrop-blur-xl lg:grid-cols-2">
          {/* Left */}
          <section className="hidden flex-col justify-between border-r border-white/10 p-12 lg:flex">
            <div>
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <ShieldCheck
                  size={26}
                  className="text-cyan-300"
                />
              </div>

              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/60">
                Autonomous Code Repair
              </p>

              <h1 className="mt-6 text-6xl font-black leading-[0.9] tracking-[-0.05em]">
                BUILD.
                <br />
                BREAK.
                <br />
                <span className="text-cyan-300">
                  RECOVER.
                </span>
              </h1>

              <p className="mt-8 max-w-md text-sm leading-7 text-white/40">
                Create your ACR_AGENT account and access the
                autonomous CI/CD recovery environment.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  AI
                </p>
                <p className="mt-2 text-sm font-bold">
                  Healing
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  CI/CD
                </p>
                <p className="mt-2 text-sm font-bold">
                  Recovery
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Docker
                </p>
                <p className="mt-2 text-sm font-bold">
                  Isolated
                </p>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="flex items-center justify-center p-7 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <UserPlus size={22} />
                </div>

                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  Create account
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-tight">
                  Join ACR_AGENT.
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  Create your account to enter the recovery
                  dashboard.
                </p>
              </div>

              <form
                onSubmit={handleRegister}
                className="space-y-5"
              >
                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/40">
                    Full name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 focus:bg-white/[0.055]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/40">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 focus:bg-white/[0.055]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/40">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 focus:bg-white/[0.055]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/40">
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Repeat your password"
                      required
                      minLength={6}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 focus:bg-white/[0.055]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                {error && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
                    {success}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold text-black transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-white/35">
                Already registered?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-white transition hover:text-cyan-300"
                >
                  Sign in
                </Link>
              </p>

              <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/15">
                Secure authentication • ACR_AGENT
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
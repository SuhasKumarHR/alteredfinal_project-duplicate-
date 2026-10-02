"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, ShieldCheck, UserPlus, Zap } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
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

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030507] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[10%] h-[550px] w-[550px] rounded-full bg-cyan-500/[0.055] blur-[160px]" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.05] blur-[170px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:45px_45px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1500px]">
        {/* LEFT */}
        <section className="hidden w-1/2 flex-col justify-between border-r border-white/[0.07] p-10 lg:flex xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-cyan-300/20 bg-cyan-300/[0.06]">
              <Zap
                size={19}
                className="text-cyan-300"
                fill="currentColor"
              />
            </div>

            <div>
              <div className="text-sm font-bold tracking-[0.2em]">
                ACR_AGENT
              </div>

              <div className="font-mono text-[8px] tracking-[0.25em] text-white/25">
                RECOVERY OS
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-violet-400/50" />

              <span className="font-mono text-[9px] tracking-[0.3em] text-violet-300/60">
                CREATE YOUR ACCESS
              </span>
            </div>

            <h1 className="max-w-xl text-6xl font-bold leading-[0.92] tracking-[-0.06em] xl:text-7xl">
              Build.
              <br />

              <span className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
                Heal.
              </span>

              <br />

              <span className="text-white/30">Recover.</span>
            </h1>

            <p className="mt-8 max-w-lg text-sm leading-7 text-white/35">
              Create your ACR_AGENT account and access the autonomous CI/CD
              recovery command center.
            </p>
          </div>

          <div className="font-mono text-[8px] tracking-[0.25em] text-white/15">
            SECURE // AUTONOMOUS // ENGINEERING
          </div>
        </section>

        {/* FORM */}
        <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[430px]">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-violet-400/15 bg-violet-400/[0.05]">
                <UserPlus size={22} className="text-violet-300" />
              </div>

              <div className="font-mono text-[9px] tracking-[0.3em] text-violet-300/50">
                NEW USER
              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Create account.
              </h2>

              <p className="mt-2 text-sm text-white/30">
                Set up your secure ACR_AGENT workspace.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block font-mono text-[9px] tracking-[0.18em] text-white/35">
                  FULL NAME
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-violet-400/30"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block font-mono text-[9px] tracking-[0.18em] text-white/35">
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-violet-400/30"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block font-mono text-[9px] tracking-[0.18em] text-white/35">
                  PASSWORD
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-violet-400/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-white/25 hover:text-white/60"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="mb-2 block font-mono text-[9px] tracking-[0.18em] text-white/35">
                  CONFIRM PASSWORD
                </label>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Repeat your password"
                    className="w-full border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-violet-400/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-white/25 hover:text-white/60"
                  >
                    {showConfirm ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="border border-red-400/15 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="border border-emerald-400/15 bg-emerald-400/[0.04] px-4 py-3 text-xs text-emerald-300">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-white/30">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-cyan-300 hover:text-cyan-200"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-6">
              <ShieldCheck size={13} className="text-emerald-400/60" />

              <span className="font-mono text-[8px] tracking-[0.15em] text-white/20">
                PASSWORDS ARE HASHED BEFORE STORAGE
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
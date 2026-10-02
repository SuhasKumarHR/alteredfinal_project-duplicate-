"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, ShieldCheck, Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function handleGoogleLogin() {
    setError("");

    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030507] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[-20%] h-[600px] w-[600px] rounded-full bg-cyan-500/[0.06] blur-[160px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.05] blur-[170px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:45px_45px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1500px]">
        {/* LEFT SIDE */}
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

          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-400/50" />

              <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-300/60">
                AUTONOMOUS CI/CD
              </span>
            </div>

            <h1 className="text-6xl font-bold leading-[0.92] tracking-[-0.06em] xl:text-7xl">
              Code fails.
              <br />

              <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">
                Agents recover.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-sm leading-7 text-white/35">
              ACR_AGENT detects CI/CD failures, classifies root causes,
              generates automated repairs and validates the recovery workflow.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 border border-white/[0.07]">
              <Feature label="KNN" value="ANALYSIS" />
              <Feature label="AI" value="HEALING" />
              <Feature label="DOCKER" value="VERIFY" />
            </div>
          </div>

          <div className="font-mono text-[8px] tracking-[0.25em] text-white/15">
            AI // DEVOPS // DOCKER // GITHUB
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[430px]">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-cyan-400/15 bg-cyan-400/[0.05]">
                <ShieldCheck size={23} className="text-cyan-300" />
              </div>

              <div className="font-mono text-[9px] tracking-[0.3em] text-cyan-300/50">
                SECURE ACCESS
              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Welcome back.
              </h2>

              <p className="mt-2 text-sm text-white/30">
                Sign in to access your recovery command center.
              </p>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 border border-white/[0.09] bg-white/[0.035] px-5 py-3.5 text-sm font-medium text-white transition hover:border-white/[0.16] hover:bg-white/[0.06]"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.07]" />

              <span className="font-mono text-[8px] tracking-[0.2em] text-white/20">
                OR EMAIL
              </span>

              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            {/* Login form */}
            <form onSubmit={handleLogin} className="space-y-5">
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
                  className="w-full border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02]"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="font-mono text-[9px] tracking-[0.18em] text-white/35">
                    PASSWORD
                  </label>

                  <span className="font-mono text-[8px] text-white/15">
                    SECURED
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-white/25 hover:text-white/60"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
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

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "AUTHENTICATING..." : "SIGN IN"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-7 text-center text-sm text-white/30">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                Create account
              </Link>
            </div>

            {/* Security */}
            <div className="mt-8 flex items-center justify-center gap-5 border-t border-white/[0.06] pt-6">
              <SecurityItem text="OAuth" />
              <SecurityItem text="SESSION" />
              <SecurityItem text="BCRYPT" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-white/[0.06] p-4 last:border-r-0">
      <div className="font-mono text-sm text-cyan-300/70">{label}</div>

      <div className="mt-1 font-mono text-[7px] tracking-[0.18em] text-white/20">
        {value}
      </div>
    </div>
  );
}

function SecurityItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-1 w-1 rounded-full bg-emerald-400" />

      <span className="font-mono text-[7px] tracking-[0.15em] text-white/20">
        {text}
      </span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
      />

      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.37l-3.14-2.44c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.29v2.52A9.74 9.74 0 0 0 12 21.5Z"
      />

      <path
        fill="#FBBC05"
        d="M6.54 13.59A5.85 5.85 0 0 1 6.24 12c0-.55.1-1.09.3-1.59V7.89H3.29A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.11l3.25-2.52Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.39l3.25 2.52C7.31 8.1 9.46 6.38 12 6.38Z"
      />
    </svg>
  );
}

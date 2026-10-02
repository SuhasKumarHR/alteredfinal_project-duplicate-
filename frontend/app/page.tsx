"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";

type AuthMode = "login" | "register";

export default function Home() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [checkingSession, setCheckingSession] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await getSession();

        if (session?.user) {
          router.replace("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, [router]);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Unable to sign in. Please try again.");
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
          name: cleanName,
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Unable to create account.");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (result?.error) {
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        setError(
          "Account created successfully. Please sign in with your new account."
        );
        setLoading(false);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Unable to create account. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);

    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030507] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/60">
            Initializing ACR_AGENT
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030507] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.13]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/[0.07] px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
            <Zap className="h-5 w-5 text-cyan-300" />
          </div>

          <div>
            <div className="text-sm font-black tracking-[0.22em]">
              ACR_AGENT
            </div>

            <div className="text-[9px] tracking-[0.25em] text-cyan-300/60">
              AUTONOMOUS CODE RECOVERY
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-emerald-300/70 md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          System Ready
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 flex min-h-[calc(100vh-82px)] items-center justify-center px-5 py-10">
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-cyan-300/70">
              <ShieldCheck className="h-3.5 w-3.5" />
              AI-powered release health
            </div>

            <h1 className="text-6xl font-black leading-[0.95] tracking-[-0.05em]">
              Autonomous
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Code Recovery
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400">
              Detect CI/CD failures, diagnose root causes, generate targeted
              repairs and validate recovery through an autonomous engineering
              workflow.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <Feature number="01" title="DETECT" text="Failure signals" />
              <Feature number="02" title="ANALYZE" text="KNN intelligence" />
              <Feature number="03" title="HEAL" text="Validated repair" />
            </div>
          </div>

          {/* Authentication */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[28px] border border-white/[0.09] bg-[#080c11]/90 p-2 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[22px] border border-white/[0.06] bg-[#0b1016] p-6 md:p-7">
                <div className="mb-7">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07]">
                    <LockKeyhole className="h-5 w-5 text-cyan-300" />
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/50">
                    Secure access
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {mode === "login"
                      ? "Welcome back."
                      : "Create your account."}
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {mode === "login"
                      ? "Sign in to access your autonomous repair dashboard."
                      : "Create an account to access ACR_AGENT."}
                  </p>
                </div>

                {/* Tabs */}
                <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/[0.07] bg-black/20 p-1">
                  <button
                    type="button"
                    onClick={() => changeMode("login")}
                    className={`rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      mode === "login"
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-slate-500"
                    }`}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => changeMode("register")}
                    className={`rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      mode === "register"
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-slate-500"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form
                  onSubmit={
                    mode === "login" ? handleLogin : handleRegister
                  }
                  className="space-y-4"
                >
                  {mode === "register" && (
                    <InputField
                      icon={<User className="h-4 w-4" />}
                      label="Full Name"
                      value={name}
                      onChange={setName}
                      placeholder="Your name"
                      type="text"
                    />
                  )}

                  <InputField
                    icon={<Mail className="h-4 w-4" />}
                    label="Email Address"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    type="email"
                  />

                  <PasswordField
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    visible={showPassword}
                    setVisible={setShowPassword}
                  />

                  {mode === "register" && (
                    <PasswordField
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      visible={showConfirmPassword}
                      setVisible={setShowConfirmPassword}
                    />
                  )}

                  {error && (
                    <div className="rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-xs text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 text-xs font-black uppercase tracking-[0.18em] text-[#031015] transition hover:bg-cyan-300 disabled:opacity-50"
                  >
                    {loading
                      ? "Please wait..."
                      : mode === "login"
                        ? "Sign In"
                        : "Create Account"}

                    {!loading && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.07]" />

                  <span className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                    Or
                  </span>

                  <div className="h-px flex-1 bg-white/[0.07]" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-50"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.16em] text-slate-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure authentication
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[9px] uppercase tracking-[0.18em] text-slate-700">
              ACR_AGENT · Autonomous Code Recovery
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="text-[9px] tracking-[0.2em] text-cyan-300/40">
        {number}
      </div>

      <div className="mt-3 text-xs font-bold tracking-[0.14em]">
        {title}
      </div>

      <div className="mt-1 text-[10px] text-slate-500">{text}</div>
    </div>
  );
}

function InputField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/20 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/40"
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  setVisible,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="••••••••"
          className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 pr-12 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/40"
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-300"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.77-.07-1.51-.22-2.22H12v4.2h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.37Z"
      />
      <path
        fill="#34A853"
        d="M12 21.8c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.8Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.88A5.86 5.86 0 0 1 6.23 12c0-.65.11-1.28.31-1.88V7.59H3.3A9.77 9.77 0 0 0 2.25 12c0 1.58.38 3.08 1.05 4.41l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.09c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.18 14.63 2.2 12 2.2a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.81 9.46 6.09 12 6.09Z"
      />
    </svg>
  );
}
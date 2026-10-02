"use client";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  Circle,
  Code2,
  Container,
  Cpu,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Github,
  Layers3,
  Menu,
  Play,
  RefreshCw,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  User,
  X,
  Zap,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const pipeline = [
  {
    label: "REPOSITORY",
    icon: Github,
    status: "done",
  },
  {
    label: "ENVIRONMENT",
    icon: Container,
    status: "done",
  },
  {
    label: "BUILD",
    icon: Code2,
    status: "done",
  },
  {
    label: "DETECT",
    icon: AlertCircle,
    status: "done",
  },
  {
    label: "KNN ANALYSIS",
    icon: Cpu,
    status: "active",
  },
  {
    label: "AI HEAL",
    icon: Sparkles,
    status: "active",
  },
  {
    label: "VERIFY",
    icon: ShieldCheck,
    status: "waiting",
  },
  {
    label: "PULL REQUEST",
    icon: GitPullRequest,
    status: "waiting",
  },
];

const navigation = [
  {
    name: "Command Center",
    icon: Layers3,
  },
  {
    name: "Repositories",
    icon: Github,
  },
  {
    name: "Pipelines",
    icon: GitBranch,
  },
  {
    name: "Healing Engine",
    icon: Sparkles,
  },
  {
    name: "Run History",
    icon: Activity,
  },
  {
    name: "Error Analysis",
    icon: AlertCircle,
  },
  {
    name: "Pull Requests",
    icon: GitPullRequest,
  },
];

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020407] text-white">
      {/* ------------------------------------------------------------------ */}
      {/* BACKGROUND                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[5%] top-[-15%] h-[650px] w-[650px] rounded-full bg-cyan-500/[0.06] blur-[160px]" />

        <div className="absolute right-[-10%] top-[15%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.055] blur-[170px]" />

        <div className="absolute bottom-[-15%] left-[30%] h-[600px] w-[600px] rounded-full bg-blue-500/[0.04] blur-[170px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE OVERLAY                                                     */}
      {/* ------------------------------------------------------------------ */}

      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SIDEBAR                                                            */}
      {/* ------------------------------------------------------------------ */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/[0.07] bg-[#05080c]/95 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* BRAND */}

        <div className="flex h-[82px] items-center justify-between border-b border-white/[0.07] px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <Zap
                size={19}
                className="text-cyan-300"
                fill="currentColor"
              />

              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,1)]" />
            </div>

            <div>
              <div className="text-sm font-bold tracking-[0.18em]">
                ACR_AGENT
              </div>

              <div className="mt-1 font-mono text-[8px] tracking-[0.25em] text-cyan-300/30">
                AUTONOMOUS RECOVERY OS
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/30 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-3 py-6">
          <div className="mb-3 px-3 font-mono text-[8px] uppercase tracking-[0.28em] text-white/20">
            Main System
          </div>

          <nav className="space-y-1">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = index === 0;

              return (
                <button
                  key={item.name}
                  className={`group relative flex w-full items-center gap-3 border px-3 py-3 text-left text-xs transition-all ${
                    active
                      ? "border-cyan-400/15 bg-cyan-400/[0.065] text-white shadow-[inset_2px_0_0_rgba(103,232,249,0.8)]"
                      : "border-transparent text-white/35 hover:bg-white/[0.025] hover:text-white/80"
                  }`}
                >
                  <Icon
                    size={16}
                    className={
                      active
                        ? "text-cyan-300"
                        : "text-white/25 group-hover:text-white/60"
                    }
                  />

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="my-7 h-px bg-white/[0.05]" />

          {/* SYSTEM TELEMETRY */}

          <div className="px-3">
            <div className="mb-4 font-mono text-[8px] uppercase tracking-[0.28em] text-white/20">
              System Telemetry
            </div>

            <Telemetry label="BACKEND" value="ONLINE" />
            <Telemetry label="DOCKER" value="READY" />
            <Telemetry label="AI ENGINE" value="READY" />
            <Telemetry label="KNN MODEL" value="ACTIVE" />
            <Telemetry label="GITHUB" value="CONNECTED" />
            <Telemetry label="DATABASE" value="ONLINE" />
          </div>

          <div className="mt-8 px-3">
            <div className="border border-cyan-400/10 bg-cyan-400/[0.025] p-4">
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-cyan-300" />

                <span className="font-mono text-[8px] tracking-[0.2em] text-cyan-300/60">
                  SYSTEM STATUS
                </span>
              </div>

              <div className="mt-4 text-lg font-semibold">
                Operational
              </div>

              <div className="mt-1 text-[10px] text-white/25">
                All recovery services responding normally.
              </div>

              <div className="mt-4 h-1 overflow-hidden bg-white/[0.05]">
                <div className="h-full w-[94%] bg-gradient-to-r from-cyan-400 to-emerald-400" />
              </div>

              <div className="mt-2 flex justify-between font-mono text-[7px] text-white/20">
                <span>HEALTH</span>
                <span>94%</span>
              </div>
            </div>
          </div>
        </div>

        {/* USER + LOGOUT */}

        <div className="border-t border-white/[0.07] p-4">
          <div className="border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/[0.06]">
                <User size={14} className="text-cyan-300" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">
                  Authenticated User
                </div>

                <div className="mt-1 font-mono text-[8px] text-emerald-300/50">
                  SESSION ACTIVE
                </div>
              </div>

              <Settings size={14} className="text-white/20" />
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-3 flex w-full items-center justify-center gap-2 border border-red-400/10 bg-red-400/[0.03] px-3 py-2 font-mono text-[8px] tracking-[0.15em] text-red-300/60 transition hover:border-red-400/20 hover:bg-red-400/[0.07] hover:text-red-300"
            >
              <X size={12} />
              SIGN OUT
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN                                                                */}
      {/* ------------------------------------------------------------------ */}

      <div className="lg:pl-[270px]">
        {/* HEADER */}

        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#030507]/80 backdrop-blur-xl">
          <div className="flex h-[82px] items-center justify-between px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="border border-white/[0.08] bg-white/[0.025] p-2 text-white/50 lg:hidden"
              >
                <Menu size={18} />
              </button>

              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-cyan-300/30">
                  Autonomous Recovery Environment
                </div>

                <div className="mt-1 text-sm font-medium">
                  Command Center
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-2 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.8)]" />

                <span className="font-mono text-[8px] tracking-[0.15em] text-emerald-300">
                  SYSTEM ONLINE
                </span>
              </div>

              <button className="border border-white/[0.08] bg-white/[0.025] p-2 text-white/40 transition hover:border-cyan-400/20 hover:text-cyan-300">
                <RefreshCw size={16} />
              </button>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <User size={14} className="text-white/50" />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div className="mx-auto max-w-[1750px] px-5 py-7 sm:px-8 lg:px-10">
          {/* ---------------------------------------------------------------- */}
          {/* HERO                                                             */}
          {/* ---------------------------------------------------------------- */}

          <section className="relative overflow-hidden border border-white/[0.08] bg-[#060a0f] shadow-[0_0_80px_rgba(34,211,238,0.025)]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="absolute right-0 top-0 h-full w-[60%] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_58%)]" />

            <div className="absolute left-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full border border-cyan-400/[0.04]" />

            <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
              {/* HERO TEXT */}

              <div className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-10 bg-cyan-400/50" />

                  <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-300/70">
                    AI / DEVOPS / AUTONOMOUS
                  </span>
                </div>

                <div className="mb-5 inline-flex w-fit items-center gap-2 border border-cyan-400/10 bg-cyan-400/[0.03] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />

                  <span className="font-mono text-[8px] tracking-[0.2em] text-cyan-300/60">
                    RECOVERY ENGINE ACTIVE
                  </span>
                </div>

                <h1 className="max-w-3xl text-5xl font-bold leading-[0.93] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  Code fails.
                  <br />

                  <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">
                    ACR_AGENT
                  </span>

                  <br />

                  <span className="text-white/30">recovers.</span>
                </h1>

                <p className="mt-7 max-w-xl text-sm leading-7 text-white/40">
                  Autonomous CI/CD failure recovery powered by Docker
                  isolation, KNN root-cause classification and AI-generated
                  repair workflows.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button className="group flex items-center gap-2 bg-white px-5 py-3 text-xs font-bold text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(255,255,255,0.12)]">
                    <Play size={14} fill="currentColor" />

                    LAUNCH PIPELINE

                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </button>

                  <button className="flex items-center gap-2 border border-white/10 bg-white/[0.025] px-5 py-3 text-xs font-semibold text-white/60 transition hover:border-cyan-400/20 hover:text-white">
                    <Activity size={14} />

                    VIEW ACTIVITY
                  </button>
                </div>

                <div className="mt-9 flex flex-wrap gap-7">
                  <MiniStat label="RECOVERY RATE" value="91.8%" />
                  <MiniStat label="AVG. REPAIR" value="38s" />
                  <MiniStat label="AI CONFIDENCE" value="94.2%" />
                </div>
              </div>

              {/* AI CORE */}

              <div className="relative flex min-h-[480px] items-center justify-center overflow-hidden">
                <div className="absolute h-[390px] w-[390px] rounded-full border border-cyan-400/[0.05]" />

                <div className="absolute h-[320px] w-[320px] rounded-full border border-cyan-400/[0.07]" />

                <div className="absolute h-[245px] w-[245px] rounded-full border border-violet-400/[0.1]" />

                <div className="absolute h-[340px] w-[340px] animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-cyan-400/10" />

                <div className="absolute h-[280px] w-[280px] animate-[spin_25s_linear_infinite_reverse] rounded-full border border-dashed border-violet-400/10" />

                {/* CORE */}

                <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-[2rem] border border-cyan-300/20 bg-cyan-300/[0.055] shadow-[0_0_120px_rgba(34,211,238,0.16)]">
                  <div className="absolute inset-3 rounded-[1.5rem] border border-cyan-300/10" />

                  <div className="absolute inset-7 animate-pulse rounded-full bg-cyan-400/[0.05]" />

                  <Bot size={50} className="relative text-cyan-300" />

                  <span className="absolute -bottom-8 whitespace-nowrap font-mono text-[8px] tracking-[0.25em] text-cyan-300/60">
                    ACR CORE // ACTIVE
                  </span>
                </div>

                <CoreNode
                  icon={AlertCircle}
                  label="DETECT"
                  position="left-[5%] top-[20%]"
                />

                <CoreNode
                  icon={Cpu}
                  label="KNN"
                  position="right-[7%] top-[18%]"
                />

                <CoreNode
                  icon={Sparkles}
                  label="GEMINI"
                  position="left-[9%] bottom-[18%]"
                />

                <CoreNode
                  icon={ShieldCheck}
                  label="VERIFY"
                  position="right-[8%] bottom-[18%]"
                />

                <CoreNode
                  icon={Container}
                  label="DOCKER"
                  position="left-[39%] top-[5%]"
                />
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* METRICS                                                          */}
          {/* ---------------------------------------------------------------- */}

          <section className="mt-5 grid grid-cols-2 border border-white/[0.07] bg-white/[0.015] sm:grid-cols-3 lg:grid-cols-6">
            <Metric label="PIPELINES" value="128" change="+12%" />
            <Metric label="SUCCESSFUL" value="104" change="+18%" />
            <Metric label="FAILURES" value="24" change="-8%" />
            <Metric label="HEALED" value="19" change="+24%" />
            <Metric label="ACTIVE RUNS" value="03" change="LIVE" />
            <Metric label="PULL REQUESTS" value="17" change="+5%" />
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* TEAM                                                             */}
          {/* ---------------------------------------------------------------- */}

          <section className="mt-14">
            <SectionTitle
              eyebrow="PROJECT TEAM"
              title="Engineering the recovery system"
              description="The people responsible for designing, developing and validating ACR_AGENT."
            />

            <div className="mt-5 grid gap-px border border-white/[0.07] bg-white/[0.07] lg:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-[#070b10] p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-300/20 bg-cyan-300/[0.05] shadow-[0_0_50px_rgba(34,211,238,0.06)]">
                    <User size={38} className="text-cyan-300/70" />

                    <span className="absolute bottom-2 right-2 h-3 w-3 rounded-full border-2 border-[#070b10] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  </div>

                  <div>
                    <div className="font-mono text-[8px] tracking-[0.3em] text-cyan-300/60">
                      TEAM LEADER
                    </div>

                    <h3 className="mt-3 text-2xl font-semibold">
                      Add Team Leader
                    </h3>

                    <p className="mt-2 text-sm text-white/35">
                      Team Leader / Developer
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="border border-white/[0.07] px-3 py-1.5 font-mono text-[8px] text-white/35">
                        EMAIL
                      </span>

                      <span className="border border-white/[0.07] px-3 py-1.5 font-mono text-[8px] text-white/35">
                        GITHUB
                      </span>

                      <button className="border border-cyan-400/15 bg-cyan-400/[0.05] px-3 py-1.5 font-mono text-[8px] text-cyan-300 transition hover:bg-cyan-400/[0.1]">
                        CONTACT LEADER
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 bg-[#05080c]">
                <TeamMember label="TEAM MEMBER 01" />
                <TeamMember label="TEAM MEMBER 02" />
                <TeamMember label="TEAM MEMBER 03" />
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* LIVE PIPELINE                                                    */}
          {/* ---------------------------------------------------------------- */}

          <section className="mt-14">
            <SectionTitle
              eyebrow="LIVE RECOVERY PIPELINE"
              title="Failure → analysis → healing → verification"
              description="Monitor the autonomous recovery lifecycle in real time."
            />

            <div className="relative mt-5 overflow-x-auto border border-white/[0.07] bg-[#05080c] p-6 sm:p-8">
              <div className="flex min-w-[950px] items-start">
                {pipeline.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex flex-1 items-start"
                    >
                      <div className="flex min-w-[105px] flex-col items-center text-center">
                        <div
                          className={`relative flex h-12 w-12 items-center justify-center border transition ${
                            item.status === "done"
                              ? "border-emerald-400/20 bg-emerald-400/[0.05]"
                              : item.status === "active"
                                ? "border-cyan-400/30 bg-cyan-400/[0.07] shadow-[0_0_35px_rgba(34,211,238,0.12)]"
                                : "border-white/[0.08] bg-white/[0.02]"
                          }`}
                        >
                          <Icon
                            size={17}
                            className={
                              item.status === "done"
                                ? "text-emerald-300"
                                : item.status === "active"
                                  ? "text-cyan-300"
                                  : "text-white/20"
                            }
                          />

                          {item.status === "active" && (
                            <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,1)]" />
                          )}
                        </div>

                        <div className="mt-3 font-mono text-[8px] tracking-wider text-white/45">
                          {item.label}
                        </div>

                        <div
                          className={`mt-1 font-mono text-[7px] uppercase ${
                            item.status === "done"
                              ? "text-emerald-400"
                              : item.status === "active"
                                ? "text-cyan-300"
                                : "text-white/20"
                          }`}
                        >
                          {item.status}
                        </div>
                      </div>

                      {index < pipeline.length - 1 && (
                        <div className="mt-6 h-px flex-1 bg-gradient-to-r from-cyan-400/20 via-cyan-400/10 to-white/[0.05]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* ANALYSIS                                                         */}
          {/* ---------------------------------------------------------------- */}

          <section className="mt-5 grid gap-px border border-white/[0.07] bg-white/[0.07] xl:grid-cols-2">
            {/* ERROR */}

            <div className="bg-[#070b10] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[8px] tracking-[0.25em] text-red-300/60">
                    ERROR SIGNAL
                  </div>

                  <h2 className="mt-2 text-xl font-semibold">
                    Root cause detected
                  </h2>
                </div>

                <div className="flex items-center gap-2 border border-red-400/10 bg-red-400/[0.04] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />

                  <span className="font-mono text-[8px] text-red-300">
                    FAILURE
                  </span>
                </div>
              </div>

              <div className="mt-6 border border-red-400/10 bg-red-400/[0.025] p-5">
                <div className="font-mono text-[9px] text-white/25">
                  frontend/components/Pipeline.tsx:42
                </div>

                <div className="mt-4 font-mono text-xs leading-6 text-red-200/75">
                  Property &quot;status&quot; does not exist on type
                  &quot;PipelineProps&quot;.
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-px bg-white/[0.07] sm:grid-cols-4">
                <DataCell label="TYPE" value="TS ERROR" />
                <DataCell label="KNN" value="94.2%" />
                <DataCell label="SOURCE" value="LOGS" />
                <DataCell label="RETRY" value="02 / 05" />
              </div>
            </div>

            {/* REPAIR */}

            <div className="bg-[#06090d] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[8px] tracking-[0.25em] text-cyan-300/60">
                    AI REPAIR
                  </div>

                  <h2 className="mt-2 text-xl font-semibold">
                    Generated recovery patch
                  </h2>
                </div>

                <Sparkles size={18} className="text-cyan-300/60" />
              </div>

              <div className="mt-6 overflow-hidden border border-white/[0.07] bg-[#030507]">
                <div className="border-b border-white/[0.06] px-4 py-3 font-mono text-[8px] text-white/25">
                  Pipeline.tsx
                </div>

                <div className="p-4 font-mono text-[10px] leading-7">
                  <div className="text-white/25">
                    <span className="mr-5 text-white/15">41</span>
                    const pipeline = createPipeline();
                  </div>

                  <div className="bg-red-500/[0.06] text-red-300/70">
                    <span className="mr-5 text-white/15">42</span>
                    - pipeline.status = &quot;running&quot;;
                  </div>

                  <div className="bg-emerald-500/[0.06] text-emerald-300/80">
                    <span className="mr-5 text-white/15">42</span>
                    + pipeline.setStatus(&quot;running&quot;);
                  </div>

                  <div className="text-white/25">
                    <span className="mr-5 text-white/15">43</span>
                    await pipeline.execute();
                  </div>
                </div>

                <div className="flex gap-2 border-t border-white/[0.06] p-3">
                  <button className="border border-white/[0.08] px-3 py-1.5 text-[9px] text-white/40 transition hover:text-white">
                    VIEW DIFF
                  </button>

                  <button className="border border-cyan-400/15 bg-cyan-400/[0.05] px-3 py-1.5 text-[9px] text-cyan-300 transition hover:bg-cyan-400/[0.1]">
                    APPLY FIX
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* TERMINAL                                                         */}
          {/* ---------------------------------------------------------------- */}

          <section className="mt-14">
            <SectionTitle
              eyebrow="EXECUTION STREAM"
              title="Live terminal"
              description="Real-time execution telemetry from the autonomous worker."
            />

            <div className="mt-5 border border-white/[0.07] bg-[#020304] shadow-[0_0_70px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-3">
                  <Terminal size={15} className="text-cyan-300" />

                  <div>
                    <div className="text-xs font-medium">
                      ACR Worker / Run 024
                    </div>

                    <div className="font-mono text-[8px] text-white/20">
                      DOCKER EXECUTION ENVIRONMENT
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                  <span className="font-mono text-[8px] text-emerald-300">
                    STREAMING
                  </span>
                </div>
              </div>

              <div className="p-5 font-mono text-[10px] leading-7">
                <TerminalLine
                  time="18:32:04"
                  text="Repository connected"
                />

                <TerminalLine
                  time="18:32:08"
                  text="Docker environment prepared"
                />

                <TerminalLine
                  time="18:32:15"
                  text="Build started"
                />

                <TerminalLine
                  time="18:32:18"
                  text="TypeScript compilation failed"
                  error
                />

                <TerminalLine
                  time="18:32:21"
                  text="Source context extracted"
                />

                <TerminalLine
                  time="18:32:25"
                  text="KNN root cause classification"
                />

                <TerminalLine
                  time="18:32:30"
                  text="Gemini repair generated"
                />

                <TerminalLine
                  time="18:32:40"
                  text="Repair applied"
                />

                <TerminalLine
                  time="18:32:48"
                  text="Validation started"
                />

                <TerminalLine
                  time="18:32:51"
                  text="Pipeline validation successful"
                  success
                />

                <div className="mt-3 text-cyan-300">
                  <span>$</span>

                  <span className="ml-2">acr-agent --watch</span>

                  <span className="ml-1 animate-pulse">▌</span>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* ARCHITECTURE                                                     */}
          {/* ---------------------------------------------------------------- */}

          <section className="mt-14">
            <SectionTitle
              eyebrow="SYSTEM ARCHITECTURE"
              title="Inside the autonomous recovery loop"
              description="The core technologies responsible for detection, classification, repair and recovery."
            />

            <div className="relative mt-5 overflow-hidden border border-white/[0.07] bg-[#06090d] p-6 sm:p-10">
              <div className="grid gap-3 md:grid-cols-5">
                <ArchitectureCard
                  number="01"
                  icon={Github}
                  title="REPOSITORY"
                  description="GitHub source"
                />

                <ArchitectureCard
                  number="02"
                  icon={Container}
                  title="DOCKER"
                  description="Isolated runtime"
                />

                <ArchitectureCard
                  number="03"
                  icon={Cpu}
                  title="KNN"
                  description="Root cause"
                />

                <ArchitectureCard
                  number="04"
                  icon={Bot}
                  title="GEMINI"
                  description="Repair generation"
                />

                <ArchitectureCard
                  number="05"
                  icon={GitCommit}
                  title="RECOVERY"
                  description="Verified change"
                />
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* ADDITIONAL STATUS                                                */}
          {/* ---------------------------------------------------------------- */}

          <section className="mt-5 grid gap-5 lg:grid-cols-3">
            <StatusCard
              icon={Server}
              title="BACKEND"
              value="ONLINE"
              description="FastAPI service responding"
              progress="96%"
            />

            <StatusCard
              icon={Cpu}
              title="KNN ENGINE"
              value="ACTIVE"
              description="Root cause classifier ready"
              progress="94%"
            />

            <StatusCard
              icon={Sparkles}
              title="AI HEALING"
              value="READY"
              description="Gemini repair generation available"
              progress="91%"
            />
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* FOOTER                                                           */}
          {/* ---------------------------------------------------------------- */}

          <footer className="mt-14 border-t border-white/[0.07] py-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="font-mono text-[9px] tracking-[0.25em] text-white/30">
                  ACR_AGENT
                </div>

                <div className="mt-1 text-[9px] text-white/15">
                  Autonomous CI/CD Healing System
                </div>
              </div>

              <div className="flex items-center gap-5 font-mono text-[8px] tracking-[0.18em] text-white/20">
                <span>AI</span>
                <span>KNN</span>
                <span>DOCKER</span>
                <span>GITHUB</span>
                <span>CI/CD</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* TELEMETRY                                                                 */
/* -------------------------------------------------------------------------- */

function Telemetry({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

        <span className="font-mono text-[8px] text-white/30">
          {label}
        </span>
      </div>

      <span className="font-mono text-[8px] text-emerald-400/70">
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CORE NODE                                                                  */
/* -------------------------------------------------------------------------- */

function CoreNode({
  icon: Icon,
  label,
  position,
}: {
  icon: typeof Bot;
  label: string;
  position: string;
}) {
  return (
    <div
      className={`absolute ${position} flex items-center gap-2 border border-white/[0.08] bg-black/60 px-3 py-2 backdrop-blur-md`}
    >
      <Icon size={11} className="text-cyan-300/80" />

      <span className="font-mono text-[7px] tracking-[0.18em] text-white/40">
        {label}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* METRIC                                                                     */
/* -------------------------------------------------------------------------- */

function Metric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="border-r border-white/[0.06] p-4 last:border-r-0 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] tracking-[0.16em] text-white/25">
          {label}
        </span>

        <span className="font-mono text-[8px] text-emerald-400/70">
          {change}
        </span>
      </div>

      <div className="mt-4 text-2xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MINI STAT                                                                  */
/* -------------------------------------------------------------------------- */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="font-mono text-[7px] tracking-[0.18em] text-white/20">
        {label}
      </div>

      <div className="mt-1 text-sm font-semibold text-white/75">
        {value}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION TITLE                                                              */
/* -------------------------------------------------------------------------- */

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <div className="font-mono text-[8px] tracking-[0.3em] text-cyan-300/55">
        {eyebrow}
      </div>

      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-xs leading-6 text-white/30 sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TEAM MEMBER                                                                */
/* -------------------------------------------------------------------------- */

function TeamMember({
  label,
}: {
  label: string;
}) {
  return (
    <div className="border-l border-white/[0.06] p-6 transition hover:bg-white/[0.015]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025]">
        <User size={19} className="text-white/30" />
      </div>

      <div className="mt-5 font-mono text-[8px] tracking-[0.2em] text-white/25">
        {label}
      </div>

      <div className="mt-2 text-sm text-white/50">
        Developer
      </div>

      <div className="mt-4 h-px bg-white/[0.05]" />

      <div className="mt-4 flex items-center gap-2 font-mono text-[7px] tracking-wider text-white/15">
        <Circle size={5} className="fill-emerald-400 text-emerald-400" />
        PROFILE ACTIVE
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DATA CELL                                                                  */
/* -------------------------------------------------------------------------- */

function DataCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#05080c] p-3">
      <div className="font-mono text-[7px] tracking-wider text-white/20">
        {label}
      </div>

      <div className="mt-2 font-mono text-[9px] text-white/55">
        {value}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TERMINAL LINE                                                              */
/* -------------------------------------------------------------------------- */

function TerminalLine({
  time,
  text,
  error,
  success,
}: {
  time: string;
  text: string;
  error?: boolean;
  success?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <span className="shrink-0 text-white/15">
        [{time}]
      </span>

      <span
        className={
          error
            ? "text-red-300/75"
            : success
              ? "text-emerald-300"
              : "text-white/40"
        }
      >
        {success && (
          <Check size={11} className="mr-1 inline" />
        )}

        {text}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ARCHITECTURE CARD                                                          */
/* -------------------------------------------------------------------------- */

function ArchitectureCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: typeof Github;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-cyan-400/[0.025] hover:shadow-[0_10px_40px_rgba(34,211,238,0.05)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] text-white/15">
          {number}
        </span>

        <Icon size={16} className="text-cyan-300/50" />
      </div>

      <div className="mt-8 font-mono text-[9px] tracking-[0.18em] text-white/55">
        {title}
      </div>

      <div className="mt-2 text-[10px] text-white/25">
        {description}
      </div>

      <ArrowRight
        size={10}
        className="absolute bottom-4 right-4 text-white/10 transition group-hover:translate-x-1 group-hover:text-cyan-300/60"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STATUS CARD                                                                */
/* -------------------------------------------------------------------------- */

function StatusCard({
  icon: Icon,
  title,
  value,
  description,
  progress,
}: {
  icon: typeof Server;
  title: string;
  value: string;
  description: string;
  progress: string;
}) {
  return (
    <div className="group border border-white/[0.07] bg-[#06090d] p-6 transition hover:border-cyan-400/15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border border-cyan-400/10 bg-cyan-400/[0.04]">
            <Icon size={15} className="text-cyan-300/70" />
          </div>

          <span className="font-mono text-[8px] tracking-[0.2em] text-white/30">
            {title}
          </span>
        </div>

        <CheckCircle2
          size={15}
          className="text-emerald-400/60"
        />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <div className="text-xl font-semibold">
            {value}
          </div>

          <div className="mt-1 text-[10px] text-white/25">
            {description}
          </div>
        </div>

        <div className="font-mono text-[9px] text-cyan-300/60">
          {progress}
        </div>
      </div>

      <div className="mt-5 h-1 overflow-hidden bg-white/[0.05]">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-700 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          style={{ width: progress }}
        />
      </div>
    </div>
  );
}
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Container,
  GitPullRequest,
  ShieldCheck,
  Zap,
} from "lucide-react";

const pipeline = [
  "Repository",
  "Analyze",
  "Classify",
  "AI Fix",
  "Validate",
  "Pull Request",
];

const features = [
  {
    icon: BrainCircuit,
    number: "01",
    title: "AI ERROR ANALYSIS",
    description:
      "ACR_AGENT analyzes build, syntax, type and other detected failures and identifies the relevant source context.",
  },
  {
    icon: Bot,
    number: "02",
    title: "AUTONOMOUS HEALING",
    description:
      "Gemini generates a structured repair which can be applied automatically to the working repository.",
  },
  {
    icon: Container,
    number: "03",
    title: "ISOLATED VALIDATION",
    description:
      "Repository operations and validation run inside an isolated Docker worker environment.",
  },
  {
    icon: GitPullRequest,
    number: "04",
    title: "AUTOMATED PR",
    description:
      "After successful validation, ACR_AGENT can commit the repair, push the branch and create a Pull Request.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <Zap size={18} fill="currentColor" />
            </div>

            <div>
              <p className="text-sm font-black tracking-[0.25em]">
                ACR_AGENT
              </p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">
                Autonomous Code Repair
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#how" className="text-sm text-white/60 hover:text-white">
              How it works
            </a>

            <a
              href="#features"
              className="text-sm text-white/60 hover:text-white"
            >
              Features
            </a>

            <Link
              href="/login"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm hover:bg-white hover:text-black"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.10),transparent_30%)]" />

        <div className="absolute left-10 top-40 h-32 w-32 rounded-full border border-white/10" />
        <div className="absolute right-20 top-52 h-3 w-3 rounded-full bg-white shadow-[0_0_30px_white]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-6 py-28 lg:grid-cols-[1.25fr_0.75fr] lg:px-10">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-white/50" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                Autonomous DevOps Intelligence
              </span>
            </div>

            <h1 className="max-w-5xl text-[clamp(4rem,10vw,9rem)] font-black leading-[0.78] tracking-[-0.07em]">
              YOUR
              <br />
              PIPELINE
              <br />
              <span className="text-white/30">FAILED.</span>
            </h1>

            <h2 className="mt-10 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
              Let the agent{" "}
              <span className="text-white/40">heal it.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/50 md:text-lg">
              ACR_AGENT analyzes software failures, classifies detected
              problems, generates AI-powered fixes, validates them and
              automates the GitHub Pull Request workflow.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 font-bold text-black transition hover:scale-[1.02]"
              >
                Start Healing
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#how"
                className="rounded-full border border-white/15 px-7 py-4 font-semibold text-white/70 hover:bg-white/5"
              >
                Explore System
              </a>
            </div>
          </div>

          {/* HERO SYSTEM CARD */}
          <div className="flex items-center">
            <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                    Agent status
                  </p>
                  <p className="mt-1 font-bold">READY TO HEAL</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  ONLINE
                </div>
              </div>

              <div className="space-y-2">
                {pipeline.map((item, index) => (
                  <div key={item}>
                    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/30 p-4">
                      <span className="text-xs text-white/30">
                        0{index + 1}
                      </span>

                      <span className="flex-1 text-sm font-bold tracking-wide">
                        {item}
                      </span>

                      <span className="text-xs text-white/30">
                        {index === 0
                          ? "INPUT"
                          : index === pipeline.length - 1
                            ? "OUTPUT"
                            : "AGENT"}
                      </span>
                    </div>

                    {index !== pipeline.length - 1 && (
                      <div className="ml-7 h-3 w-px bg-white/10" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-white p-4 text-black">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} />
                  <div>
                    <p className="text-xs font-black">VALIDATION READY</p>
                    <p className="text-[10px] text-black/50">
                      Docker isolated execution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-white/10 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">
                System workflow
              </p>

              <h2 className="mt-5 text-5xl font-black tracking-[-0.05em] md:text-7xl">
                FROM
                <br />
                ERROR
                <br />
                TO PR.
              </h2>
            </div>

            <div className="space-y-0">
              {pipeline.map((item, index) => (
                <div
                  key={item}
                  className="group flex items-center border-b border-white/10 py-7"
                >
                  <span className="w-16 text-xs text-white/30">
                    0{index + 1}
                  </span>

                  <span className="flex-1 text-2xl font-bold tracking-tight transition group-hover:translate-x-2 md:text-4xl">
                    {item}
                  </span>

                  <ArrowRight
                    size={22}
                    className="text-white/20 transition group-hover:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-white/10 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">
              Core capabilities
            </p>

            <h2 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.05em] md:text-7xl">
              BUILT TO
              <br />
              REPAIR SOFTWARE.
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.number}
                  className="bg-[#0b0b0b] p-8 transition hover:bg-[#111111] md:p-12"
                >
                  <div className="flex items-start justify-between">
                    <Icon size={30} strokeWidth={1.5} />

                    <span className="text-xs text-white/20">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-20 text-2xl font-black tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-4 max-w-md text-sm leading-6 text-white/40">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">
            Ready
          </p>

          <h2 className="mt-6 text-6xl font-black tracking-[-0.06em] md:text-8xl">
            HEAL YOUR
            <br />
            PIPELINE.
          </h2>

          <Link
            href="/login"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-black"
          >
            Launch ACR_AGENT
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 text-xs text-white/30 md:flex-row lg:px-10">
          <p>© 2026 ACR_AGENT</p>
          <p>Autonomous Code Repair Platform</p>
        </div>
      </footer>
    </main>
  );
}
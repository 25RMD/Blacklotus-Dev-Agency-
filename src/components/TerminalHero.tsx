import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'

const terminalLog = [
  {
    command: 'deploy edge-workers --region=fra --replicas=12',
    response: 'Provisioned 12 edge workers across FRA/AMS POPs. Cold starts < 35ms.',
    status: 'success',
  },
  {
    command: 'audit pipelines --targets billing,ops',
    response: '3 stale services isolated · automated rollbacks queued.',
    status: 'warning',
  },
  {
    command: 'run chaos-suite --env=prod --blast=0.15',
    response: 'Resilience score 98.4 · no cascading faults detected.',
    status: 'success',
  },
  {
    command: 'scale api-gateway --factor=2.4',
    response: 'Latency down 41% · autoscaling policy updated.',
    status: 'success',
  },
  {
    command: 'verify secrets --scope platform',
    response: 'All vault mounts rotated · drift = 0.',
    status: 'success',
  },
]

const heroStats = [
  {
    label: 'Faster Load Times',
    value: '40%',
    subtext: 'average improvement',
  },
  {
    label: 'Projects Delivered',
    value: '50+',
    subtext: 'happy clients',
  },
]

export function TerminalHero() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % terminalLog.length)
    }, 3600)
    return () => clearInterval(id)
  }, [])

  const visibleLines = useMemo(() => {
    const rotated = [
      ...terminalLog.slice(activeIndex),
      ...terminalLog.slice(0, activeIndex),
    ]
    return rotated.slice(0, 4)
  }, [activeIndex])

  return (
    <section className="w-full px-6 pt-10 pb-24 md:pt-16 bg-black/80 backdrop-blur-sm relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-[1.05fr_0.95fr] items-center relative z-10">
        <div>
          <p className="font-mono text-sm tracking-widest text-cyan-300/90 mb-6 uppercase font-medium">
            Web Development Agency
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tighter text-balance text-white">
            We build websites and apps that help your business grow.
          </h1>
          <p className="text-xl text-zinc-400 mt-8 max-w-2xl leading-relaxed">
            From simple landing pages to complex web applications. We handle the tech so you can focus on your business.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:blacklotusenquiry@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium tracking-tight hover:scale-105 transition"
            >
              Get a Free Quote
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm text-white/80 hover:text-white hover:border-white transition"
            >
              See Our Work
            </button>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 p-5 bg-zinc-900">
                <p className="text-4xl font-light tracking-tighter text-white">{stat.value}</p>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-500 mt-3">{stat.label}</p>
                <p className="text-xs text-zinc-600 mt-1">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 bg-cyan-500/20 blur-3xl rounded-3xl" />
          <div className="relative rounded-[26px] border border-white/10 bg-black shadow-[0_0_120px_rgba(0,255,255,0.1)] overflow-hidden">
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                Black Lotus · secure console
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </header>

            <div className="px-5 py-6 font-mono text-sm space-y-4">
              {visibleLines.map((line, idx) => (
                <motion.div
                  key={`${line.command}-${idx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1"
                >
                  <p className="text-cyan-200 flex gap-2">
                    <span className="text-zinc-500">$</span>
                    {line.command}
                  </p>
                  <p className="text-zinc-400 pl-5">{line.response}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] pl-5 ${
                      line.status === 'success' ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    ● {line.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
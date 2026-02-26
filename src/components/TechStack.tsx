import { motion } from 'framer-motion'
import { Layers, Cloud, Code2, Database } from 'lucide-react'

const stack = [
  {
    icon: Layers,
    title: 'Frontend',
    items: ['React 19', 'Next.js', 'Remix', 'Vite', 'Tailwind v4'],
  },
  {
    icon: Cloud,
    title: 'Infrastructure',
    items: ['AWS', 'Vercel', 'Fly.io', 'Cloudflare', 'Docker'],
  },
  {
    icon: Database,
    title: 'Data',
    items: ['Postgres', 'Redis', 'Supabase', 'PlanetScale', 'Prisma'],
  },
  {
    icon: Code2,
    title: 'Backend',
    items: ['Node 22', 'Bun', 'tRPC', 'Go', 'Python'],
  },
]

export function TechStack() {
  return (
    <section className="w-full px-6 py-24 md:py-32 border-b border-white/5 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-sm tracking-widest text-cyan-300/90 mb-4 uppercase font-medium"
        >
          Our Tools
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-white"
        >
          Built with the best technology.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 mt-6 text-lg leading-relaxed"
        >
          We use modern, reliable tools to build fast and secure websites.
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stack.map(({ icon: Icon, title, items }, i) => (
          <motion.div 
            key={title} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl border border-white/10 bg-black p-6 hover:border-white/20 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-mono text-zinc-400 uppercase tracking-widest font-medium">{title}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-sm font-medium text-zinc-300 hover:text-white hover:border-white/20 transition-colors cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  )
}
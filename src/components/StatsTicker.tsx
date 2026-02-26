import { motion } from 'framer-motion'

export function StatsTicker() {
  const stats = [
    { label: 'Projects Completed', value: '50+' },
    { label: 'Happy Clients', value: '100%' },
    { label: 'Years Experience', value: '5+' },
    { label: 'Response Time', value: '24h' },
  ]

  return (
    <section className="w-full border-y border-white/5 bg-black/90 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center gap-2"
          >
            <span className="text-4xl md:text-5xl font-serif font-semibold tracking-tighter text-white">{stat.value}</span>
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium font-mono">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
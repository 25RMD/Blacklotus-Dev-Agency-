import { motion } from 'framer-motion'

export function ProcessFlow() {
  const steps = [
    { num: '01', title: 'Discovery Call', desc: 'We learn about your business, goals, and what you need.' },
    { num: '02', title: 'Proposal & Plan', desc: 'We create a clear plan with timeline and pricing.' },
    { num: '03', title: 'Build & Review', desc: 'We build your project and get your feedback along the way.' },
    { num: '04', title: 'Launch & Support', desc: 'We launch your site and provide ongoing support.' },
  ]

  return (
    <section id="process" className="w-full bg-black/85 backdrop-blur-sm border-y border-white/5 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-semibold tracking-tight mb-16 text-center text-white"
        >
          How It Works
        </motion.h2>
        
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:block absolute top-6 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent origin-left" 
          />

          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-sm font-mono font-medium z-10 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">{step.title}</h3>
              <p className="text-base text-zinc-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
import { Server, Zap, Database, Globe } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const services = [
  {
    icon: <Server className="w-6 h-6" />,
    title: "Website Development",
    desc: "Beautiful, fast websites that look great on any device and help you get more customers."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Web Applications",
    desc: "Custom apps and dashboards to run your business more efficiently."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "E-Commerce",
    desc: "Online stores that make it easy for customers to buy from you."
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Maintenance & Support",
    desc: "We keep your site running smoothly and fix issues fast."
  }
]

export function ServicesGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -50])
  const yCardsOdd = useTransform(scrollYProgress, [0, 1], [0, -30])
  const yCardsEven = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section ref={containerRef} className="w-full px-6 py-24 md:py-32 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <motion.div
          style={{ y: yTitle }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight mb-6 text-white">What We Do</h2>
          <p className="text-lg text-zinc-400 max-w-md leading-relaxed">We build digital products that help businesses succeed online.</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-sm font-mono font-medium tracking-wide border-b border-white/30 pb-1 hover:border-white transition-colors text-zinc-300 hover:text-white"
        >
          VIEW FULL CAPABILITIES
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, i) => (
          <motion.div 
            key={i} 
            style={{ y: i % 2 === 0 ? yCardsOdd : yCardsEven }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group p-8 rounded-2xl bg-black border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white tracking-tight">{service.title}</h3>
            <p className="text-base text-zinc-400 leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  )
}
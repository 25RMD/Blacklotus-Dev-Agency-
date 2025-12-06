import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function WhatWeDo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const yStats = useTransform(scrollYProgress, [0, 1], [100, -100])
  const yText = useTransform(scrollYProgress, [0, 1], [0, -50])

  const heroText = "We are developers, designers, strategists and problem-solvers. We work together to build powerful digital products that drive business growth."
  const words = heroText.split(" ")

  const stats = [
    { icon: "🌐", value: "50+", label: "Successful projects delivered for startups and enterprises" },
    { icon: "👥", value: "1M+", label: "Users impacted through our digital solutions" },
    { icon: "📦", value: "15+", label: "Industries served from fintech to healthcare" },
  ]

  return (
    <section ref={containerRef} className="w-full bg-[#f5f5f0] py-24 md:py-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Section Label */}
        <p className="text-xs font-sans uppercase tracking-widest text-zinc-500 mb-8">
          What We Do
        </p>

        {/* Main Headline */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-medium leading-[1.05] tracking-tight text-black max-w-5xl mb-16 relative z-10">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.4, delay: i * 0.015 }}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* Description Paragraph */}
        <motion.p 
          style={{ y: yText }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-20 ml-auto mr-0 md:mr-24 relative z-10"
        >
          We go beyond the traditional agency model and empower businesses across different industries to realize their digital ambitions. From the startup founder looking for a scalable platform, to the enterprise team modernizing legacy systems — we have the experience, the dedication, the skills and the resources to make seemingly impossible projects happen. Our clients don't hire us, they partner with us. And in doing so, become industry leaders themselves.
        </motion.p>

        {/* Stats Grid */}
        <motion.div 
          style={{ y: yStats }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-5xl md:text-6xl font-sans font-medium text-black">{stat.value}</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-[200px]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

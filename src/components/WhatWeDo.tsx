import { motion } from 'framer-motion'

export function WhatWeDo() {
  const heroText = "We build high-performance digital products that drive growth."
  const words = heroText.split(" ")

  return (
    <section id="what-we-do" className="w-full bg-black py-24 md:py-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">

        {/* Section Label - fade in */}
        <motion.p
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 mb-7"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          What We Do
        </motion.p>

        {/* Main Headline - word by word fade */}
        <h2 className="text-[clamp(2rem,5.2vw,5.2rem)] font-display font-semibold leading-[0.98] tracking-[-0.02em] text-white max-w-5xl mb-12 relative z-10">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.02
              }}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </h2>
      </div>
    </section>
  )
}

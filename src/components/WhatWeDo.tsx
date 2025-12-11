import { motion, useScroll, useTransform, useInView, useMotionValue, animate } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Globe, Users, Briefcase } from 'lucide-react'

// Animated counter component
function AnimatedCounter({ value, formatter = (v: number) => Math.floor(v).toString() }: { value: number; formatter?: (v: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1], // Premium easeOutQuart
      })
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatter(latest)
      }
    })
    return unsubscribe
  }, [motionValue, formatter])

  return <span ref={ref}>{formatter(0)}</span>
}

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
    {
      icon: Globe,
      value: 10,
      formatter: (v: number) => Math.floor(v) + "+",
      label: "Successful projects delivered for startups and enterprises"
    },
    {
      icon: Users,
      value: 1200, // Count to 1200 for smooth animation
      formatter: (v: number) => (v / 1000).toFixed(1) + "k+", // Format as 1.2k+
      label: "Users impacted through our digital solutions"
    },
    {
      icon: Briefcase,
      value: 15,
      formatter: (v: number) => Math.floor(v) + "+",
      label: "Industries served from fintech to healthcare"
    },
  ]

  // Fade in animation variants for typography
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay
      }
    })
  }

  return (
    <section id="what-we-do" ref={containerRef} className="w-full bg-[#f5f5f0] py-24 md:py-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">

        {/* Section Label - fade in */}
        <motion.p
          className="text-xs font-sans uppercase tracking-widest text-zinc-500 mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          What We Do
        </motion.p>

        {/* Main Headline - word by word fade */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-medium leading-[1.05] tracking-tight text-black max-w-5xl mb-16 relative z-10">
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

        {/* Description Paragraph - minimal fade */}
        <motion.p
          style={{ y: yText }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
          className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-20 ml-auto mr-0 md:mr-24 relative z-10"
        >
          We go beyond the traditional agency model and empower businesses across different industries to realize their digital ambitions. From the startup founder looking for a scalable platform, to the enterprise team modernizing legacy systems — we have the experience, the dedication, the skills and the resources to make seemingly impossible projects happen. Our clients don't hire us, they partner with us. And in doing so, become industry leaders themselves.
        </motion.p>

        {/* Stats Grid with Animated Counters */}
        <motion.div
          style={{ y: yStats }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.15
              }}
              className="flex flex-col"
            >
              {/* Icon with subtle fade */}
              <motion.div
                className="flex items-center gap-3 mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 + 0.2 }}
              >
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-black" strokeWidth={1.5} />
                <span className="text-5xl md:text-6xl font-sans font-medium text-black tabular-nums">
                  <AnimatedCounter value={stat.value} formatter={stat.formatter} />
                </span>
              </motion.div>
              {/* Label with fade */}
              <motion.p
                className="text-sm text-zinc-500 leading-relaxed max-w-[200px]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 + 0.4 }}
              >
                {stat.label}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

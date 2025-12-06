import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue, useSpring } from 'framer-motion'

const projects = [
  {
    id: "01",
    title: "FinFlow Platform",
    client: "Apex Capital",
    year: "2024",
    role: "Full-Stack",
    description: "A comprehensive financial dashboard allowing real-time tracking of assets across multiple global markets.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "MedConnect Portal",
    client: "HealthFirst",
    year: "2024",
    role: "Web App",
    description: "Secure patient-doctor communication portal with integrated scheduling and telemedicine capabilities.",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Velocity Dashboard",
    client: "TechVentures",
    year: "2023",
    role: "SaaS Platform",
    description: "High-performance analytics platform for tracking startup growth metrics and velocity.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop"
  },
]

export function ProjectSlider() {
  const targetRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(1)

  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  // Add delay: first 10% and last 10% are dead zones
  const xRaw = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-200%"])
  const x = useSpring(xRaw, { stiffness: 100, damping: 30, restDelta: 0.001 })
  
  const progressScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1])
  const yFooter = useTransform(scrollYProgress, [0, 1], [0, -20])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const adjustedProgress = Math.max(0, Math.min(1, (latest - 0.1) / 0.8))
    const rawIndex = Math.ceil(adjustedProgress * projects.length)
    const index = Math.min(Math.max(rawIndex, 1), projects.length)
    if (index !== currentIndex) setCurrentIndex(index)
  })

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-black">
      {/* Sticky container */}
      <div className="sticky top-0 flex h-screen items-center overflow-x-clip overflow-y-visible">
        {/* Horizontal sliding container */}
        <motion.div style={{ x }} className="flex">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} scrollYProgress={scrollYProgress} />
          ))}
        </motion.div>

        {/* Bottom Footer Bar - constrained width */}
        <motion.div 
          style={{ y: yFooter }}
          className="absolute bottom-5 left-0 w-full z-50 px-8 md:px-16 pb-8"
        >
          {/* Progress bar acts as top divider */}
          <div className="w-full h-px bg-white/20 mb-6">
            <motion.div
              style={{ scaleX: progressScale }}
              className="h-full bg-white origin-left"
            />
          </div>

          {/* Footer content */}
          <div className="flex justify-between items-center text-white">
            <div className="font-mono text-sm tracking-widest">
              [{currentIndex}/{projects.length}]
            </div>
            <a href="#" className="flex items-center gap-2 group cursor-pointer uppercase font-medium tracking-widest text-sm hover:opacity-70 transition-opacity">
              View All Projects
              <span className="text-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">↗</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProjectCard({ project, scrollYProgress }: { project: typeof projects[0], scrollYProgress: MotionValue<number> }) {
  const xImage = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

  return (
    <div className="relative h-screen w-screen flex-shrink-0 bg-black text-white flex items-center justify-center p-6 md:p-16 box-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-zinc-900/0 to-black/80 z-10 pointer-events-none" />

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-20">

        {/* LEFT: Title - high z-index to appear above image */}
        <div className="md:col-span-3 order-2 md:order-1 relative z-50 overflow-visible">
          <span className="block text-xs font-mono text-zinc-500 mb-4 uppercase tracking-widest">
            {project.client} — {project.year}
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter mb-6 whitespace-nowrap">
            {project.title.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h2>
          <div className="h-px w-12 bg-white/30 my-6" />
          <p className="text-zinc-400 text-sm md:text-base max-w-xs leading-relaxed">
            {project.description}
          </p>
          <div className="mt-8 flex gap-4">
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase tracking-wider">
              {project.role}
            </span>
          </div>
        </div>

        {/* RIGHT: Image - Parallax Effect */}
        <div className="md:col-span-9 order-1 md:order-2 relative h-[50vh] md:h-[70vh] w-full overflow-hidden rounded-sm">
          <motion.img
            style={{ x: xImage }}
            src={project.img}
            alt={project.title}
            className="absolute inset-0 w-[120%] h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </div>
    </div>
  )
}

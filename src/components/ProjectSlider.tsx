import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue, useSpring } from 'framer-motion'

const projects = [
  {
    id: "01",
    title: "EE Wellness Hub",
    client: "EE Wellness Hub",
    year: "2024",
    role: "Full-Stack Website & App",
    description: "A complete digital ecosystem including a website and mobile app for EE Wellness Hub. (eewellnesshub.com)",
    img: "/projects/wellness.jpeg"
  },
  {
    id: "02",
    title: "MAGA Foundation",
    client: "Making Africa Great Again",
    year: "2024",
    role: "Full-Stack Website",
    description: "A fullstack website for an NGO focused on empowering African communities. (makingafricagreatagain.org)",
    img: "/projects/ng.jpeg"
  },
  {
    id: "03",
    title: "King Royal Events",
    client: "King Royal Events",
    year: "2024",
    role: "Full-Stack Website",
    description: "A fullstack website for an event center located in Maiduguri. (kingroyal-events.com)",
    img: "/projects/event.jpeg"
  }
]

export function ProjectSlider() {
  const targetRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(1)

  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  // Add delay: first 10% and last 10% are dead zones
  const xRaw = useTransform(scrollYProgress, [0.1, 0.9], [0, -(projects.length - 1) * 100])
  const xSpring = useSpring(xRaw, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const x = useTransform(xSpring, (value) => `${value}vw`)

  const progressScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1])
  const yFooter = useTransform(scrollYProgress, [0, 1], [0, -20])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const adjustedProgress = Math.max(0, Math.min(1, (latest - 0.1) / 0.8))
    const rawIndex = Math.ceil(adjustedProgress * projects.length)
    const index = Math.min(Math.max(rawIndex, 1), projects.length)
    if (index !== currentIndex) setCurrentIndex(index)
  })

  return (
    <section id="projects" ref={targetRef} className="relative h-[400vh] bg-black">
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
          className="absolute bottom-4 md:bottom-18 left-0 w-full z-50 px-6 md:px-16 pb-4 md:pb-8 flex justify-center"
        >
          <div className="w-full max-w-7xl">
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProjectCard({ project, scrollYProgress: _scrollYProgress }: { project: typeof projects[0], scrollYProgress: MotionValue<number> }) {
  return (
    <div className="relative h-screen w-screen flex-shrink-0 bg-black text-white flex items-start md:items-center justify-center pt-20 md:pt-0 p-6 pb-24 md:p-16 box-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-zinc-900/0 to-black/80 z-10 pointer-events-none" />

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center relative z-20">

        {/* LEFT: Title - high z-index to appear above image */}
        <div className="md:col-span-4 md:col-start-2 order-2 md:order-1 relative z-50 overflow-visible">
          <span className="block text-xs font-mono text-zinc-400 mb-2 md:mb-4 uppercase tracking-widest">
            project {project.id}
          </span>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.9] tracking-tighter mb-3 md:mb-6 mix-blend-difference">
            {project.title}
          </h2>
          <div className="h-px w-12 bg-white/30 my-3 md:my-6" />
          <p className="text-zinc-400 text-sm md:text-base max-w-xs leading-relaxed">
            {project.description}
          </p>
          <div className="mt-4 md:mt-8 flex gap-4">
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase tracking-wider">
              {project.role}
            </span>
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="md:col-span-6 order-1 md:order-2 relative h-[30vh] md:h-[70vh] w-full overflow-hidden rounded-sm">
          <motion.img
            src={project.img}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-700"
          />
        </div>
      </div>
    </div>
  )
}

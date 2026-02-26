import { useRef, useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router'
import { projects } from '../lib/projects'

const CARD_W = 220
const CARD_H = 300
const CARD_SPACING = 240

export function ProjectSlider() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollValRef = useRef({ current: 0 })
  const rafRef = useRef<number>(0)
  const [cardTransforms, setCardTransforms] = useState<
    { x: number; z: number; rotateY: number; opacity: number; visible: boolean; index: number }[]
  >([])
  const [currentIndex, setCurrentIndex] = useState(1)

  const totalWidth = projects.length * CARD_SPACING
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const isHoveredRef = useRef(false)

  // Track continuous scroll velocity multiplier
  const velocityMultiplier = useRef(1)

  useEffect(() => {
    isHoveredRef.current = hoveredIndex !== null
  }, [hoveredIndex])

  // Increase speed when wheel scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Scale scroll delta into a velocity multiplier (absolute value)
      const additionalVelocity = Math.abs(e.deltaY) * 0.05
      // Cap maximum velocity to prevent chaotic spins
      velocityMultiplier.current = Math.min(velocityMultiplier.current + additionalVelocity, 12)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  const computeTransforms = useCallback((scrollPos: number) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200

    return projects.map((_, i) => {
      let vx = i * CARD_SPACING - scrollPos
      // Infinite wrap
      while (vx < -totalWidth / 2) vx += totalWidth
      while (vx > totalWidth / 2) vx -= totalWidth

      const visible = Math.abs(vx) < vw
      const progress = vx / (vw / 1.5)
      const clamped = Math.max(-1, Math.min(1, progress))
      const z = -Math.pow(Math.abs(clamped), 2) * 500
      const rotateY = clamped * 45
      const opacity = Math.max(0, 1 - Math.pow(Math.abs(clamped), 2.5))

      return { x: vx, z, rotateY, opacity, visible, index: i }
    })
  }, [totalWidth])

  const animate = useCallback(() => {
    const section = sectionRef.current
    if (!section) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    const sv = scrollValRef.current

    // Decay the multiplier smoothly back to 1
    if (velocityMultiplier.current > 1) {
      velocityMultiplier.current += (1 - velocityMultiplier.current) * 0.05 // Ease factor
    }

    // Automatically advance unless hovered (hover respects the velocity to gracefully slow)
    if (!isHoveredRef.current) {
      sv.current += 1.5 * velocityMultiplier.current
    }

    const transforms = computeTransforms(sv.current)
    setCardTransforms(transforms)

    // Current focused index: find the tile closest to center (x = 0)
    let bestDist = Infinity
    let bestIdx = 0
    transforms.forEach((t) => {
      if (Math.abs(t.x) < bestDist) {
        bestDist = Math.abs(t.x)
        bestIdx = t.index
      }
    })
    setCurrentIndex(bestIdx + 1)

    rafRef.current = requestAnimationFrame(animate)
  }, [computeTransforms])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  return (
    <section id="projects" ref={sectionRef} className="relative bg-black select-none h-screen min-h-[700px] flex flex-col justify-center overflow-hidden w-full">
      <div className="w-full flex flex-col justify-center overflow-hidden">
        {/* Section header */}
        <div className="px-6 md:px-16 mb-8 md:mb-12 max-w-7xl mx-auto w-full flex justify-between items-end">
          <div>
            <span className="block text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] mb-2">
              Selected Work
            </span>
            <h2 className="text-[clamp(2.4rem,6.8vw,6rem)] font-display font-semibold text-white tracking-[-0.03em] leading-[0.92]">
              Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="flex items-center gap-2 group cursor-pointer uppercase font-medium tracking-[0.16em] text-[11px] text-white hover:opacity-70 transition-opacity"
          >
            View All
            <span className="text-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
              ↗
            </span>
          </Link>
        </div>

        {/* 3D Gallery Viewport */}
        <div
          style={{ perspective: 1200 }}
          className="relative w-full h-[50vh] md:h-[55vh] overflow-hidden flex items-center justify-center"
        >
          <div
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {cardTransforms.map((ct) => {
              if (!ct.visible) return null
              const project = projects[ct.index]
              const isHovered = hoveredIndex === ct.index
              return (
                <Link
                  key={ct.index}
                  to={`/projects/${project.id}`}
                  onDragStart={(e) => e.preventDefault()}
                  onMouseEnter={() => setHoveredIndex(ct.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="absolute block cursor-pointer"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: CARD_W,
                    height: CARD_H,
                    marginLeft: -CARD_W / 2,
                    marginTop: -CARD_H / 2,
                    transform: `translateX(${ct.x}px) translateZ(${ct.z}px) rotateY(${ct.rotateY}deg)`,
                    opacity: ct.opacity,
                    zIndex: Math.round((1 - Math.abs(ct.rotateY) / 45) * 100),
                    willChange: 'transform, opacity',
                    transition: isHovered ? 'box-shadow 0.3s ease' : 'none',
                    pointerEvents: ct.visible ? 'auto' : 'none',
                    boxShadow: isHovered
                      ? '0 20px 60px rgba(0,0,0,0.5)'
                      : '0 10px 40px rgba(0,0,0,0.2)',
                  }}
                >
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-sm"
                    draggable={false}
                  />
                  {/* Overlay info on hover */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-4 rounded-sm transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 60%)',
                      opacity: isHovered ? 1 : 0,
                    }}
                  >
                    <h3 className="text-white text-sm font-semibold tracking-wide">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-[10px] uppercase tracking-[0.16em] mt-1">
                      {project.tags.join(' · ')}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom info bar */}
        <div className="px-6 md:px-16 mt-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center text-white">
            <span className="font-medium text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              [{currentIndex}/{projects.length}]
            </span>
            <Link
              to="/projects"
              className="flex items-center gap-2 group cursor-pointer uppercase font-medium tracking-[0.16em] text-[11px] hover:opacity-70 transition-opacity"
            >
              View All Projects
              <span className="text-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

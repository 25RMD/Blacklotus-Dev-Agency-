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
  const [isInView, setIsInView] = useState(false)
  const [cardTransforms, setCardTransforms] = useState<
    { x: number; z: number; rotateY: number; opacity: number; visible: boolean; index: number }[]
  >([])

  const totalWidth = projects.length * CARD_SPACING
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const isHoveredRef = useRef(false)

  // Track continuous scroll velocity multiplier
  const velocityMultiplier = useRef(1)

  useEffect(() => {
    isHoveredRef.current = hoveredIndex !== null
  }, [hoveredIndex])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '300px 0px' }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Increase speed when wheel scrolling
  useEffect(() => {
    if (!isInView) return

    const handleWheel = (e: WheelEvent) => {
      // Scale scroll delta into a velocity multiplier (absolute value)
      const additionalVelocity = Math.abs(e.deltaY) * 0.05
      // Cap maximum velocity to prevent chaotic spins
      velocityMultiplier.current = Math.min(velocityMultiplier.current + additionalVelocity, 12)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isInView])

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

  useEffect(() => {
    setCardTransforms(computeTransforms(scrollValRef.current.current))
  }, [computeTransforms])

  const animate = useCallback(() => {
    if (!isInView) {
      rafRef.current = 0
      return
    }

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

    // Focus calculation removed since counter was removed
    rafRef.current = requestAnimationFrame(animate)
  }, [computeTransforms, isInView])

  useEffect(() => {
    if (!isInView) return

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate, isInView])

  return (
    <section id="projects" ref={sectionRef} className="relative z-10 bg-black select-none h-screen min-h-[700px] flex flex-col justify-center overflow-hidden w-full -mb-px">
      <div className="w-full flex flex-col justify-center overflow-hidden">
        {/* Section header */}
        <div className="px-6 md:px-16 mb-8 md:mb-12 max-w-7xl mx-auto w-full flex justify-between items-end">
          <div>
            <span className="block text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] mb-2">
              Projects
            </span>
            <h2 className="text-[clamp(2.4rem,6.8vw,6rem)] font-sans font-light text-white tracking-tight leading-[0.92]">
              Selected Work
            </h2>
          </div>
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
                  <picture>
                    <source srcSet={project.imgWebp} type="image/webp" />
                    <img
                      src={project.imgFallback}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain rounded-sm"
                      draggable={false}
                    />
                  </picture>
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

        {/* Bottom View All Button */}
        <div className="px-6 md:px-16 mt-8 max-w-7xl mx-auto w-full flex justify-center">
          <Link
            to="/projects"
            className="bg-transparent text-white border border-white/60 px-7 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase hover:border-white hover:bg-white/10 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}

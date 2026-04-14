import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { Link } from 'react-router'
import { projects, type Project } from '../lib/projects'

// ── Grid tile dimensions ──
const TILE_COLS = 4
const TILE_ROWS = 3
const TILE_COUNT = TILE_COLS * TILE_ROWS
const CARD_W = 400
const CARD_H = 400
const GAP = 2

const CELL_W = CARD_W + GAP
const CELL_H = CARD_H + GAP
const TILE_W = TILE_COLS * CELL_W
const TILE_H = TILE_ROWS * CELL_H
const DRAG_DEADZONE_PX = 5
const MAX_DELTA_PER_EVENT = 64
const MAX_TILT_DEG = 3.5

// Seeded shuffle — random but stable per session
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Infinite gallery ──
export function ProjectsGallery() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const viewportRef = useRef<HTMLDivElement>(null)
  const shuffled = useMemo(() => shuffle(projects), [])
  const tileProjects = useMemo(
    () =>
      Array.from({ length: TILE_COUNT }, (_, i) => ({
        ...shuffled[i % shuffled.length],
        tileIdx: i,
      })),
    [shuffled],
  )

  // We render a fixed grid of tile copies large enough to always cover the
  // viewport. The parent container is translated via a ref (no React re-render).
  const GRID_X = useMemo(() => typeof window !== 'undefined' ? Math.ceil(window.innerWidth / TILE_W) + 2 : 4, [])
  const GRID_Y = useMemo(() => typeof window !== 'undefined' ? Math.ceil(window.innerHeight / TILE_H) + 2 : 3, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    pointerId: -1,
  })
  const zoomRef = useRef(1)
  const rafRef = useRef(0)
  const tiltRef = useRef({ x: 0, y: 0 })
  const tiltTargetRef = useRef({ x: 0, y: 0 })

  // Animation loop — only touches one DOM node's transform
  const animate = useCallback(() => {
    const o = offsetRef.current
    const v = velRef.current
    const d = dragRef.current

    if (!d.active) {
      o.x += v.x
      o.y += v.y
      v.x *= 0.9
      v.y *= 0.9
      if (Math.abs(v.x) < 0.05) v.x = 0
      if (Math.abs(v.y) < 0.05) v.y = 0
    }

    // Zoom effect (subtle, centered to viewport)
    const targetZoom = d.active ? 0.92 : 1
    zoomRef.current += (targetZoom - zoomRef.current) * 0.12

    // Modular wrap so it loops seamlessly
    const tx = -((((o.x % TILE_W) + TILE_W) % TILE_W) + TILE_W)
    const ty = -((((o.y % TILE_H) + TILE_H) % TILE_H) + TILE_H)

    if (containerRef.current) {
      const zoom = zoomRef.current
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const zoomCompX = (1 - zoom) * centerX
      const zoomCompY = (1 - zoom) * centerY
      const scaledTx = tx * zoom
      const scaledTy = ty * zoom

      tiltRef.current.x += (tiltTargetRef.current.x - tiltRef.current.x) * 0.12
      tiltRef.current.y += (tiltTargetRef.current.y - tiltRef.current.y) * 0.12

      const depthScaleX = 1 + Math.abs(tiltRef.current.x) * 0.002
      const depthScaleY = 1 + Math.abs(tiltRef.current.y) * 0.002

      containerRef.current.style.transform = `translate(${scaledTx + zoomCompX}px, ${scaledTy + zoomCompY}px) scale(${zoom}) rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg) scaleX(${depthScaleX}) scaleY(${depthScaleY})`
      containerRef.current.style.transformOrigin = '0 0'
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const updateSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', updateSize)
    updateSize()
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('resize', updateSize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  // Pointer handlers — use window listeners for reliable drag tracking
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!e.isPrimary) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      pointerId: e.pointerId,
    }
    velRef.current = { x: 0, y: 0 }
    e.preventDefault()
  }, [])

  const resetTilt = useCallback(() => {
    tiltTargetRef.current = { x: 0, y: 0 }
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const viewport = viewportRef.current
      if (!viewport) return

      const rect = viewport.getBoundingClientRect()
      const withinX = e.clientX >= rect.left && e.clientX <= rect.right
      const withinY = e.clientY >= rect.top && e.clientY <= rect.bottom

      if (!withinX || !withinY) {
        tiltTargetRef.current = { x: 0, y: 0 }
        return
      }

      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      tiltTargetRef.current.x = -ny * MAX_TILT_DEG
      tiltTargetRef.current.y = nx * MAX_TILT_DEG
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d.active || e.pointerId !== d.pointerId) return

      if (!d.moved) {
        const totalDx = e.clientX - d.startX
        const totalDy = e.clientY - d.startY
        if (Math.hypot(totalDx, totalDy) < DRAG_DEADZONE_PX) return
        d.moved = true
        d.lastX = e.clientX
        d.lastY = e.clientY
        return
      }

      const rawDx = e.clientX - d.lastX
      const rawDy = e.clientY - d.lastY
      const dx = Math.max(-MAX_DELTA_PER_EVENT, Math.min(MAX_DELTA_PER_EVENT, rawDx))
      const dy = Math.max(-MAX_DELTA_PER_EVENT, Math.min(MAX_DELTA_PER_EVENT, rawDy))
      d.lastX = e.clientX
      d.lastY = e.clientY
      offsetRef.current.x -= dx
      offsetRef.current.y -= dy
      velRef.current.x = velRef.current.x * 0.7 + (-dx) * 0.3
      velRef.current.y = velRef.current.y * 0.7 + (-dy) * 0.3
    }

    const onPointerUp = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d.active || e.pointerId !== d.pointerId) return
      dragRef.current = { ...d, active: false, moved: false, pointerId: -1 }
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  // Build tile grid positions once
  const tilePositions = useMemo(() => {
    const arr: { x: number; y: number; key: string }[] = []
    for (let row = 0; row < GRID_Y; row++) {
      for (let col = 0; col < GRID_X; col++) {
        arr.push({ x: col * TILE_W, y: row * TILE_H, key: `${col}_${row}` })
      }
    }
    return arr
  }, [GRID_X, GRID_Y])

  if (windowSize.width === 0) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-black text-white flex items-center justify-center">
        <span className="text-sm text-gray-500 animate-pulse">Loading projects...</span>
      </div>
    )
  }

  return (
    <div
      ref={viewportRef}
      className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerLeave={resetTilt}
    >

      {/* Tile container — only its transform changes per frame */}
      {viewMode === 'grid' && (
        <div
          ref={containerRef}
          className="absolute top-0 left-0"
          style={{ willChange: 'transform' }}
        >
          {tilePositions.map(({ x, y, key }) => (
            <div
              key={key}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                width: TILE_W,
                height: TILE_H,
                display: 'grid',
                gridTemplateColumns: `repeat(${TILE_COLS}, ${CARD_W}px)`,
                gap: `${GAP}px`,
              }}
            >
              {tileProjects.map((project) => (
                  <Card
                    key={project.tileIdx}
                    project={project}
                  />
                ))}
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && <ProjectListView />}

      {/* ── OVERLAY UI — stopPropagation prevents drag from starting on buttons ── */}
      <div className="absolute top-6 right-6 z-50" onPointerDown={(e) => e.stopPropagation()}>
        <Link
          to="/#contact"
          viewTransition
          className="bg-white text-black px-6 py-2.5 rounded-none border border-white text-[10px] font-semibold uppercase tracking-[0.18em] hover:bg-gray-200 transition-colors"
        >
          Let's Talk
        </Link>
      </div>



      <div className="absolute bottom-6 left-6 z-50 flex items-center bg-white/5 backdrop-blur-xl rounded-full p-1 border border-white/10 shadow-2xl" onPointerDown={(e) => e.stopPropagation()}>
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
        >
          <List size={16} />
        </button>
      </div>

      <div className="absolute bottom-6 right-6 z-50" onPointerDown={(e) => e.stopPropagation()}>
        <Link
          to="/"
          state={{ skipSplash: true }}
          viewTransition
          className="flex items-center gap-2 bg-white/5 backdrop-blur-xl text-white px-5 py-2.5 rounded-none border border-white/15 text-[10px] font-medium uppercase tracking-[0.16em] hover:bg-white/10 transition-colors"
        >
          <span>← Home</span>
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  )
}

function ProjectListView() {
  const grouped = useMemo(() => {
    const groups: Record<string, typeof projects> = {}
    projects.forEach(p => {
      if (!groups[p.year]) groups[p.year] = []
      groups[p.year].push(p)
    })
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
  }, [])

  return (
    <div className="absolute inset-0 z-30 bg-[#0a0a0a] overflow-y-auto pt-32 pb-24 px-6 md:px-12 lg:px-24 cursor-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-baseline gap-8 mb-16 border-b border-white/10 pb-8">
          <h1 className="text-[clamp(2.8rem,8vw,6.8rem)] font-display font-semibold tracking-[-0.03em] leading-[0.92] text-white">All projects</h1>
          <span className="text-lg md:text-xl font-medium uppercase tracking-[0.12em] text-white/45">{projects.length} projects</span>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {grouped.map(([year, yearProjects]) => (
            <div key={year} className="flex flex-col md:flex-row border-b border-white/10 py-8 gap-8 md:gap-24">
              <div className="w-32 shrink-0">
                <h2 className="text-2xl font-display font-semibold tracking-[-0.02em] text-white">{year}</h2>
              </div>
              <div className="flex-1 flex flex-col">
                {yearProjects.map((project, idx) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    viewTransition
                    className={`flex flex-col md:flex-row md:items-center justify-between py-4 gap-4 group ${idx !== yearProjects.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-semibold tracking-[-0.02em] text-white group-hover:text-gray-300 transition-colors">{project.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 md:w-1/2 lg:w-1/3">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-none border border-white/20 text-[9px] uppercase tracking-[0.16em] text-white/60 group-hover:border-white/40 group-hover:text-white/80 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="md:w-48 text-right">
                      <span className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors">{project.client}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Card = memo(({ project }: {
  project: Project & { tileIdx: number }
}) => {
  const dragTracker = useRef({ x: 0, y: 0 })

  return (
    <div
      style={{ width: CARD_W, height: CARD_H }}
      className="project-card relative bg-[#050505] group overflow-hidden"
    >
      <Link
        draggable={false}
        to={`/projects/${project.id}`}
        viewTransition
        onPointerDown={(e) => {
          dragTracker.current = { x: e.clientX, y: e.clientY }
        }}
        onClick={(e) => {
          const dx = Math.abs(e.clientX - dragTracker.current.x)
          const dy = Math.abs(e.clientY - dragTracker.current.y)
          if (dx > 5 || dy > 5) {
            e.preventDefault()
          }
        }}
        onDragStart={(e) => e.preventDefault()}
        className="absolute inset-0 p-6 flex flex-col justify-between z-10 cursor-pointer pointer-events-auto"
      >
        {/* Hover glass reflection */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
          <img
            src={project.img}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-25 mix-blend-screen"
          />
          <div className="absolute inset-0 backdrop-blur-[1.5px] bg-white/6" />
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_32%,rgba(255,255,255,0.0)_55%,rgba(255,255,255,0.12)_100%)]" />
          <div className="absolute -inset-[35%] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_48%)]" />
        </div>

        <div className="relative z-20 flex justify-between items-start text-[10px] font-medium tracking-[0.16em] uppercase text-gray-400 group-hover:text-white transition-colors duration-500">
          <span>{project.client}</span>
          <span>{project.year}</span>
        </div>
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center p-12">
          <img
            src={project.img}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out drop-shadow-2xl"
          />
        </div>
        <div className="relative z-20 flex justify-between items-end text-[9px] font-medium tracking-[0.16em] uppercase text-gray-500 group-hover:text-white transition-colors duration-500">
          <span>{project.tags.join(' · ')}</span>
        </div>
      </Link>
    </div>
  )
})

Card.displayName = 'Card'

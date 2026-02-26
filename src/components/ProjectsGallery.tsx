import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 })
  const zoomRef = useRef(1)
  const rafRef = useRef(0)

  // Animation loop — only touches one DOM node's transform
  const animate = useCallback(() => {
    const o = offsetRef.current
    const v = velRef.current
    const d = dragRef.current

    if (!d.active) {
      o.x += v.x
      o.y += v.y
      v.x *= 0.92
      v.y *= 0.92
      if (Math.abs(v.x) < 0.05) v.x = 0
      if (Math.abs(v.y) < 0.05) v.y = 0
    }

    // Zoom effect
    const targetZoom = d.active ? 0.75 : 1
    zoomRef.current += (targetZoom - zoomRef.current) * 0.1

    // Modular wrap so it loops seamlessly
    const tx = -((((o.x % TILE_W) + TILE_W) % TILE_W) + TILE_W)
    const ty = -((((o.y % TILE_H) + TILE_H) % TILE_H) + TILE_H)

    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${zoomRef.current})`
      containerRef.current.style.transformOrigin = '0 0'
    }

    // Fisheye effect
    const cards = document.getElementsByClassName('project-card') as HTMLCollectionOf<HTMLElement>
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const zoom = zoomRef.current

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      const baseX = parseFloat(card.dataset.x!)
      const baseY = parseFloat(card.dataset.y!)

      const screenX = tx + baseX * zoom
      const screenY = ty + baseY * zoom

      const dx = screenX - cx
      const dy = screenY - cy

      const rotateY = dx * 0.03
      const rotateX = -dy * 0.03
      const translateZ = -Math.sqrt(dx * dx + dy * dy) * 0.4

      card.style.transform = `perspective(1000px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
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

  // Pointer handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY }
    velRef.current = { x: 0, y: 0 }
      ; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d.active) return
    const dx = e.clientX - d.lastX
    const dy = e.clientY - d.lastY
    d.lastX = e.clientX
    d.lastY = e.clientY
    offsetRef.current.x -= dx
    offsetRef.current.y -= dy
    velRef.current.x = -dx
    velRef.current.y = -dy
  }, [])

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false
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
      className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
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
              {tileProjects.map((project, i) => {
                const col = i % TILE_COLS
                const row = Math.floor(i / TILE_COLS)
                const cardX = x + col * CELL_W + CARD_W / 2
                const cardY = y + row * CELL_H + CARD_H / 2
                return <Card key={project.tileIdx} project={project} cardX={cardX} cardY={cardY} />
              })}
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && <ProjectListView />}

      {/* ── OVERLAY UI ── */}
      <div className="absolute top-6 right-6 z-50">
        <Link
          to="/#contact"
          className="bg-white text-black px-6 py-2.5 rounded-none border border-white text-[10px] font-semibold uppercase tracking-[0.18em] hover:bg-gray-200 transition-colors"
        >
          Let's Talk
        </Link>
      </div>



      <div className="absolute bottom-6 left-6 z-50 flex items-center bg-white/5 backdrop-blur-xl rounded-full p-1 border border-white/10 shadow-2xl">
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

      <div className="absolute bottom-6 right-6 z-50">
        <Link
          to="/"
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

// ── Static card — never re-renders ──
const colors = ['#e855a0', '#c8f5e8', '#1a2744', '#4a1942', '#6b9ec4', '#1a534a', '#f5c8c8', '#c8d5f5', '#f5e8c8', '#c8f5d5']

const Card = ({ project, cardX, cardY }: { project: Project & { tileIdx: number }, cardX: number, cardY: number }) => {
  const dragTracker = useRef({ x: 0, y: 0 })
  const color = colors[parseInt(project.id) % colors.length]

  return (
    <div
      data-x={cardX}
      data-y={cardY}
      style={{ width: CARD_W, height: CARD_H }}
      className="project-card relative bg-[#050505] group overflow-hidden will-change-transform"
    >
      <Link
        draggable={false}
        to={`/projects/${project.id}`}
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
        {/* Hover Background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ backgroundColor: color }} />
        
        <div className="relative z-20 flex justify-between items-start text-[10px] font-medium tracking-[0.16em] uppercase text-gray-400 group-hover:text-white transition-colors duration-500">
          <span>{project.client}</span>
          <span>{project.year}</span>
        </div>
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center p-12">
          <img
            src={project.img}
            alt={project.title}
            className="w-full h-full object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out drop-shadow-2xl"
          />
        </div>
        <div className="relative z-20 flex justify-between items-end text-[9px] font-medium tracking-[0.16em] uppercase text-gray-500 group-hover:text-white transition-colors duration-500">
          <span>{project.tags.join(' · ')}</span>
        </div>
      </Link>
    </div>
  )
}

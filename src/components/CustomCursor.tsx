import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCursor } from '../context/CursorContext'

export function CustomCursor() {
  const { cursorText, cursorVariant } = useCursor()
  const [isMobile, setIsMobile] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  // Canvas Trail Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailPoints = useRef<{ x: number, y: number, lifetime: number }[]>([])
  const rafRef = useRef<number>(0)

  // Detect touch devices / mobile
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 768
      setIsMobile(isTouchDevice || isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Add point to trail
      trailPoints.current.push({ x: e.clientX, y: e.clientY, lifetime: 1.0 })
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [isMobile])

  // Don't render on mobile, but keep hooks above consistent
  if (isMobile) return null

  const variants = {
    default: {
      height: 12,
      width: 12,
      backgroundColor: "#fff",
      mixBlendMode: "difference" as any,
      x: "-50%",
      y: "-50%",
      borderRadius: "50%",
    },
    text: {
      height: "auto",
      width: "auto",
      backgroundColor: "#fff",
      mixBlendMode: "normal" as any,
      x: "-50%",
      y: "-50%",
      borderRadius: "9999px",
      paddingLeft: "16px",
      paddingRight: "16px",
      paddingTop: "8px",
      paddingBottom: "8px",
    }
  }

  // Canvas Animation Render Loop
  useEffect(() => {
    if (isMobile || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize canvas to fill screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const renderTrail = () => {
      // Fade out effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const points = trailPoints.current

      // Age points and remove old ones
      for (let i = points.length - 1; i >= 0; i--) {
        points[i].lifetime -= 0.02
        if (points[i].lifetime <= 0) {
          points.splice(i, 1)
        }
      }

      if (points.length > 1) {
        ctx.beginPath()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Start drawing from first point
        ctx.moveTo(points[0].x, points[0].y)

        for (let i = 1; i < points.length; i++) {
          const pt = points[i]
          const prevPt = points[i - 1]

          // Paintbrush style: width based on lifetime, colors change
          const width = Math.max(0.5, pt.lifetime * 40)
          ctx.lineWidth = width

          // White paint with partial opacity relative to lifetime
          ctx.strokeStyle = `rgba(255, 255, 255, ${pt.lifetime * 0.8})`

          // Quadratic curve for smoothness
          const xc = (prevPt.x + pt.x) / 2
          const yc = (prevPt.y + pt.y) / 2
          ctx.quadraticCurveTo(prevPt.x, prevPt.y, xc, yc)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(xc, yc)
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(renderTrail)
    }

    renderTrail()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9998] pointer-events-none mix-blend-difference"
      />
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        initial={{
          height: 12,
          width: 12,
          backgroundColor: "#fff",
          mixBlendMode: "difference",
          x: "-50%",
          y: "-50%",
          borderRadius: "50%",
        }}
        variants={variants}
        animate={cursorVariant}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: cursorVariant === 'text' ? 1 : 0 }}
          className="text-black text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
        >
          {cursorText}
        </motion.span>
      </motion.div>
    </>
  )
}

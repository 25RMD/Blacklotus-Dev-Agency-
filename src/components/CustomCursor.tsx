import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCursor } from '../context/CursorContext'

export function CustomCursor() {
  const { cursorText, cursorVariant } = useCursor()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

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

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
      style={{
        x: cursorX,
        y: cursorY,
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
  )
}

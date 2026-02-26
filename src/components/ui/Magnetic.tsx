import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useCallback, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
  pressScale?: number
}

export function Magnetic({
  children,
  className,
  strength = 0.2,
  pressScale = 0.97,
}: MagneticProps) {
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)

  const springX = useSpring(x, { stiffness: 280, damping: 24, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 280, damping: 24, mass: 0.5 })
  const springScale = useSpring(scale, {
    stiffness: 320,
    damping: 24,
    mass: 0.45,
  })

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch' || prefersReducedMotion) return

      const rect = event.currentTarget.getBoundingClientRect()
      const relX = event.clientX - rect.left - rect.width / 2
      const relY = event.clientY - rect.top - rect.height / 2

      x.set(relX * strength)
      y.set(relY * strength)
    },
    [prefersReducedMotion, strength, x, y],
  )

  const handlePointerLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    scale.set(1)
  }, [x, y, scale])

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={() => scale.set(prefersReducedMotion ? 1 : pressScale)}
      onPointerUp={() => scale.set(1)}
      style={{ x: springX, y: springY, scale: springScale, willChange: 'transform' }}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [animationComplete, setAnimationComplete] = useState(false)

  // Trigger completion after animation finishes
  useEffect(() => {
    if (animationComplete) {
      const timeout = setTimeout(() => {
        onLoadingComplete()
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [animationComplete, onLoadingComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#000000',
        willChange: 'transform', // GPU hint for exit animation
      }}
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        borderBottomLeftRadius: "50px",
        borderBottomRightRadius: "50px",
      }}
      transition={{
        duration: 1,
        ease: [0.76, 0, 0.24, 1]
      }}
    >
      {/* BLACK LOTUS Text Animation Container */}
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ willChange: 'contents' }}
      >
        {/* BLACK - slides from left */}
        <motion.span
          initial={{ x: '-100vw', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3
          }}
          onAnimationComplete={() => setAnimationComplete(true)}
          style={{
            fontFamily: 'Impact, "Arial Narrow Bold", sans-serif',
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            fontWeight: 'normal',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: '#ffffff',
            textTransform: 'uppercase',
            willChange: 'transform, opacity', // GPU acceleration
          }}
        >
          BLACK
        </motion.span>

        {/* Space between words */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          style={{
            fontFamily: 'Impact, "Arial Narrow Bold", sans-serif',
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            color: '#ffffff',
          }}
        >
          &nbsp;
        </motion.span>

        {/* LOTUS - slides from right */}
        <motion.span
          initial={{ x: '100vw', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3
          }}
          style={{
            fontFamily: 'Impact, "Arial Narrow Bold", sans-serif',
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            fontWeight: 'normal',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: '#ffffff',
            textTransform: 'uppercase',
            willChange: 'transform, opacity', // GPU acceleration
          }}
        >
          LOTUS
        </motion.span>
      </div>
    </motion.div>
  )
}
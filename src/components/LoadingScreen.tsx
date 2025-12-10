import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

const LOADING_STATES = [
  "Initializing environment",
  "Loading assets",
  "Compiling shaders",
  "Establishing connection",
  "System ready"
]

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loadingStateIndex, setLoadingStateIndex] = useState(0)

  // Handle Progress logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Logarithmic approach: Fast at start, slow at end
        const remaining = 100 - prev
        const increment = Math.max(0.5, remaining * 0.08)

        const nextProgress = Math.min(100, prev + increment)

        // Sync text states roughly with percentage
        if (nextProgress > 20 && nextProgress < 40) setLoadingStateIndex(1)
        if (nextProgress > 40 && nextProgress < 70) setLoadingStateIndex(2)
        if (nextProgress > 70 && nextProgress < 90) setLoadingStateIndex(3)
        if (nextProgress >= 100) {
          setLoadingStateIndex(4)
          clearInterval(interval)
          return 100
        }

        return nextProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Trigger completion when progress hits 100
  useEffect(() => {
    if (progress >= 100) {
      // Small pause at 100% before triggering exit
      const timeout = setTimeout(() => {
        onLoadingComplete()
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [progress, onLoadingComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-between bg-neutral-950 text-white overflow-hidden font-sans"
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        borderBottomLeftRadius: "50px",
        borderBottomRightRadius: "50px",
      }}
      transition={{
        duration: 1,
        ease: [0.76, 0, 0.24, 1] // "Quart" easing for a sharp, premium feel
      }}
    >
      {/* 1. Grain/Noise Texture Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* 2. Architectural Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Top Section */}
      <div className="w-full p-8 md:p-12 flex justify-between items-start z-10 relative">
        {/* Animated Corner Bracket (Top Left) */}
        <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/30" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-white animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400">
            Black Lotus / v1.0
          </span>
        </motion.div>

        {/* Animated Corner Bracket (Top Right) */}
        <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/30" />
      </div>

      {/* Center Section */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <motion.img
            src="/BL-logo.jpg"
            alt="Black Lotus"
            className="w-16 h-16 md:w-24 md:h-24 mb-12 relative z-10 rounded-full object-cover"
          />
          {/* Logo Glow Effect */}
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 z-0" />
        </motion.div>

        {/* Huge Counter */}
        <div className="overflow-hidden h-[120px] md:h-[180px] flex items-end justify-center">
          <motion.h1
            className="text-[7rem] md:text-[11rem] font-bold leading-none tracking-tighter tabular-nums text-white"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            {Math.floor(progress)}
          </motion.h1>
          <span className="text-2xl md:text-4xl font-light mb-6 md:mb-10 opacity-50 ml-2">%</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full p-8 md:p-12 z-10 flex flex-col gap-2 relative">
        {/* Animated Corner Bracket (Bottom Left) */}
        <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/30" />
        {/* Animated Corner Bracket (Bottom Right) */}
        <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/30" />

        <div className="flex justify-between items-end mb-4 h-6">
          <div className="flex flex-col overflow-hidden">
            {/* Text Swapper */}
            <AnimatePresence mode="wait">
              <motion.span
                key={loadingStateIndex}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-xs font-mono text-neutral-500 uppercase tracking-widest"
              >
                {LOADING_STATES[loadingStateIndex]}...
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-[10px] font-mono text-neutral-600">
            {(progress * 1024).toFixed(0)}kb / 102400kb
          </span>
        </div>

        {/* Progress Line */}
        <div className="w-full h-[2px] bg-neutral-900 overflow-hidden relative">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
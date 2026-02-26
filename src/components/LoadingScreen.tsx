import { motion } from 'framer-motion'
import { useState } from 'react'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleEnter = () => {
    window.dispatchEvent(new CustomEvent('start-audio'))
    onLoadingComplete()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-black"
      exit={{
        y: "-100%",
        borderBottomLeftRadius: "50px",
        borderBottomRightRadius: "50px",
      }}
      transition={{
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1]
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Main Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex items-center"
        >
          <h1 
            className="text-white font-serif font-bold tracking-tighter text-5xl md:text-7xl lg:text-8xl"
            style={{
              fontSize: 'clamp(3rem, 12vw, 8rem)',
              letterSpacing: '-0.02em',
            }}
          >
            BLACK.LOTUS
          </h1>
        </motion.div>

        {/* Enter Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleEnter}
          className="mt-24 text-white font-mono text-sm md:text-base tracking-[0.3em] flex items-center cursor-pointer hover:text-white/80 transition-colors"
        >
          <motion.span
            animate={{ x: isHovered ? -12 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            [
          </motion.span>
          <span className="mx-2">ENTER</span>
          <motion.span
            animate={{ x: isHovered ? 12 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            ]
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  )
}
import { motion, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

declare global {
  interface Window {
    heroStripProgress: number
  }
}

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isLocked, setIsLocked] = useState(true)
  const [hasLeftHero, setHasLeftHero] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const accumulatedScroll = useRef(0)
  const scrollThreshold = 600 // Total scroll distance needed to complete animation
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const videos = ['/bg-video/1.mp4', '/bg-video/2.mp4']

  // Use spring for smooth Lenis-like animation
  const scrollProgressSpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  // Transform spring value to strip position
  const stripY = useTransform(scrollProgressSpring, [0, 1], ['0vh', '-50vh'])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e))
    }
  }, [currentVideoIndex])
  
  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
  }

  // Detect when user scrolls back to top and reset the strip
  // Use native scroll event since Lenis might be stopped
  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY
      
      // Mark that we've left the hero section
      if (!hasLeftHero && scroll > window.innerHeight) {
        setHasLeftHero(true)
      }
      
      // If we've left the hero section and scrolled back to the very top
      if (hasLeftHero && scroll < 10) {
        // Reset the animation state
        scrollProgressSpring.set(0)
        accumulatedScroll.current = 0
        window.heroStripProgress = 0
        setHasLeftHero(false)
        // Delay setting isLocked to allow Lenis to properly stop
        setTimeout(() => {
          setIsLocked(true)
        }, 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasLeftHero, scrollProgressSpring])

  // Stop/start Lenis based on lock state
  useEffect(() => {
    const lenis = window.lenis
    if (!lenis) return

    if (isLocked) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [isLocked])
  
  useEffect(() => {
    if (!isLocked) return
    
    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return
      
      e.preventDefault()
      
      // Accumulate scroll
      accumulatedScroll.current += e.deltaY
      
      // Clamp between 0 and threshold
      accumulatedScroll.current = Math.max(0, Math.min(scrollThreshold, accumulatedScroll.current))
      
      // Calculate progress (0 to 1)
      const progress = accumulatedScroll.current / scrollThreshold
      scrollProgressSpring.set(progress)
      
      // Expose progress globally for Navbar
      window.heroStripProgress = progress
      
      // Unlock when we reach 90% progress
      if (progress >= 0.9) {
        setIsLocked(false)
      }
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [isLocked, scrollProgressSpring])
  
  return (
    <section id="home" ref={sectionRef} className="relative h-screen w-full">
      
      {/* --- MAIN CONTAINER --- */}
      <div className="relative h-screen w-full overflow-hidden">
        
        {/* BLACK BACKGROUND (Main Hero BG with Video) */}
        <div className="absolute inset-0 bg-black">
          {/* Video */}
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline 
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            onEnded={handleVideoEnded}
            src={videos[currentVideoIndex]}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Hero text content */}
          <div className="absolute bottom-8 left-6 md:left-12 max-w-4xl z-20">
            <p className="mb-4 text-[12px] font-sans font-medium tracking-widest uppercase text-white/80">
              AFRICA, NIGERIA
            </p>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight">
              Engineering ideas into<br />
              <span className="italic text-white/90">digital reality.</span>
            </h2>
          </div>
        </div>

        {/* WHITE HORIZONTAL STRIP with "BLACK LOTUS" */}
        <motion.div 
          style={{ y: stripY }}
          className="absolute top-0 left-0 right-0 h-[45vh] bg-white/90 backdrop-blur-sm z-10 flex items-end justify-center overflow-hidden"
        >
          <div className="w-full relative flex items-end justify-center pointer-events-none overflow-hidden h-[40vh]" style={{ transform: 'translateY(20px)' }}>
            <svg
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                textLength="100"
                lengthAdjust="spacingAndGlyphs"
                fill="rgba(0, 0, 0, 0.1)"
                style={{
                  fontFamily: 'Impact, "Arial Narrow Bold", sans-serif',
                  fontSize: '20px',
                }}
              >
                BLACK LOTUS
              </text>
            </svg>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

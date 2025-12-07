import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isLocked, setIsLocked] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const accumulatedScroll = useRef(0)
  const scrollThreshold = 600 // Total scroll distance needed to complete animation
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const videos = ['/bg-video/1.mp4', '/bg-video/2.mp4']

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e))
    }
  }, [currentVideoIndex])
  
  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
  }
  
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
      setScrollProgress(progress)
      
      // Unlock when we reach 90% progress
      if (progress >= 0.9) {
        setIsLocked(false)
        document.body.style.overflow = ''
      }
    }
    
    // Lock scroll
    document.body.style.overflow = 'hidden'
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      document.body.style.overflow = ''
    }
  }, [isLocked])

  // Calculate strip position based on progress
  const stripY = `${-scrollProgress * 50}vh`
  
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
          className="absolute top-0 left-0 right-0 h-[45vh] bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center overflow-hidden"
          transition={{ type: "tween", duration: 0.1 }}
        >
          <h1 
            className="font-display font-bold text-[13.5vw] leading-none tracking-tighter text-center uppercase whitespace-nowrap select-none text-black/10"
            style={{ transform: 'scaleY(1.1)' }} 
          >
            BLACK LOTUS
          </h1>
        </motion.div>

      </div>
    </section>
  )
}

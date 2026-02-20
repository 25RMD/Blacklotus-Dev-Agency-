import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  animate,
} from "framer-motion"
import { useRef, useState, useEffect } from "react"

declare global {
  interface Window {
    heroStripProgress: number
  }
}

interface HeroSectionProps {
  isLoaded?: boolean
}

export function HeroSection({ isLoaded = false }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isLocked, setIsLocked] = useState(true)
  const [hasLeftHero, setHasLeftHero] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const accumulatedScroll = useRef(0)
  const scrollThreshold = 600
  const videoRef = useRef<HTMLVideoElement>(null)

  const videos = ["/bg-video/1.mp4", "/bg-video/2.mp4"]

  // Entrance animation - use transform for 60fps GPU animation

  let windowInnerHeight = 0
  useEffect(() => {
    windowInnerHeight = window.innerHeight
  })
  const entranceOffset = useMotionValue(windowInnerHeight - 500)
  // Scroll-based animation with spring for smoothness
  const scrollProgressSpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Transform to percentage for GPU-accelerated transform
  const scrollOffset = useTransform(
    scrollProgressSpring,
    [0, 1],
    ["0%", "-111%"]
  ) // 50vh / 45vh ≈ 111%

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.log("Autoplay prevented:", e))
    }
  }, [currentVideoIndex])

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
  }

  // Animate entrance when loaded - using Framer Motion's animate for 60fps
  useEffect(() => {
    if (isLoaded) {
      const timeout = setTimeout(() => {
        animate(entranceOffset, 0, {
          duration: 1.8,
          ease: [0.16, 1, 0.3, 1],
        })
      }, 400)

      return () => clearTimeout(timeout)
    }
  }, [isLoaded, entranceOffset])

  // Reset entrance offset on mount
  useEffect(() => {
    entranceOffset.set(-window.innerHeight - 500)
  }, [])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY

      if (!hasLeftHero && scroll > window.innerHeight) {
        setHasLeftHero(true)
      }

      if (hasLeftHero && scroll < 10) {
        scrollProgressSpring.set(0)
        accumulatedScroll.current = 0
        window.heroStripProgress = 0
        setHasLeftHero(false)
        setTimeout(() => setIsLocked(true), 100)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasLeftHero, scrollProgressSpring])

  // Lenis control
  useEffect(() => {
    const lenis = window.lenis
    if (!lenis) return
    if (isLocked) lenis.stop()
    else lenis.start()
  }, [isLocked])

  // Wheel handler
  useEffect(() => {
    if (!isLocked) return

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return
      e.preventDefault()

      accumulatedScroll.current += e.deltaY
      accumulatedScroll.current = Math.max(
        0,
        Math.min(scrollThreshold, accumulatedScroll.current)
      )

      const progress = accumulatedScroll.current / scrollThreshold
      scrollProgressSpring.set(progress)
      window.heroStripProgress = progress

      if (progress >= 0.9) setIsLocked(false)
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [isLocked, scrollProgressSpring])

  return (
    <section id='home' ref={sectionRef} className='relative h-screen w-full'>
      <div className='relative h-screen w-full overflow-hidden'>
        {/* Video Background */}
        <div className='absolute inset-0 bg-black'>
          <motion.video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload='auto'
            className='absolute inset-0 h-full w-full object-cover'
            onEnded={handleVideoEnded}
            src={videos[currentVideoIndex]}
            initial={{ opacity: 0, scale: 1.3 }}
            animate={
              isLoaded ? { opacity: 0.8, scale: 1 } : { opacity: 0, scale: 1.3 }
            }
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            style={{ willChange: "transform, opacity" }}
          />

          {/* Gradient */}
          <motion.div
            className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent'
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 2, delay: 1 }}
          />

          {/* Hero Text */}
          <div className='absolute bottom-8 left-6 md:left-12 max-w-4xl z-20 overflow-hidden'>
            <div className='overflow-hidden'>
              <motion.p
                className='mb-4 text-[12px] font-sans font-medium tracking-widest uppercase text-white/80'
                initial={{ y: "100%", opacity: 0 }}
                animate={
                  isLoaded ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }
                }
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 1.5,
                }}
                style={{ willChange: "transform, opacity" }}
              >
                AFRICA, NIGERIA
              </motion.p>
            </div>

            <div className='overflow-hidden'>
              <motion.h2
                className='font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight'
                initial={{ y: "120%" }}
                animate={isLoaded ? { y: 0 } : { y: "120%" }}
                transition={{
                  duration: 1.4,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 1.7,
                }}
                style={{ willChange: "transform" }}
              >
                Engineering ideas into
                <br />
                <span className='italic text-white/90'>digital reality.</span>
              </motion.h2>
            </div>
          </div>
        </div>

        {/* White Strip - GPU accelerated with transform */}
        <motion.div
          className='absolute top-0 left-0 right-0 z-10'
          style={{
            y: entranceOffset,
            willChange: "transform",
          }}
        >
          <motion.div
            className='h-[45vh] bg-white/90 backdrop-blur-sm flex items-end justify-center overflow-hidden'
            style={{
              y: scrollOffset,
              willChange: "transform",
            }}
          >
            <motion.div
              className='w-full relative flex items-end justify-center pointer-events-none overflow-hidden h-[40vh]'
              style={{
                transform: "translateY(20px)",
                willChange: "transform, opacity",
              }}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={
                isLoaded ? { scale: 1, opacity: 1 } : { scale: 1.5, opacity: 0 }
              }
              transition={{
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 1.2,
              }}
            >
              <svg
                viewBox='0 0 100 20'
                preserveAspectRatio='none'
                className='w-full h-full'
              >
                <text
                  x='50%'
                  y='50%'
                  textAnchor='middle'
                  dominantBaseline='central'
                  textLength='100'
                  lengthAdjust='spacingAndGlyphs'
                  fill='rgba(0, 0, 0, 0.1)'
                  style={{
                    fontFamily: 'Impact, "Arial Narrow Bold", sans-serif',
                    fontSize: "20px",
                  }}
                >
                  BLACK LOTUS
                </text>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

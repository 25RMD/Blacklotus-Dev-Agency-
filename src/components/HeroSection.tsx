import { motion, useReducedMotion } from "framer-motion"
import { useRef, useEffect } from "react"
import { Link } from "react-router"
import { Magnetic } from "./ui/Magnetic"

interface HeroSectionProps {
  isLoaded?: boolean
}

export function HeroSection({ isLoaded = false }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.log("Autoplay prevented:", e))
    }
  }, [])

  return (
    <section
      id='home'
      ref={sectionRef}
      className='relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center'
    >
      {/* Video Background */}
      <div className='absolute inset-0 z-0 bg-black'>
        <motion.video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          className='absolute inset-0 h-full w-full object-cover object-center hero-bg-image'
          src="/bg-video/bg.mp4"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={
            isLoaded ? { opacity: 0.75, scale: 1 } : { opacity: 0, scale: 1.08 }
          }
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          style={{ willChange: "transform, opacity" }}
        />

        {/* Gradient overlay */}
        <motion.div
          className='absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/50'
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 2, delay: 0.8 }}
        />

        <div className='tactile-grain absolute inset-0 z-10 pointer-events-none' />
      </div>

      {/* Centered Hero Content */}
      <div className='relative z-20 text-center text-white px-6 max-w-[92rem] mx-auto'>
        {/* Eyebrow label */}
        <div className='overflow-hidden mb-4'>
          <motion.p
            className='text-[10px] md:text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-white/70'
            initial={{ y: "100%", opacity: 0 }}
            animate={
              isLoaded ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }
            }
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
            style={{ willChange: "transform, opacity" }}
          >
            Digital Creative Agency
          </motion.p>
        </div>

        {/* Main heading */}
        <div className='overflow-hidden mb-7'>
          <motion.h1
            className='font-display text-[clamp(3.9rem,12.4vw,12.5rem)] font-semibold tracking-[-0.035em] leading-[0.9] text-white'
            initial={{ y: "120%" }}
            animate={isLoaded ? { y: 0 } : { y: "120%" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
            style={{ willChange: "transform" }}
          >
            Ideas engineered
            <br />
            <span className='font-medium text-white'>
              to perform.
            </span>
          </motion.h1>
        </div>

        {/* CTA Buttons */}
        <motion.div
          className='flex flex-col md:flex-row gap-3 justify-center items-center mt-1'
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.9 }}
          style={{ willChange: "transform, opacity" }}
        >
          <Magnetic>
            <Link
              to='/#projects'
              className='tactile-press bg-white text-black px-7 py-3 border border-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-neutral-100 transition-colors'
            >
              View Our Work
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              to='/#contact'
              className='tactile-press text-white border border-white/60 px-7 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase hover:border-white hover:bg-white/10 transition-colors'
            >
              Start a Project
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      {/* Bottom bar — location left, scroll right */}
      <motion.div
        className='absolute bottom-8 left-0 w-full flex justify-between px-6 md:px-12 text-white text-[10px] tracking-[0.2em] uppercase z-20 font-medium'
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 2.1 }}
      >
        <span>Africa, Nigeria</span>
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          Scroll
        </motion.span>
      </motion.div>
    </section>
  )
}

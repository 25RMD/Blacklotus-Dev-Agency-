import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCursor } from '../context/CursorContext'

// Define the images and their start positions on the "film strip"
const images = [
  { col: 0, src: "/curtainReveal/1.jpg", top: "10%" },
  { col: 0, src: "/curtainReveal/2.jpg", top: "100%" },
  { col: 1, src: "/curtainReveal/3.jpg", top: "0%" },
  { col: 1, src: "/curtainReveal/4.jpg", top: "120%" },
  { col: 2, src: "/curtainReveal/5.jpg", top: "50%" },
  { col: 3, src: "/curtainReveal/6.jpg", top: "5%" },
  { col: 3, src: "/curtainReveal/7.jpg", top: "90%" },
  { col: 4, src: "/curtainReveal/8.jpg", top: "20%" },
  { col: 4, src: "/curtainReveal/9.jpg", top: "110%" },
]

export function CurtainReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { setCursorText, setCursorVariant } = useCursor()

  // Track scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Column movement transforms - creates the film strip scrolling effect
  const transforms = [
    useTransform(scrollYProgress, [0, 1], ["0%", "-180%"]),
    useTransform(scrollYProgress, [0, 1], ["0%", "-250%"]),
    useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]),
    useTransform(scrollYProgress, [0, 1], ["0%", "-230%"]),
    useTransform(scrollYProgress, [0, 1], ["0%", "-210%"]),
  ]

  // Color transitions: black to white halfway through
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    ["#000000", "#ffffff"]
  )

  const borderColor = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    ["rgba(255, 255, 255, 0.15)", "rgba(0, 0, 0, 0.35)"]
  )

  return (
    // Outer container creates the scroll track (200vh of scroll distance)
    <section
      id="process"
      ref={containerRef}
      className="relative h-[200vh]"
    >
      {/* Sticky container - pins at the top when scrolled to */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background layer that transitions from black to white */}
        <motion.div
          style={{ backgroundColor }}
          className="absolute inset-0"
        />

        {/* Fixed Gridlines Layer - stays in place while images scroll */}
        <div className="absolute inset-0 top-[180px] grid grid-cols-5 h-full pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_100px)]">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              style={{ borderLeftColor: borderColor }}
              className="w-full h-full border-l"
            />
          ))}
        </div>

        {/* The Film Strips (images scroll within the sticky container) */}
        <div className="absolute inset-0 top-[180px] grid grid-cols-5 h-full">
          {transforms.map((y, i) => (
            <motion.div
              key={i}
              style={{ y }}
              className="relative w-full h-[300%] bg-transparent"
            >
              {images.filter(img => img.col === i).map((img, idx) => (
                <div
                  key={idx}
                  className="absolute w-[85%] aspect-[3/4] left-1/2 -translate-x-1/2 overflow-hidden"
                  style={{ top: img.top }}
                >
                  <img src={img.src} className="w-full h-full object-cover opacity-80" />
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* The Text Overlay */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center mix-blend-difference z-10 pointer-events-auto"
          onMouseEnter={() => {
            setCursorText("MAKE IT HAPPEN")
            setCursorVariant("text")
          }}
          onMouseLeave={() => {
            setCursorText("")
            setCursorVariant("default")
          }}
        >
          <span className="text-white text-xs md:text-sm font-medium tracking-widest uppercase mb-4">Get Started</span>
          <h2 className="text-white text-5xl md:text-8xl font-display text-center leading-[0.9] tracking-tighter">
            Let's make<br />things happen.
          </h2>
        </div>
      </div>
    </section>
  )
}
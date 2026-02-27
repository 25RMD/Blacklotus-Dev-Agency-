import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"

export function HowWeDo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for the lag effect
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset slightly to the bottom right of the cursor
      mouseX.set(e.clientX + 20)
      mouseY.set(e.clientY + 20)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const pillars = [
    {
      title: "Integrity",
      image: "/art/integrity.jpg",
      description: "An unwavering commitment to honesty and strong ethical principles in every line of code we write and relationship we build.",
    },
    {
      title: "Hunger",
      image: "/art/hunger.jpg",
      description: "An insatiable drive to continuously push boundaries, innovate relentlessly, and devour new challenges.",
    },
    {
      title: "Depth",
      image: "/art/depth2.jpg",
      description: "We are multi-sensorial beings. We tell the stories of organizations in a way people can see, hear, and feel at every turn.",
    },
    {
      title: "Care",
      image: "/art/care.jpg",
      description: "It takes a little optimistic defiance to push against the current and design the remarkable future.",
    },
  ]

  return (
    <section id='how-we-do' className='relative w-full bg-black px-0 pb-0 overflow-hidden'>
      {/* Default Background (when nothing is hovered) */}
      <div className='absolute inset-0 z-0 bg-black' />

      {/* Background Images (Section Level) */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className='absolute inset-0 z-10'
          >
            <img
              src={pillars[hoveredIndex].image}
              alt={pillars[hoveredIndex].title}
              className='w-full h-full object-cover'
            />
            {/* Optional overlay to ensure text readability */}
            <div className='absolute inset-0 bg-black/20 mix-blend-multiply' />
          </motion.div>
        )}
      </AnimatePresence>

      <div className='border-y border-white/20 relative z-30 mix-blend-difference'>
        <p className='px-6 md:px-12 py-5 text-[11px] font-medium tracking-[0.16em] uppercase text-white/80'>
          How we do it
        </p>
      </div>

      <div className='relative z-20 grid grid-cols-1 md:grid-cols-2 h-[136vh] md:h-[84vh] min-h-[920px] md:min-h-[640px]'>
        {/* Grid Items */}
        {pillars.map((pillar, index) => (
          <div
            key={pillar.title}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative z-20 h-full w-full border-white/10 transition-colors duration-300 ${hoveredIndex === null
              ? "bg-black text-white"
              : "text-black"
              } ${index % 2 === 0 ? "md:border-r" : ""} ${index < 2 ? "border-b" : ""}`}
          >
            <div className='h-full w-full flex items-center justify-center px-8'>
              <h3 className='font-display font-semibold tracking-[-0.03em] leading-none text-[clamp(3rem,8vw,6.8rem)] mix-blend-difference text-white'>
                {pillar.title}
              </h3>
            </div>
          </div>
        ))}

        {/* Floating Hover Block */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className='pointer-events-none fixed left-0 top-0 z-50 w-[280px] border border-black/20 bg-[#f2f2f2] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.12)]'
              style={{
                x: springX,
                y: springY,
              }}
            >
              <p className='text-[0.9rem] font-medium leading-[1.45] tracking-[-0.01em] text-black'>
                {pillars[hoveredIndex].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

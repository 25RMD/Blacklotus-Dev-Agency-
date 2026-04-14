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
    if (hoveredIndex === null || typeof window === "undefined" || window.innerWidth < 768) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Offset slightly to the bottom right of the cursor
      mouseX.set(e.clientX + 20)
      mouseY.set(e.clientY + 20)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [hoveredIndex, mouseX, mouseY])

  const pillars = [
    {
      title: "Integrity",
      image: "/art/integrity.webp",
      mobileImage: "/mobile/integrityMobile.webp",
      description: "An unwavering commitment to honesty and strong ethical principles in every line of code we write and relationship we build.",
    },
    {
      title: "Hunger",
      image: "/art/hunger.webp",
      mobileImage: "/mobile/hungerMobile.webp",
      description: "An insatiable drive to continuously push boundaries, innovate relentlessly, and devour new challenges.",
    },
    {
      title: "Depth",
      image: "/art/depth2.webp",
      mobileImage: "/mobile/depthMobile.webp",
      description: "We are multi-sensorial beings. We tell the stories of organizations in a way people can see, hear, and feel at every turn.",
    },
    {
      title: "Care",
      image: "/art/care.webp",
      mobileImage: "/mobile/careMobile.webp",
      description: "It takes a little optimistic defiance to push against the current and design the remarkable future.",
    },
  ]

  return (
    <section id='how-we-do' className='relative w-full bg-black px-0 pb-0 md:overflow-hidden -mb-px'>

      {/* === DESKTOP VIEW === */}
      <div className="hidden md:block relative w-full h-full">
        {/* Default Background */}
        <div className='absolute inset-0 z-0 bg-black' />

        {/* Background Images (Section Level) */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              key={hoveredIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className='absolute inset-0 z-10'
            >
              <picture>
                <source media="(max-width: 768px)" srcSet={pillars[hoveredIndex].mobileImage} />
                <img
                  src={pillars[hoveredIndex].image}
                  alt={pillars[hoveredIndex].title}
                  className='w-full h-full object-cover'
                />
              </picture>
              <div className='absolute inset-0 bg-black/20 mix-blend-multiply' />
            </motion.div>
          )}
        </AnimatePresence>

        <div className='relative z-30 mix-blend-difference px-6 md:px-12 pt-0 pb-12 pointer-events-none'>
          <motion.p
            className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-zinc-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            How We Do It
          </motion.p>
        </div>

        <div className='relative z-20 grid grid-cols-2 h-[84vh] min-h-[640px]'>
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative z-20 h-full w-full border-white/10 transition-colors duration-300 ${hoveredIndex === null
                ? "bg-black text-white"
                : "text-black"
                } ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b" : ""}`}
            >
              <div className='h-full w-full flex items-center justify-center px-8'>
                <h3 className='font-sans font-light tracking-tight leading-none text-[clamp(3rem,8vw,6.8rem)] mix-blend-difference text-white'>
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
                style={{ x: springX, y: springY }}
              >
                <p className='text-[0.9rem] font-medium leading-[1.45] tracking-[-0.01em] text-black'>
                  {pillars[hoveredIndex].description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* === MOBILE VIEW (Sticky Cards) === */}
      <div className="block md:hidden relative w-full">
        <div className='relative z-30 bg-black px-6 pt-4 pb-12'>
          <motion.p
            className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-zinc-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            How We Do It
          </motion.p>
        </div>

        {/* Sticky Deck Container */}
        <div className="relative w-full">
          {pillars.map((pillar, i) => (
            <div key={i} className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-end pb-24 px-6 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              {/* Full Bleed Background Image */}
              <div className="absolute inset-0 z-0 bg-black">
                <img
                  src={pillar.mobileImage}
                  alt={pillar.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Dark Gradient Overlay for optimal text legibility */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
              </div>

              {/* Card Foreground Content */}
              <div className="relative z-10 w-full max-w-sm">
                <h3 className="font-sans font-light tracking-tight leading-[0.95] text-[clamp(3.5rem,16vw,6rem)] text-white mb-5 drop-shadow-md">
                  {pillar.title}
                </h3>
                <p className="text-white/85 text-[1.05rem] leading-relaxed drop-shadow-sm">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

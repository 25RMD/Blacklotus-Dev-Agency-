import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxTitle() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])

  return (
    <section ref={containerRef} className="relative w-full min-h-[80vh] bg-white flex items-center justify-center overflow-hidden py-24">
      {/* Parallax Text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-10 md:opacity-100 mix-blend-difference">
         {/* Note: In a real implementation, this might need to be 'sticky' or handled differently to stay in view while images scroll over. 
             For simplicity, we'll place it in the background of this section. */}
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <h2 className="text-[12vw] leading-[0.8] font-serif font-bold text-center tracking-tighter text-black mix-blend-exclusion">
          CREATIVE<br />GIANTS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
           <motion.div style={{ y }} className="aspect-[3/4] bg-zinc-100">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
           </motion.div>
           <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }} className="aspect-[3/4] bg-zinc-100 md:mt-24">
              <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
           </motion.div>
           <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }} className="aspect-[3/4] bg-zinc-100">
              <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
           </motion.div>
        </div>
      </div>
    </section>
  )
}

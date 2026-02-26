import { motion } from 'framer-motion'

export function VideoHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Sticky Logo */}
      <div className="absolute top-8 left-8 z-40 mix-blend-difference">
        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
          <span className="font-display text-xl text-white pt-1">BL</span>
        </div>
      </div>

      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://cdn.coverr.co/videos/coverr-working-in-an-office-4835/1080p.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Hero Text */}
      <div className="absolute bottom-12 left-8 md:left-12 z-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
            Production, design, <br />
            and the art of the possible.
          </h1>
        </motion.div>
      </div>
    </section>
  )
}

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OverlayMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  'Home',
  'Projects',
  'Process',
  'Latest News',
  'Contact'
]

export function OverlayMenu({ isOpen, onClose }: OverlayMenuProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-black text-white flex flex-col"
        >
          {/* --- HEADER --- */}
          <div className="w-full flex justify-between items-center px-6 py-6 md:px-10">
            {/* Logo */}
            <div className="w-12 h-12 flex items-center justify-center">
               <img 
                src="/blacklotus.svg" 
                alt="Black Lotus" 
                className="h-10 w-10 object-contain"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-full border border-white/20 px-8 py-3 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors"
            >
              Close
            </button>
          </div>

          {/* --- MAIN CONTENT (LINKS) --- */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <nav className="flex flex-col items-center gap-2 md:gap-4">
              {menuItems.map((item, i) => (
                <motion.a
                  key={item}
                  href="#"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl md:text-7xl lg:text-8xl font-sans font-normal tracking-tight hover:text-zinc-400 transition-colors cursor-pointer text-center"
                  onClick={onClose}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* --- FOOTER --- */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 items-end gap-8 px-6 py-8 md:px-10 pb-10">
            
            {/* Left: Copyright */}
            <div className="flex flex-col gap-1 text-xs md:text-sm text-zinc-400 font-sans">
              <p>©2025</p>
              <p className="hover:text-white cursor-pointer transition-colors">Privacy Policy | Cookies</p>
            </div>

            {/* Center: Address */}
            <div className="flex flex-col gap-1 text-xs md:text-sm text-zinc-400 font-sans md:text-center">
              <p>AFRICA, NIGERIA</p>
              <a href="mailto:blacklotusenquiry@gmail.com" className="hover:text-white transition-colors">
                blacklotusenquiry@gmail.com
              </a>
            </div>

            {/* Right: Video Thumbnail */}
            <div className="flex justify-start md:justify-end">
              <div className="relative w-48 h-28 bg-zinc-900 rounded overflow-hidden group cursor-pointer">
                <video 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                >
                   <source src="/bg-video/1.mp4" type="video/mp4" />
                </video>
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white">0:00</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

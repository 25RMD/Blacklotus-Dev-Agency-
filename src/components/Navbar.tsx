import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface NavbarProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
}

export function Navbar({ isMenuOpen, onToggleMenu }: NavbarProps) {
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useEffect(() => {
    setScrollbarWidth(window.innerWidth - document.documentElement.clientWidth)
  }, [])

  return (
    <nav 
      className="fixed top-0 left-0 z-[101] flex items-center justify-between px-6 py-6 md:px-10 pointer-events-none transition-[right] duration-0"
      style={{ right: isMenuOpen ? `${scrollbarWidth}px` : '0px' }}
    >
      {/* Logo & Tagline */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <img 
          src="/blacklotus.svg" 
          alt="Black Lotus" 
          className="h-12 w-12 rounded-full object-contain"
        />
        {/* Tagline - Hidden when menu is open to avoid clutter/contrast issues */}
        <AnimatePresence>
          {!isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden md:flex flex-col text-[11px] leading-tight font-medium uppercase tracking-wide text-white/70 mix-blend-difference"
            >
              <span>Web & Software Solutions</span>
              <span className="text-white/50">Digital Transformation</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Button */}
      <button 
        onClick={onToggleMenu}
        className={`pointer-events-auto relative overflow-hidden rounded-full border px-8 py-3 text-sm font-medium transition-all duration-500 w-[110px] ${
          isMenuOpen 
            ? 'bg-white text-black border-white' 
            : 'bg-black text-white border-white/20 hover:bg-zinc-900'
        }`}
      >
        <div className="relative h-5 w-full">
            <AnimatePresence mode="popLayout" initial={false}>
                {isMenuOpen ? (
                    <motion.span
                        key="close"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        Close
                    </motion.span>
                ) : (
                    <motion.span
                        key="menu"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        Menu
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
      </button>
    </nav>
  )
}

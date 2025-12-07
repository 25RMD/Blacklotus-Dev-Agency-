import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface NavbarProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
}

export function Navbar({ isMenuOpen, onToggleMenu }: NavbarProps) {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check both regular scroll AND hero strip progress
      const heroProgress = window.heroStripProgress || 0
      setHasScrolled(window.scrollY > 10 || heroProgress > 0.05)
    }
    
    // Check initial scroll position
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Also listen to wheel events for when Lenis is stopped (during hero strip animation)
    const handleWheel = () => {
      // Small delay to let progress update
      requestAnimationFrame(handleScroll)
    }
    window.addEventListener('wheel', handleWheel, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-[101] flex items-center justify-between px-6 py-6 md:px-10 pointer-events-none"
    >
      {/* Logo & Tagline */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <img 
          src="/blacklotus.svg" 
          alt="Black Lotus" 
          className="h-12 w-12 rounded-full object-contain"
        />
        {/* Tagline - Hidden when menu is open or when scrolled */}
        <AnimatePresence>
          {!isMenuOpen && !hasScrolled && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col text-[9px] md:text-[11px] leading-tight font-medium uppercase tracking-wide text-black"
            >
              <span>Web & Software Solutions</span>
              <span className="text-black/70">Digital Transformation</span>
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

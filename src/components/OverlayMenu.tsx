import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLocation, useNavigate } from "react-router"

interface OverlayMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenPrivacy: () => void
}

export const menuItems = [
  { label: "Home", id: "/#home" },
  { label: "What We Do", id: "/#what-we-do" },
  { label: "Projects", id: "/#projects" },
  { label: "Process", id: "/#process" },
  { label: "Testimonials", id: "/#testimonials" },
  { label: "Contact", id: "/#contact" },
  { label: "Blog", id: "/blog" },
]
export const useHandleNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Check if target is just a hash on the current page
  return (targetPath: string) => {
    const isHomePage = location.pathname === "/"
    const [path, hash] = targetPath.split("#")

    if (isHomePage && hash) {
      // We are already home, just scroll
      setTimeout(() => {
        const element = document.querySelector(`#${hash}`)
        if (window.lenis) {
          window.lenis.scrollTo(`#${hash}`)
        } else {
          element?.scrollIntoView({ behavior: "smooth" })
        }
        window.history.pushState(null, "", targetPath)
      }, 800) // Adjust delay based on your menu exit animation
    } else {
      setTimeout(() => {
        navigate(targetPath)
      }, 300)
    }
  }
}

export function OverlayMenu({
  isOpen,
  onClose,
  onOpenPrivacy,
}: OverlayMenuProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const handleNavigation = useHandleNavigation()
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.lenis?.stop()
    } else {
      document.body.style.overflow = "unset"
      window.lenis?.start()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className='fixed inset-0 z-[100] bg-black text-white flex flex-col'
        >
          {/* Spacer for fixed Navbar */}
          <div className='w-full h-32 flex-shrink-0' />

          {/* --- MAIN CONTENT (LINKS) --- */}
          <div className='flex-1 flex flex-col items-center justify-center min-h-0'>
            <nav
              className='flex flex-col items-start gap-2 md:gap-4'
              onMouseLeave={() => setHoveredItem(null)}
            >
              {menuItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.id}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity:
                      hoveredItem && hoveredItem !== item.label ? 0.3 : 1,
                  }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{
                    y: {
                      delay: 0.4 + i * 0.1,
                      duration: 1.2,
                      ease: [0.19, 1, 0.22, 1],
                    },
                    opacity: { duration: 0.5 },
                  }}
                  className='group flex items-center gap-4 text-5xl md:text-7xl 2xl:text-8xl font-serif font-normal tracking-tight cursor-pointer'
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onClick={(e) => {
                    e.preventDefault()
                    onClose()
                    handleNavigation(item.id)
                  }}
                >
                  {/* Arrow Reveal */}
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      width: hoveredItem === item.label ? "auto" : 0,
                      opacity: hoveredItem === item.label ? 1 : 0,
                    }}
                    className='overflow-hidden flex items-center'
                  >
                    <ArrowRight className='w-8 h-8 md:w-12 md:h-12 mr-2 md:mr-4' />
                  </motion.span>

                  <span className='group-hover:translate-x-2 transition-transform duration-300'>
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </nav>
          </div>

          {/* --- FOOTER --- */}
          <div className='w-full grid grid-cols-1 md:grid-cols-3 items-end gap-8 px-6 py-8 md:px-10 pb-10 flex-shrink-0'>
            {/* Left: Copyright */}
            <div className='flex flex-col gap-1 text-xs md:text-sm text-zinc-400 font-sans'>
              <p>©2025</p>
              <p
                onClick={onOpenPrivacy}
                className='hover:text-white cursor-pointer transition-colors'
              >
                Privacy Policy | Cookies
              </p>
            </div>

            {/* Center: Address */}
            <div className='flex flex-col gap-1 text-xs md:text-sm text-zinc-400 font-sans md:text-center'>
              <p>AFRICA, NIGERIA</p>
              <a
                href='mailto:blacklotusenquiry@gmail.com'
                className='hover:text-white transition-colors'
              >
                blacklotusenquiry@gmail.com
              </a>
            </div>

            {/* Right: Video Thumbnail */}
            <div className='flex justify-start md:justify-end'>
              <div
                className='relative w-48 h-28 bg-zinc-900 rounded overflow-hidden group cursor-pointer'
                onMouseEnter={() => videoRef.current?.play()}
                onMouseLeave={() => {
                  if (videoRef.current) {
                    videoRef.current.pause()
                    videoRef.current.currentTime = 0
                  }
                }}
              >
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  className='w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500'
                >
                  <source src='/bg-video/1.mp4' type='video/mp4' />
                </video>
                {/* Play Icon Overlay */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform'>
                    <div className='w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1' />
                  </div>
                </div>
                <span className='absolute bottom-2 left-2 text-[10px] font-mono text-white'>
                  0:00
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

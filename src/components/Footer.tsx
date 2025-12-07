import { useRef } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, Instagram, Linkedin } from 'lucide-react'

const FooterNavItem = ({ label, href, onClick, index, total, color }: { label: string, href: string, onClick: (e: React.MouseEvent) => void, index: number, total: number, color: string }) => {
  const bgRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<SVGSVGElement>(null)

  const handleMouseEnter = () => {
    gsap.to(bgRef.current, { y: '0%', duration: 0.6, ease: 'power4.out' })
    gsap.to(textRef.current, { color: 'black', duration: 0.3 })
    gsap.to(iconRef.current, { color: 'black', x: 4, y: -4, duration: 0.3 })
  }

  const handleMouseLeave = () => {
    gsap.to(bgRef.current, { y: '100%', duration: 0.6, ease: 'power4.in' })
    gsap.to(textRef.current, { color: 'white', duration: 0.3 })
    gsap.to(iconRef.current, { color: '#71717a', x: 0, y: 0, duration: 0.3 })
  }

  const borderOpacity = 0.5 * (1 - index / (total - 1))

  return (
    <a
      href={href}
      onClick={onClick}
      className="relative flex items-center justify-between px-6 md:px-10 py-6 overflow-hidden block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Color Sweep Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ backgroundColor: color, transform: 'translateY(100%)' }}
      />

      {/* Fading border effect */}
      {borderOpacity > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-px z-10"
          style={{
            background: `linear-gradient(to right, rgba(255, 255, 255, ${borderOpacity}) 0%, rgba(255, 255, 255, ${borderOpacity}) 20%, rgba(255, 255, 255, 0) 100%)`
          }}
        />
      )}

      <span ref={textRef} className="text-sm md:text-base font-medium tracking-wide relative z-10 text-white">
        {label}
      </span>
      <ArrowUpRight ref={iconRef} className="w-4 h-4 text-zinc-500 relative z-10" />
    </a>
  )
}

export function Footer({ onOpenPrivacy: _onOpenPrivacy }: { onOpenPrivacy?: () => void }) {
  return (
    <footer className="w-full bg-black text-white relative overflow-hidden border-t border-white/20">

      {/* Top Section - Compact Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3">

        {/* COLUMN 1: Brand & Info */}
        <div className="relative flex flex-col justify-between p-6 md:p-10">
          <div className="hidden lg:block absolute right-0 top-0 h-full w-px bg-gradient-to-b from-white/20 to-transparent" />
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img 
                src="/blacklotus.svg" 
                alt="Black Lotus" 
                className="w-8 h-8 rounded-full object-contain"
              />
              <div className="text-xs font-bold uppercase leading-tight tracking-wide mt-1">
                WEB & SOFTWARE SOLUTIONS <br />
                <span className="text-zinc-500">DIGITAL TRANSFORMATION</span>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-xs pt-2">
              We are a premium web and software development agency dedicated to engineering ideas into digital reality. We build high-performance, scalable solutions for modern businesses.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="text-zinc-400 text-xs space-y-1">
              <p>AFRICA, NIGERIA</p>
              <a href="mailto:blacklotusenquiry@gmail.com" className="text-white hover:underline transition-all">
                blacklotusenquiry@gmail.com
              </a>
            </div>
            <div className="flex gap-4">
              <Instagram className="w-4 h-4 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
              <Linkedin className="w-4 h-4 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>

        {/* COLUMN 2: Navigation */}
        <div className="relative flex flex-col">
          <div className="hidden lg:block absolute right-0 top-0 h-full w-px bg-gradient-to-b from-white/20 to-transparent" />
          {[
            { label: 'HOME', href: '#home' },
            { label: 'PROJECTS', href: '#projects' },
            { label: 'WHAT WE DO', href: '#what-we-do' },
            { label: 'LATEST NEWS', href: '#testimonials' },
            { label: 'GET IN TOUCH', href: '#contact' }
          ].map((item, i, arr) => (
            <FooterNavItem 
              key={i}
              label={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                if ((window as any).lenis) {
                  (window as any).lenis.scrollTo(item.href)
                } else {
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              index={i}
              total={arr.length}
              color={['#FF00FF', '#00FF00', '#00FFFF', '#FFAA00', '#FFFF00'][i]}
            />
          ))}
        </div>

        {/* COLUMN 3: CTA & Copyright */}
        <div className="flex flex-col justify-between p-6 md:p-10">
          <div className="max-w-md">
            <h3 className="text-2xl md:text-3xl font-light leading-[1.1] mb-4 tracking-tight">
              Ready to kick start a discovery session?
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Share your ideas with us, and we'll begin turning your vision into reality today.
            </p>
          </div>

          <div className="flex justify-between items-end mt-12 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            <span>BLACK LOTUS DEVELOPMENT AGENCY LTD 2025 ©</span>
            <span>WEBSITE BY US</span>
          </div>
        </div>

      </div>

      {/* Massive Bottom Text - scaled to exactly fill its container */}
      <div className="w-full relative flex items-end justify-center pointer-events-none overflow-hidden -mt-2 h-[40vh]">
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            textLength="100"
            lengthAdjust="spacingAndGlyphs"
            fill="white"
            style={{
              fontFamily: 'Impact, "Arial Narrow Bold", sans-serif',
              fontSize: '20px',
            }}
          >
            BLACK LOTUS
          </text>
        </svg>
      </div>
    </footer>
  )
}
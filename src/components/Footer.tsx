import { useRef } from "react"
import gsap from "gsap"
import { ArrowUpRight, Instagram, Facebook, ArrowRight } from "lucide-react"
import { useHandleNavigation, menuItems } from "./OverlayMenu"
import { LightRays } from "./ui/LightRays"

// ── Animated nav link with color sweep ──
const FooterNavItem = ({
  label,
  href,
  onClick,
}: {
  label: string
  href: string
  onClick: (e: React.MouseEvent) => void
}) => {
  const lineRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<SVGSVGElement>(null)

  const handleMouseEnter = () => {
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.4, ease: "power3.out" })
    gsap.to(iconRef.current, { x: 4, duration: 0.3, ease: "power3.out" })
  }

  const handleMouseLeave = () => {
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.4, ease: "power3.in" })
    gsap.to(iconRef.current, { x: 0, duration: 0.3, ease: "power3.in" })
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative flex items-center gap-2 text-[13px] tracking-[-0.01em] text-white/65 hover:text-white transition-colors duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ArrowUpRight ref={iconRef} className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span>{label}</span>
      <div
        ref={lineRef}
        className="absolute -bottom-0.5 left-5 right-0 h-px bg-white origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </a>
  )
}

export function Footer({
  onOpenPrivacy: _onOpenPrivacy,
}: {
  onOpenPrivacy?: () => void
}) {
  const handleNavigation = useHandleNavigation()
  const ctaRef = useRef<HTMLAnchorElement>(null)

  return (
    <footer className="relative w-full text-white overflow-hidden bg-black">
      {/* ── LightRays fills the ENTIRE footer as background ── */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="bottom-center"
          raysColor="#ffffff"
          raysSpeed={1.5}
          lightSpread={1.2}
          rayLength={2.5}
          followMouse={true}
          mouseInfluence={0.3}
          noiseAmount={0.03}
          distortion={0.08}
        />
      </div>

      {/* Dark overlay so text stays legible over balls */}
      <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none" />

      {/* All content layers above the ballpit */}
      <div className="relative z-20">

        {/* ── Info Grid ── */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
              {/* Brand */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <img
                    src="/BL-logo.jpg"
                    alt="Black Lotus"
                    className="w-7 h-7 rounded-full object-contain"
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Black Lotus
                  </span>
                </div>
                <p className="text-white/50 text-[13px] leading-relaxed max-w-[280px]">
                  Premium web & software development agency. Engineering ideas
                  into digital reality.
                </p>
                <div className="flex gap-3 pt-1">
                  <a
                    href="https://www.instagram.com/blacklotusdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5 text-white/60" />
                  </a>
                  <a
                    href="https://www.facebook.com/share/1BooF4RPbd/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 transition-all"
                  >
                    <Facebook className="w-3.5 h-3.5 text-white/60" />
                  </a>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-medium mb-5">
                  Navigation
                </h4>
                <nav className="flex flex-col gap-3">
                  {menuItems.map((item, i) => (
                    <FooterNavItem
                      key={i}
                      label={item.label}
                      href={item.id}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavigation(item.id)
                      }}
                    />
                  ))}
                </nav>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-medium mb-5">
                  Contact
                </h4>
                <div className="flex flex-col gap-3 text-[13px] text-white/55">
                  <span>Africa, Nigeria</span>
                  <a
                    href="mailto:blacklotusenquiry@gmail.com"
                    className="text-white/70 hover:text-white transition-colors break-all"
                  >
                    blacklotusenquiry@gmail.com
                  </a>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-medium mb-5">
                  Services
                </h4>
                <div className="flex flex-col gap-3 text-[13px] text-white/45">
                  <span>Web Development</span>
                  <span>Software Engineering</span>
                  <span>UI/UX Design</span>
                  <span>Cloud & DevOps</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-white/35 text-center md:text-left">
                © {new Date().getFullYear()} Black Lotus Development Agency Ltd
              </span>
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-white/35 text-center">
                Music 'Horizons' by Scott Buckley
              </span>
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-white/35 text-center md:text-right">
                Designed & Built by Us
              </span>
            </div>
          </div>
        </div>

        {/* ── Massive Bottom Text ── */}
        <div className="w-full pointer-events-none overflow-hidden h-[30vh] md:h-[35vh]">
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
              fillOpacity="1"
              style={{
                fontFamily: '"Poppins", "Area Normal", sans-serif',
                fontWeight: 600,
                fontSize: "20px",
                letterSpacing: "-0.04em",
              }}
            >
              BLACK LOTUS
            </text>
          </svg>
        </div>

      </div>
    </footer>
  )
}

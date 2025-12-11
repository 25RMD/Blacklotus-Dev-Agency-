import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { OverlayMenu } from './components/OverlayMenu'
import { HeroSection } from './components/HeroSection'
import { WhatWeDo } from './components/WhatWeDo'
import { ProjectSlider } from './components/ProjectSlider'
import { CurtainReveal } from './components/CurtainReveal'
import { Testimonials } from './components/Testimonials'
import { GetInTouch } from './components/GetInTouch'
import { Footer } from './components/Footer'
import { SmoothScroll } from './components/SmoothScroll'
import { PrivacyPolicy } from './components/PrivacyPolicy'
import { LoadingScreen } from './components/LoadingScreen'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {/* Main content - always rendered, loading screen slides up to reveal it */}
      <SmoothScroll>
        <main className="bg-white min-h-screen w-full overflow-x-clip selection:bg-black selection:text-white">
          <Navbar isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
          <OverlayMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onOpenPrivacy={() => {
              setIsMenuOpen(false)
              setIsPrivacyOpen(true)
            }}
          />
          <HeroSection isLoaded={!isLoading} />
          <WhatWeDo />
          <ProjectSlider />
          <CurtainReveal />
          <Testimonials />
          <GetInTouch />
          <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />
        </main>
      </SmoothScroll>
      {/* Privacy Policy outside SmoothScroll so Lenis doesn't intercept its scroll events */}
      <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />

      {/* Loading screen - slides up to reveal content */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen key="loader" onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default App
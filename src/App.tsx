import { useState } from 'react'
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
import { CursorProvider } from './context/CursorContext'
import { CustomCursor } from './components/CustomCursor'
import { PrivacyPolicy } from './components/PrivacyPolicy'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)

  return (
    <CursorProvider>
      <SmoothScroll>
        <CustomCursor />
        <main className="bg-white min-h-screen w-full overflow-x-clip selection:bg-black selection:text-white cursor-none">
          <Navbar isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
          <OverlayMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            onOpenPrivacy={() => {
              setIsMenuOpen(false)
              setIsPrivacyOpen(true)
            }}
          />
          <HeroSection />
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
    </CursorProvider>
  )
}

export default App
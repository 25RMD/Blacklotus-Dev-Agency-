import { useState } from 'react'
import { OverlayMenu } from './components/OverlayMenu'
import { HeroSection } from './components/HeroSection'
import { WhatWeDo } from './components/WhatWeDo'
import { ProjectSlider } from './components/ProjectSlider'
import { CurtainReveal } from './components/CurtainReveal'
import { Testimonials } from './components/Testimonials'
import { GetInTouch } from './components/GetInTouch'
import { Footer } from './components/Footer'
import { SmoothScroll } from './components/SmoothScroll'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <SmoothScroll>
      <main className="bg-white min-h-screen w-full overflow-x-clip selection:bg-black selection:text-white">
        <OverlayMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <HeroSection onOpenMenu={() => setIsMenuOpen(true)} />
        <WhatWeDo />
        <ProjectSlider />
        <CurtainReveal />
        <Testimonials />
        <GetInTouch />
        <Footer />
      </main>
    </SmoothScroll>
  )
}

export default App
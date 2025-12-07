import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
import { LoadingScreen } from './components/LoadingScreen'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" onLoadingComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router"
import { AnimatePresence } from "framer-motion"
import { Navbar } from "../components/Navbar"
import { OverlayMenu } from "../components/OverlayMenu"
import { HeroSection } from "../components/HeroSection"
import { WhatWeDo } from "../components/WhatWeDo"
import { HowWeDo } from "../components/HowWeDo"
import { ProjectSlider } from "../components/ProjectSlider"
import { GetStartedMarquee } from "../components/GetStartedMarquee"
import { InsightsSlider } from "../components/InsightsSlider"
import { GetInTouch } from "../components/GetInTouch"
import { Footer } from "../components/Footer"
import { SmoothScroll } from "../components/SmoothScroll"
import { PrivacyPolicy } from "../components/PrivacyPolicy"
import { LoadingScreen } from "../components/LoadingScreen"

function App() {
  const location = useLocation()
  const skipSplash = useMemo(() => {
    const state = location.state as { skipSplash?: boolean } | null
    return Boolean(state?.skipSplash)
  }, [location.state])
  const [isLoading, setIsLoading] = useState(!skipSplash)

  useEffect(() => {
    if (skipSplash) setIsLoading(false)
  }, [skipSplash])

  return (
    <>
      <Layout>
        <HeroSection isLoaded={!isLoading} />
        <WhatWeDo />
        <HowWeDo />
        <ProjectSlider />
        <GetStartedMarquee />
        <InsightsSlider />
        <GetInTouch />
      </Layout>
      {/* Loading screen - slides up to reveal content */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen
            key='loader'
            onLoadingComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  return (
    <>
      {/* Main content - always rendered, loading screen slides up to reveal it */}
      <SmoothScroll>
        <main className='bg-white min-h-screen w-full overflow-x-clip selection:bg-black selection:text-white'>
          <Navbar
            isMenuOpen={isMenuOpen}
            onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
          />
          <OverlayMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onOpenPrivacy={() => {
              setIsMenuOpen(false)
              setIsPrivacyOpen(true)
            }}
          />
          {children}
          <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />
        </main>
      </SmoothScroll>
      {/* Privacy Policy outside SmoothScroll so Lenis doesn't intercept its scroll events */}
      <PrivacyPolicy
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </>
  )
}

export default App

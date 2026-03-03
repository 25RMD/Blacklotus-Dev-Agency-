import { useEffect, useMemo, useState, lazy, Suspense } from "react"
import { useLocation } from "react-router"
import { AnimatePresence } from "framer-motion"
import { Navbar } from "../components/Navbar"
import { OverlayMenu } from "../components/OverlayMenu"
import { HeroSection } from "../components/HeroSection"
import { WhatWeDo } from "../components/WhatWeDo"
import { GetInTouch } from "../components/GetInTouch"
import { Footer } from "../components/Footer"
import { SmoothScroll } from "../components/SmoothScroll"
import { PrivacyPolicy } from "../components/PrivacyPolicy"
import { LoadingScreen } from "../components/LoadingScreen"

const HowWeDo = lazy(() => import("../components/HowWeDo").then((m) => ({ default: m.HowWeDo })))
const ProjectSlider = lazy(() =>
  import("../components/ProjectSlider").then((m) => ({ default: m.ProjectSlider }))
)
const GetStartedMarquee = lazy(() =>
  import("../components/GetStartedMarquee").then((m) => ({ default: m.GetStartedMarquee }))
)
const InsightsSlider = lazy(() =>
  import("../components/InsightsSlider").then((m) => ({ default: m.InsightsSlider }))
)

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
        <Suspense fallback={null}>
          <HowWeDo />
        </Suspense>
        <Suspense fallback={null}>
          <ProjectSlider />
        </Suspense>
        <Suspense fallback={null}>
          <GetStartedMarquee />
        </Suspense>
        <Suspense fallback={null}>
          <InsightsSlider />
        </Suspense>
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

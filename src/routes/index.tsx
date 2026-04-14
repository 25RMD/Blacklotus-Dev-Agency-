import { lazy, Suspense, useEffect, useState, startTransition } from "react"
import { useLocation } from "react-router"
import { AnimatePresence } from "framer-motion"
import type { Route } from "./+types/index"
import { Navbar } from "../components/Navbar"
import { OverlayMenu } from "../components/OverlayMenu"
import { HeroSection } from "../components/HeroSection"
import { WhatWeDo } from "../components/WhatWeDo"
import { Footer } from "../components/Footer"
import { SmoothScroll } from "../components/SmoothScroll"
import { PrivacyPolicy } from "../components/PrivacyPolicy"
import { LoadingScreen } from "../components/LoadingScreen"
import { buildMeta, seo } from "../lib/seo"

const HowWeDo = lazy(() =>
  import("../components/HowWeDo").then((module) => ({ default: module.HowWeDo }))
)
const ProjectSlider = lazy(() =>
  import("../components/ProjectSlider").then((module) => ({ default: module.ProjectSlider }))
)
const GetStartedMarquee = lazy(() =>
  import("../components/GetStartedMarquee").then((module) => ({ default: module.GetStartedMarquee }))
)
const ServicesSection = lazy(() =>
  import("../components/ServicesSection").then((module) => ({ default: module.ServicesSection }))
)
const InsightsSlider = lazy(() =>
  import("../components/InsightsSlider").then((module) => ({ default: module.InsightsSlider }))
)
const GetInTouch = lazy(() =>
  import("../components/GetInTouch").then((module) => ({ default: module.GetInTouch }))
)

function LazySection({
  children,
}: {
  children: React.ReactNode
}) {
  const [shouldRender, setShouldRender] = useState(false)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!container || shouldRender) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        startTransition(() => setShouldRender(true))
        observer.disconnect()
      },
      { rootMargin: "400px 0px" }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [container, shouldRender])

  return (
    <div ref={setContainer}>
      <Suspense fallback={null}>
        {shouldRender ? children : null}
      </Suspense>
    </div>
  )
}

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: "Software Development Agency in Nigeria | Black Lotus",
    description:
      "Black Lotus helps startups and established businesses in Nigeria build custom websites, mobile apps, and scalable software products with modern engineering and sharp product design.",
    path: "/",
    keywords: [
      "software development agency in nigeria",
      "custom software development Abuja",
      "web app development nigeria",
      "mobile app development agency nigeria",
      "product design and development nigeria",
    ],
  })

function App() {
  const location = useLocation()
  const state = location.state as { skipSplash?: boolean } | null
  const skipSplash = Boolean(state?.skipSplash)
  const [isLoading, setIsLoading] = useState(!skipSplash)

  useEffect(() => {
    if (skipSplash) setIsLoading(false)
  }, [skipSplash])

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Black Lotus Home",
            url: seo.siteUrl,
            description:
              "Nigeria-based software development agency for custom websites, mobile apps, and scalable digital products.",
            about: {
              "@type": "ProfessionalService",
              name: seo.siteName,
            },
            mainEntity: {
              "@type": "ProfessionalService",
              name: seo.siteName,
              areaServed: ["Nigeria", "Africa"],
            },
          }),
        }}
      />
      <Layout>
        <HeroSection isLoaded={!isLoading} />
        <WhatWeDo />
        <LazySection>
          <HowWeDo />
        </LazySection>
        <LazySection>
          <ProjectSlider />
        </LazySection>
        <LazySection>
          <GetStartedMarquee />
        </LazySection>
        <LazySection>
          <ServicesSection />
        </LazySection>
        <LazySection>
          <InsightsSlider />
        </LazySection>
        <LazySection>
          <GetInTouch />
        </LazySection>
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

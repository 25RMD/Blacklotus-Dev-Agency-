import { lazy, Suspense, useEffect, useState, startTransition, useRef } from "react"
import { useLocation } from "react-router"
import { AnimatePresence } from "framer-motion"
import type { Route } from "./+types/index"
import { Navbar } from "../components/Navbar"
import { OverlayMenu } from "../components/OverlayMenu"
import { HeroSection } from "../components/HeroSection"
import { WhatWeDo } from "../components/WhatWeDo"
import { Footer } from "../components/Footer"
import { PrivacyPolicy } from "../components/PrivacyPolicy"
import { LoadingScreen } from "../components/LoadingScreen"
import { buildMeta, seo } from "../lib/seo"
import { getPosts } from "@/lib/post-meta"
import { useLoaderData } from "react-router"
import { useLazyRender } from "@/lib/useLazyRender"
const HowWeDo = lazy(() =>
  import("../components/HowWeDo").then((module) => {
    const OriginalHowWeDo = module.HowWeDo;
    return {
      default: (props: OnReadyWrapperProps) => (
        <OnReadyWrapper  {...props} >
          <OriginalHowWeDo/>
        </OnReadyWrapper>
      ),
    };
  })
);
const ProjectSlider = lazy(() =>
  import("../components/ProjectSlider").then((module) => {
    const OriginalProjectSlider = module.ProjectSlider;
    return {
      default: (props: OnReadyWrapperProps) => (
        <OnReadyWrapper  {...props}>
          <OriginalProjectSlider />
        </OnReadyWrapper>
      ),
    };
  })
);

const GetStartedMarquee = lazy(() =>
  import("../components/GetStartedMarquee").then((module) => {
    const OriginalGetStartedMarquee = module.GetStartedMarquee;
    return {
      default: (props: OnReadyWrapperProps) => (
        <OnReadyWrapper {...props}>
          <OriginalGetStartedMarquee />
        </OnReadyWrapper>
      ),
    };
  })
);

const ServicesSection = lazy(() =>
  import("../components/ServicesSection").then((module) => {
    const OriginalServicesSection = module.ServicesSection;
    return {
      default: (props: OnReadyWrapperProps) => (
        <OnReadyWrapper onReady={props.onReady}>
          <OriginalServicesSection />
        </OnReadyWrapper>
      ),
    };
  })
);

const InsightsSlider = lazy(() =>
  import("../components/InsightsSlider").then((module) => {
    const OriginalInsightsSlider = module.InsightsSlider;
    return {
      default: (props: OnReadyWrapperProps & React.ComponentProps<typeof OriginalInsightsSlider>) => (
        <OnReadyWrapper onReady={props.onReady} >
          <OriginalInsightsSlider posts={props.posts}/>
        </OnReadyWrapper>
      ),
    };
  })
);

const GetInTouch = lazy(() =>
  import("../components/GetInTouch").then((module) => {
    const OriginalGetInTouch = module.GetInTouch;
    return {
      default: (props: OnReadyWrapperProps) => (
        <OnReadyWrapper {...props}>
          <OriginalGetInTouch />
        </OnReadyWrapper>
      ),
    };
  })
);
function LazySection({ children }: { children: React.ReactNode }) {
  const { isRendered, renderLazy } = useLazyRender();
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!container || isRendered) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        startTransition(() => renderLazy(true))
        observer.disconnect()
      },
      { rootMargin: "400px 0px" }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [container, isRendered])

  return (
    <div  ref={setContainer}>
      <Suspense fallback={null}>{isRendered ? children : null}</Suspense>
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

export async function loader() {
  return getPosts()
}

let hasSeenSplashThisSession = false

function App() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(!hasSeenSplashThisSession)
  const onReady=()=>{
      const id = location.hash?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        window.lenis.resize()
        window?.lenis?.scrollTo(location.hash)
      }
      console.log("called oo")
      console.log(el?.getBoundingClientRect().top)
  }
  useEffect(() => {
    if (!isLoading) {
      hasSeenSplashThisSession = true
    }
  }, [isLoading])
  // Skip splash screen when navigating via hash route, then scroll to hash
  useEffect(() => {
    if (location.hash && isLoading) {
      setIsLoading(false)
    }
  }, [location.hash, isLoading])
  const posts = useLoaderData<typeof loader>() ?? []

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
          <HowWeDo  onReady={onReady}/>
        </LazySection>
        <LazySection>
          <ProjectSlider onReady={onReady} />
        </LazySection>
        <LazySection>
          <GetStartedMarquee onReady={onReady} />
        </LazySection>
        <LazySection>
          <ServicesSection onReady={onReady} />
        </LazySection>
        <LazySection>
          <InsightsSlider posts={posts} onReady={onReady} />
        </LazySection>
        <LazySection>
          <GetInTouch onReady={onReady} />
        </LazySection>
      </Layout>
      {/* Loading screen - slides up to reveal content */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen
            key='loader'
            onLoadingComplete={() => {
              setIsLoading(false)
              sessionStorage.setItem("hasSeenSplash", "true")
            }}
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
      {/* Privacy Policy outside SmoothScroll so Lenis doesn't intercept its scroll events */}
      <PrivacyPolicy
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </>
  )
}

export default App

interface OnReadyWrapperProps{onReady?: ()=>void}

const OnReadyWrapper=({onReady, children }:{ onReady?: ()=>void, children:React.ReactNode })=>{
  const containerRef=useRef(null)
  useEffect(()=>{
    onReady?.()
  },[])
  return <div ref={containerRef}>
      {children} 
  </div>
}
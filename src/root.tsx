import { lazy, Suspense, useEffect, useState } from "react"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import type { Route } from "./+types/root"
import { buildMeta, organizationSchema } from "./lib/seo"

const AudioPlayer = lazy(() =>
  import("./components/AudioPlayer").then((module) => ({
    default: module.AudioPlayer,
  }))
)

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: "Black Lotus | Software Development Agency in Nigeria",
    description:
      "Black Lotus is a software development agency in Nigeria building high-performance websites, mobile apps, product design systems, and scalable digital products for ambitious brands.",
    path: "/",
    keywords: [
      "software agency Nigeria",
      "software development company Nigeria",
      "web design and development Abuja",
      "mobile app developers Abuja",
      "custom web applications Nigeria",
    ],
  })

export function Layout({ children }: { children: React.ReactNode }) {
  const [shouldLoadAudio, setShouldLoadAudio] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setShouldLoadAudio(true), {
        timeout: 1500,
      })

      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = window.setTimeout(() => setShouldLoadAudio(true), 1200)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
        <link rel='preload' as='image' href='/projects/blacklotus.webp' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <Meta />
        <Links />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        {children}
        {shouldLoadAudio ? (
          <Suspense fallback={null}>
            <AudioPlayer />
          </Suspense>
        ) : null}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return <Outlet />
}

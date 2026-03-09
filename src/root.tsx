import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import { AudioPlayer } from "./components/AudioPlayer"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
        <meta name='robots' content='index,follow' />
        <title>Black Lotus - Development Agency</title>
        <meta
          name='description'
          content='Black Lotus - Premium web development services. React, Next.js, Vite, Tailwind experts.'
        />
        <link rel='canonical' href='https://blacklotusdev.org/' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Black Lotus - Development Agency' />
        <meta
          property='og:description'
          content='Premium web and software development agency specializing in performant, scalable products.'
        />
        <meta property='og:url' content='https://blacklotusdev.org/' />
        <meta property='og:image' content='https://blacklotusdev.org/projects/blacklotus.jpg' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Black Lotus - Development Agency' />
        <meta
          name='twitter:description'
          content='Premium web and software development agency specializing in performant, scalable products.'
        />
        <meta name='twitter:image' content='https://blacklotusdev.org/projects/blacklotus.jpg' />
        <meta name='theme-color' content='#000000' />
        <link rel='preload' as='image' href='/projects/blacklotus.webp' />
        {/* Preload Switzer font files */}
        <link
          rel='preload'
          href='https://cdn.prod.website-files.com/678fc13a6195245eefbb1f34/67abb977efde095c9ce551dd_Switzer-Regular.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='https://cdn.prod.website-files.com/678fc13a6195245eefbb1f34/67abbacd113fcc08efe66918_Switzer-Light.woff'
          as='font'
          type='font/woff'
          crossOrigin='anonymous'
        />
        {/* Google Fonts: fallback Inter */}
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
      </head>
      <body>
        {children}
        <AudioPlayer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return <Outlet />
}

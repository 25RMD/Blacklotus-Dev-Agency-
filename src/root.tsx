import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Black Lotus - Development Agency</title>
        <meta
          name='description'
          content='Black Lotus - Premium web development services. React, Next.js, Vite, Tailwind experts.'
        />
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return <Outlet />
}

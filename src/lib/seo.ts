const siteUrl = "https://blacklotusdev.org"
const siteName = "Black Lotus Development Agency"
const defaultOgImage = `${siteUrl}/projects/blacklotus.jpg`

type BuildMetaInput = {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  type?: "website" | "article"
}

export const toAbsoluteUrl = (path = "/") => {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return new URL(path, siteUrl).toString()
}

export const seo = {
  siteUrl,
  siteName,
  defaultOgImage,
  defaultKeywords: [
    "software development agency Nigeria",
    "web development company Abuja",
    "custom software development Nigeria",
    "mobile app development Nigeria",
    "React developers Nigeria",
    "startup product development Africa",
    "UI UX design agency Nigeria",
    "cloud and DevOps Nigeria",
  ],
}

export const buildMeta = ({
  title,
  description,
  path = "/",
  image = defaultOgImage,
  keywords = [],
  type = "website",
}: BuildMetaInput) => {
  const canonical = toAbsoluteUrl(path)
  const ogImage = toAbsoluteUrl(image)

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: [...seo.defaultKeywords, ...keywords].join(", ") },
    { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
    { name: "author", content: seo.siteName },
    { name: "theme-color", content: "#000000" },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:locale", content: "en_NG" },
    { property: "og:site_name", content: seo.siteName },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: ogImage },
    { property: "og:image:secure_url", content: ogImage },
    { property: "og:image:alt", content: `${seo.siteName} preview` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ]
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: seo.siteName,
  url: seo.siteUrl,
  image: seo.defaultOgImage,
  logo: `${seo.siteUrl}/logo.png`,
  description:
    "Black Lotus is a Nigeria-based software development agency building custom web platforms, mobile apps, product design systems, and scalable cloud-backed software.",
  email: "blacklotusenquiry@gmail.com",
  areaServed: ["Nigeria", "Africa", "Worldwide"],
  address: {
    "@type": "PostalAddress",
    addressCountry: "NG",
    addressRegion: "Abuja",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "blacklotusenquiry@gmail.com",
    areaServed: ["NG", "GH", "KE", "ZA", "GB", "US"],
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://www.instagram.com/blacklotusdev",
    "https://www.facebook.com/share/1BooF4RPbd/?mibextid=wwXIfr",
  ],
  knowsAbout: [
    "Custom software development",
    "Web development",
    "Mobile app development",
    "UI/UX design",
    "Cloud infrastructure",
    "DevOps",
  ],
}

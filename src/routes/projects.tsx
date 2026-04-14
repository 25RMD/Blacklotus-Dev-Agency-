import type { Route } from "./+types/projects"
import { ProjectsGallery } from "../components/ProjectsGallery"
import { buildMeta, seo } from "../lib/seo"

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: "Software Development Projects | Black Lotus Nigeria",
    description:
      "Browse Black Lotus case studies across web development, mobile apps, product design, DevOps, and custom software delivery for businesses in Nigeria and beyond.",
    path: "/projects",
    keywords: [
      "software development portfolio nigeria",
      "web development case studies Abuja",
      "mobile app projects nigeria",
      "agency portfolio africa",
    ],
  })

export default function Projects() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Black Lotus Projects",
            url: `${seo.siteUrl}/projects`,
            description:
              "Portfolio of websites, mobile apps, and digital products built by Black Lotus.",
          }),
        }}
      />
      <ProjectsGallery />
    </>
  )
}

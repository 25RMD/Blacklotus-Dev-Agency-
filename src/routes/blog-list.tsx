import fs from "node:fs"
import matter from "gray-matter"
import type { ReactNode } from "react"
import { Link, useLoaderData } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import type { Route } from "./+types/blog-list"
import { Layout } from "./index"
import { useLocation } from "react-router"
import { buildMeta, seo } from "../lib/seo"

type PostSummary = {
  slug: string
  title: string
  date: string
  category: string
  image: string
  excerpt: string
}

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: "Engineering Blog | Black Lotus Nigeria",
    description:
      "Technical insights, engineering notes, and software delivery lessons from the Black Lotus team in Nigeria.",
    path: "/blog",
    keywords: [
      "software engineering blog nigeria",
      "web development blog Abuja",
      "devops articles nigeria",
      "black lotus engineering blog",
    ],
  })

export async function loader() {
  const folder = "./src/content/posts"
  const files = fs.readdirSync(folder)

  const posts: PostSummary[] = files.map((fileName: string) => {
    const fileContent = fs.readFileSync(`${folder}/${fileName}`, "utf-8")
    const { data } = matter(fileContent)
    return {
      slug: fileName.replace(".md", ""),
      title: data.title,
      date: data.date,
      category: data.category || "Engineering",
      image: data.image || "/placeholder.jpg",
      excerpt: data.excerpt || "Read more about this project...",
    }
  })

  // Sort by date (newest first)
  return posts.sort(
    (a: PostSummary, b: PostSummary) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export default function BlogList() {
  const posts = useLoaderData<typeof loader>() ?? []

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Black Lotus Engineering Blog",
            url: `${seo.siteUrl}/blog`,
            description:
              "Technical articles and software engineering notes from the Black Lotus team.",
          }),
        }}
      />
      <BlogLayout>
        <div className='max-w-7xl mx-auto px-6 py-12 font-sans'>
          <h1 className='text-[clamp(2.8rem,8vw,6.5rem)] font-display font-semibold mb-4 mt-8 tracking-[-0.03em] leading-[0.92]'>
            Engineering Blog
          </h1>
          <hr className='border-gray-200 mb-16' />
          <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'>
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className='group'>
                <div className='overflow-hidden mb-6'>
                  <img
                    src={post.image}
                    className='w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500'
                    alt={post.title}
                  />
                </div>
                <span className='text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500'>
                  {post.category}
                </span>
                <h3 className='text-2xl font-display font-semibold mt-3 tracking-[-0.02em] leading-tight group-hover:underline underline-offset-2'>
                  {post.title}
                </h3>
                <p className='mt-4 text-[11px] uppercase tracking-[0.16em] text-gray-400'>
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </section>
        </div>
      </BlogLayout>
    </>
  )
}

export const BlogLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation()

  return (
    <>
      <AnimatePresence mode='wait'>
        {/* The 'key' is vital; it tells Framer this is a 'new' component */}
        <motion.div
          key={location.pathname}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Layout>{children}</Layout>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

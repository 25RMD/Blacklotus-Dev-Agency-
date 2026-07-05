import type { ReactNode } from "react"
import { Link, useLoaderData } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import type { Route } from "./+types/blog-list"
import { Layout } from "./index"
import { useLocation } from "react-router"
import { buildMeta, seo } from "../lib/seo"
import { getPosts, type PostMeta, type PostCategory } from "@/lib/post-meta"
export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: "Blog | Black Lotus Nigeria",
    description:
      "Articles, tutorials, Insights on software & product development, fitness technology, and digital innovation from the Black Lotus team in Nigeria.",
    path: "/blog",
    keywords: [
      "software engineering blog Nigeria",
      "engineering articles",
      "fitness technology",
      "health tech blog",
      "web development Nigeria",
      "software development",
      "technology insights",
      "web development blog Abuja",
      "devops articles nigeria",
      "black lotus engineering blog",
    ],
  })

export async function loader() {
  return getPosts()
}

export default function BlogList() {
  const posts = useLoaderData<typeof loader>() ?? []
  const groupedPosts = posts.reduce<Partial<Record<PostCategory, PostMeta[]>>>(
    (acc, curr) => {
      ;(acc[curr.category] ??= []).push(curr)
      return acc
    },
    {}
  )
  const sections = Object.entries(groupedPosts).map(([category, posts]) => ({
    category: category as PostCategory,
    posts: posts!,
  }))
  sections.sort((a, b) => {
    // Engineering is always last
    if (a.category === "Engineering") return 1
    if (b.category === "Engineering") return -1

    const newestA = new Date(a.posts[0].date).getTime()
    const newestB = new Date(b.posts[0].date).getTime()

    return newestB - newestA
  })
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
          {sections.map((section) => (
            <BlogListSection
              key={section.category}
              category={section.category}
              posts={section.posts}
            />
          ))}
        </div>
      </BlogLayout>
    </>
  )
}
const BlogListSection = ({
  category,
  posts,
}: {
  category: PostCategory
  posts: PostMeta[]
}) => {
  return (
    <>
      <h1 className='text-2xl md:text-3xl font-display   pr-[10%] text-right w-full mb-2 mt-8 '>
        {category}
      </h1>
      <hr className='border-gray-200 mb-6' />
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-16'>
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

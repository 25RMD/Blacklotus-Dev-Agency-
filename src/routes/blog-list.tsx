import fs from "node:fs"
import matter from "gray-matter"
import { Link, useLoaderData } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { Layout } from "./index"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
export async function loader() {
  const folder = "./src/content/posts"
  const files = fs.readdirSync(folder)

  const posts = files.map((fileName: string) => {
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
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export default function BlogList() {
  const posts = useLoaderData<typeof loader>()

  return (
    <BlogLayout>
      <div className='max-w-7xl mx-auto px-6 py-12 font-sans'>
        <h1 className='text-5xl font-bold mb-4 mt-8 tracking-tighter'>
          Engineering Blog
        </h1>
        <hr className='border-gray-200 mb-16' />
        {/* 2. THE GRID (3-columns) */}
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
              <span className='text-xs font-light capitalize tracking-widest text-gray-500'>
                {post.category}
              </span>
              <h3 className='text-xl font-bold mt-3 group-hover:underline underline-offset-2'>
                {post.title}
              </h3>
              <p className='mt-4 text-sm text-gray-400'>
                {new Date(post.date).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </BlogLayout>
  )
}

export const BlogLayout = ({ children }) => {
  const location = useLocation()
  const [isFirstMount, setIsFirstMount] = useState(true)
  useEffect(() => {
    setIsFirstMount(false)
  }, [])
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

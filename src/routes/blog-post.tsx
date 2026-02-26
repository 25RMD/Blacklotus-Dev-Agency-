import type { Route } from "./+types/blog-post.ts"
import fs from "node:fs"
import matter from "gray-matter"
import ReactMarkdown from "react-markdown"
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism"
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Twitter, Linkedin, Link as LinkIcon, User } from "lucide-react"
import { BlogLayout } from "./blog-list"
import { useLocation } from "react-router"
import { useEffect, useState } from "react"

export async function loader({ params }: Route.LoaderArgs) {
  // Read the Obsidian file based on the URL slug
  const file = fs.readFileSync(`./src/content/posts/${params.slug}.md`, "utf-8")
  const { data, content } = matter(file)
  return { metadata: data, content }
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { metadata, content } = loaderData
  const [blogUrl, setBlogUrl] = useState<String>()
  useEffect(() => {
    setBlogUrl(window?.location.toString())
  }, [])
  const location = useLocation()
  return (
    <BlogLayout>
      <div className='grid grid-cols-1 relative'>
        <div className='mx-auto'>
          <article className='px-2 prose prose-lg max-w-screen prose-pre:bg-background lg:max-w-3xl lg:px-6 py-20 prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-[-0.03em] prose-headings:leading-tight prose-p:text-zinc-700 prose-p:leading-relaxed prose-img:rounded-xl prose-a:text-blue-600 dark:prose-invert'>
            <span className='text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500'>
              {metadata.category}
            </span>

            <h1>{metadata.title}</h1>
            <div className='flex items-center gap-4 text-[11px] uppercase tracking-[0.16em] text-zinc-400'>
              <p>
                {new Date(metadata.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <span>•</span>
              <p>5 min read</p>
            </div>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vs}
                      language={match[1]}
                      PreTag='div'
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
          {/* AUTHOR SECTION (At the bottom of the article) */}
          <div className=' px-2 mt-10 mb-30 pt-10 border-t border-zinc-200 flex items-center gap-2 md:gap-6'>
            <div className='min-w-15 w-20 h-20  bg-zinc-100 rounded-full flex items-center justify-center overflow-hidden'>
              {metadata.authorImage ? (
                <img
                  src={metadata.authorImage}
                  alt={metadata.author}
                  className='w-full'
                />
              ) : (
                <User className='w-10 h-10 text-zinc-300' />
              )}
            </div>
            <div>
              <h4 className='text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500'>
                Written by
              </h4>
              <h3 className='text-2xl font-display font-semibold tracking-[-0.02em] text-black mt-1'>
                {metadata.author || "Black Lotus Team"}
              </h3>
              <p className='text-[15px] leading-relaxed text-zinc-600 mt-2 max-w-md'>
                {metadata.authorBio ||
                  "Engineering at Black Lotus. Building high-performance digital experiences across Africa."}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: STICKY SHARING SIDEBAR */}
        <aside className='hidden lg:block lg:col-span-1 lg:col-start-11'>
          <div className='sticky top-32 flex flex-col gap-8 items-center py-4'>
            <span className='text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 '>
              Share
            </span>
            <a
              href={`https://twitter.com/share?text=${metadata.title}&url=${blogUrl}`}
            >
              <button className='text-zinc-400 hover:text-black transition-colors'>
                <Twitter className='w-5 h-5' />
              </button>
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle/?mini=true&url=${blogUrl}`}
            >
              <button className='text-zinc-400 hover:text-black transition-colors'>
                <Linkedin className='w-5 h-5' />
              </button>
            </a>
            <a
              href={`${blogUrl}`}
              onClick={(e) => {
                e.preventDefault()
                navigator.clipboard.writeText(e.currentTarget.href).then(
                  function () {
                    console.log("Copied!")
                  },
                  function () {
                    console.log("Copy error")
                  }
                )
              }}
            >
              <button className='text-zinc-400 hover:text-black transition-colors'>
                <LinkIcon className='w-5 h-5' />
              </button>
            </a>
          </div>
        </aside>
      </div>
    </BlogLayout>
  )
}

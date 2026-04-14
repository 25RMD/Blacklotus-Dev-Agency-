import type { Route } from "./+types/blog-post.ts"
import fs from "node:fs"
import matter from "gray-matter"
import ReactMarkdown from "react-markdown"
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism"
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Twitter, Linkedin, Link as LinkIcon, User } from "lucide-react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { useEffect, useState } from "react"
import remarkGithubAlerts from "remark-gh-alerts"
import { BlogLayout } from "./blog-list"
import { buildMeta, seo, toAbsoluteUrl } from "../lib/seo"
import "./blog-post.css"

type MarkdownCodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean
  children?: ReactNode
}

const createExcerpt = (content: string) =>
  content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160)

export async function loader({ params }: Route.LoaderArgs) {
  const file = fs.readFileSync(`./src/content/posts/${params.slug}.md`, "utf-8")
  const { data, content } = matter(file)

  return {
    metadata: data,
    content,
    slug: params.slug,
    excerpt: data.excerpt || createExcerpt(content),
  }
}

export const meta: Route.MetaFunction = ({ data, params }) => {
  if (!data) {
    return buildMeta({
      title: "Article Not Found | Black Lotus",
      description: "The requested Black Lotus article could not be found.",
      path: `/blog/${params.slug ?? ""}`,
    })
  }

  return buildMeta({
    title: `${data.metadata.title} | Black Lotus Engineering Blog`,
    description: data.excerpt,
    path: `/blog/${data.slug}`,
    image: data.metadata.image || seo.defaultOgImage,
    type: "article",
    keywords: [
      data.metadata.title,
      "engineering blog nigeria",
      "software development article africa",
      "black lotus blog",
    ],
  })
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { metadata, content, slug, excerpt } = loaderData
  const [blogUrl, setBlogUrl] = useState<string>()

  useEffect(() => {
    setBlogUrl(window.location.toString())
  }, [])

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: metadata.title,
            description: excerpt,
            image: toAbsoluteUrl(metadata.image || seo.defaultOgImage),
            datePublished: new Date(metadata.date).toISOString(),
            author: {
              "@type": "Person",
              name: metadata.author || "Black Lotus Team",
            },
            publisher: {
              "@type": "Organization",
              name: seo.siteName,
              logo: {
                "@type": "ImageObject",
                url: `${seo.siteUrl}/logo.png`,
              },
            },
            mainEntityOfPage: `${seo.siteUrl}/blog/${slug}`,
          }),
        }}
      />
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
                remarkPlugins={[remarkGithubAlerts]}
                components={{
                  code({ inline, className, children, ...props }: MarkdownCodeProps) {
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
            <div className='px-2 mt-10 mb-30 pt-10 border-t border-zinc-200 flex items-center gap-2 md:gap-6'>
              <div className='min-w-15 w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center overflow-hidden'>
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

          <aside className='hidden lg:block lg:col-span-1 lg:col-start-11'>
            <div className='sticky top-32 flex flex-col gap-8 items-center py-4'>
              <span className='text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 '>
                Share
              </span>
              <a href={`https://twitter.com/share?text=${metadata.title}&url=${blogUrl}`}>
                <button className='text-zinc-400 hover:text-black transition-colors'>
                  <Twitter className='w-5 h-5' />
                </button>
              </a>
              <a href={`https://www.linkedin.com/shareArticle/?mini=true&url=${blogUrl}`}>
                <button className='text-zinc-400 hover:text-black transition-colors'>
                  <Linkedin className='w-5 h-5' />
                </button>
              </a>
              <a
                href={blogUrl}
                onClick={(event) => {
                  event.preventDefault()
                  if (!event.currentTarget.href) return

                  navigator.clipboard.writeText(event.currentTarget.href).then(
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
    </>
  )
}

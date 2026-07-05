import fs from "node:fs"
import matter from "gray-matter"

export type PostCategory = "Fitness Tech" | "Engineering"

export type PostMeta = {
  slug: string
  title: string
  date: string
  category: PostCategory
  image: string
  excerpt: string
}

export async function getPosts() {
  const folder = "./src/content/posts"
  const files = fs.readdirSync(folder)

  const posts: PostMeta[] = files.map((fileName: string) => {
    const fileContent = fs.readFileSync(`${folder}/${fileName}`, "utf-8")
    const { data } = matter(fileContent)
    return {
      slug: fileName.replace(".md", ""),
      title: data.title,
      date: data.date,
      category: data.category || "Engineering",
      image: data.image || "/placeholder.jpg",
    }
  })

  // Sort by date (newest first)
  return posts.sort(
    (a: PostMeta, b: PostMeta) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

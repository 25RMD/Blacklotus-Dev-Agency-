import type { Config } from "@react-router/dev/config"
import fs from "node:fs"
import { projects } from "./src/lib/projects"

export default {
  ssr: false,
  appDirectory: "src",
  buildDirectory: "dist",
  async prerender() {
    // Get all  Obsidian file names
    const posts = fs
      .readdirSync("./src/content/posts")
      .filter((file) => file.endsWith(".md"))
    // Tell React Router to generate a static HTML page for each post
    return [
      "/",
      "/projects",
      "/blog",
      ...posts.map((p) => `/blog/${p.replace(".md", "")}`),
      ...projects.map((p) => `/projects/${p.id}`)
    ]
  },
} satisfies Config

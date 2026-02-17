// react-router.config.ts
import type { Config } from "@react-router/dev/config"
import fs from "node:fs"

export default {
  // Use 'ssr: false' if you want a purely static site (SPA + Pre-rendering)
  ssr: false,
  appDirectory: "src",
  buildDirectory: "dist",
  async prerender() {
    // 1. Get all your Obsidian file names from your content folder
    const posts = fs
      .readdirSync("./src/content/posts")
      .filter((file) => file.endsWith(".md"))
    // 2. Tell React Router to generate a static HTML page for each post
    return ["/", "/blog", ...posts.map((p) => `/blog/${p.replace(".md", "")}`)]
  },
} satisfies Config

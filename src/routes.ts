import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),
  route("projects", "routes/projects.tsx"),
  route("projects/:id", "routes/projects.$id.tsx"),
  route("blog", "routes/blog-list.tsx"),
  route("blog/:slug", "routes/blog-post.tsx"),
] satisfies RouteConfig

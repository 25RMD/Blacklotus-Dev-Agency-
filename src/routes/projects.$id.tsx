import { useParams, Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { projects } from "../lib/projects"
import { Layout } from "./index" // Optional if you want to wrap in main Layout

export default function ProjectDetail() {
    const { id } = useParams()
    const project = projects.find((p) => p.id === id)

    if (!project) {
        return (
            <Layout>
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                    <h1 className="text-4xl font-display font-semibold tracking-[-0.02em] mb-4">Project Not Found</h1>
                    <Link
                        to="/projects"
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        ← Back to Projects
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="bg-black min-h-screen text-white pt-32 pb-24 selection:bg-white selection:text-black">
                <div className="max-w-7xl mx-auto px-6 md:px-16">
                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <Link
                            to="/projects"
                            className="inline-flex items-center text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400 hover:text-white transition-colors gap-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Projects
                        </Link>
                    </motion.div>

                    {/* Header */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 md:mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="lg:col-span-7"
                        >
                            <h1 className="text-[clamp(2.8rem,7.8vw,7.8rem)] font-display font-semibold tracking-[-0.03em] leading-[0.92] mb-6">
                                {project.title}
                            </h1>
                            <p className="text-base md:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">
                                {project.description}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end pb-2"
                        >
                            <div className="grid grid-cols-2 gap-8 lg:gap-y-12 mb-8 lg:mb-12 border-t border-zinc-800 pt-8 lg:pt-12">
                                <div>
                                    <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 mb-2">
                                        Client
                                    </h3>
                                    <p className="text-sm font-semibold tracking-[-0.01em]">{project.client}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 mb-2">
                                        Year
                                    </h3>
                                    <p className="text-sm font-semibold tracking-[-0.01em]">{project.year}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 mb-2">
                                        Role
                                    </h3>
                                    <p className="text-sm font-semibold tracking-[-0.01em]">{project.role}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 mb-2">
                                        Services
                                    </h3>
                                    <p className="text-sm font-semibold tracking-[-0.01em]">{project.tags.join(", ")}</p>
                                </div>
                            </div>

                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-3 bg-white text-black px-6 py-4 rounded-none border border-white text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-zinc-200 transition-colors"
                            >
                                Launch Site
                                <ExternalLink size={18} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </motion.div>
                    </div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full aspect-video md:aspect-[21/9] bg-zinc-900 rounded-sm overflow-hidden mb-24 relative"
                    >
                        <div className="absolute inset-0 bg-zinc-800 animate-pulse" /> {/* Placeholder while loading */}
                        <img
                            src={project.img}
                            alt={project.title}
                            className="w-full h-full object-cover relative z-10"
                        />
                    </motion.div>

                </div>
            </div>
        </Layout>
    )
}

import { useParams, Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { projects } from "../lib/projects"
import { Layout } from "./index"

export default function ProjectDetail() {
    const { id } = useParams()
    const project = projects.find((p) => p.id === id)

    if (!project) {
        return (
            <Layout>
                <div className="min-h-screen bg-[#f4f4f2] text-black flex flex-col items-center justify-center p-6">
                    <h1 className="text-4xl font-display font-semibold tracking-[-0.02em] mb-4">Project Not Found</h1>
                    <Link
                        to="/projects"
                        className="text-zinc-500 hover:text-black transition-colors"
                    >
                        ← Back to Projects
                    </Link>
                </div>
            </Layout>
        )
    }

    const bgColor = project.brandColor || "#4285F4" // Fallback to a google blue
    const textColor = project.textColor || "#ffffff"

    return (
        <Layout>
            <div className="min-h-screen w-full bg-[#f4f4f2] selection:bg-black selection:text-white pb-24 md:pb-32">

                {/* massive color header section */}
                <section
                    className="w-full pt-16 pb-12 md:pt-24 md:pb-16 px-6 md:px-12 relative flex flex-col"
                    style={{ backgroundColor: bgColor, color: textColor }}
                >
                    {/* Top small nav */}
                    <div className="flex items-center gap-4 mb-16 md:mb-24 relative z-10 w-full max-w-[100rem] mx-auto">
                        <Link
                            to="/projects"
                            className="inline-flex items-center text-[10px] md:text-[11px] font-medium uppercase tracking-[0.16em] opacity-70 hover:opacity-100 transition-opacity gap-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Projects
                        </Link>
                        {/* decorative pill like in mockup */}
                        <div className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.16em] font-medium opacity-60">
                            <span className="px-3 py-1.5 border border-current rounded-full">Case Study</span>
                            <span className="px-3 py-1.5 border border-current rounded-full">{project.year}</span>
                        </div>
                    </div>

                    {/* Giant Title */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-[100rem] mx-auto pb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display font-extrabold uppercase tracking-[-0.04em] leading-[0.85] text-[clamp(3.2rem,11vw,13rem)] max-w-[92%] wrap-anywhere"
                        >
                            {project.title}
                        </motion.h1>
                    </div>
                </section>

                {/* Main Content Area */}
                <div className="w-full max-w-[100rem] mx-auto px-6 md:px-12 mt-12 md:mt-16">

                    {/* Giant Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="w-full aspect-[16/10] md:aspect-[21/9] bg-zinc-200 overflow-hidden mb-16 md:mb-24 shadow-2xl"
                    >
                        <img
                            src={project.img}
                            alt={project.title}
                            className="w-full h-full object-cover object-center"
                        />
                    </motion.div>

                    {/* 2-Column Info Section */}
                    <div
                        className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 relative"
                    >
                        {/* Left Col: About */}
                        <div className="lg:col-span-8 flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bgColor }}></span>
                                <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">About</h2>
                            </div>

                            <h3 className="text-[clamp(2.2rem,4vw,3.5rem)] font-display font-medium text-[#111] leading-[1.1] tracking-[-0.02em] mb-8">
                                {project.description}
                            </h3>

                            <div className="mt-8">
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center justify-center gap-3 text-white px-8 py-4 rounded-none border border-transparent text-[11px] font-semibold uppercase tracking-[0.16em] transition-all hover:scale-105"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    Launch Site
                                    <ExternalLink size={18} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                            </div>
                        </div>

                        {/* Right Col: Features/Details */}
                        <div className="lg:col-span-4 lg:col-start-9 flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bgColor }}></span>
                                <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Features</h2>
                            </div>

                            <div className="flex flex-col border-t border-zinc-200">
                                {/* Detail rows mapping to the mockup's line-separated items */}
                                <div className="flex flex-col py-6 border-b border-zinc-200">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500 mb-1">Client</span>
                                    <span className="text-base text-[#111] font-medium">{project.client}</span>
                                </div>
                                <div className="flex flex-col py-6 border-b border-zinc-200">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500 mb-1">Services</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="px-3 py-1.5 border border-zinc-300 rounded-full text-[10px] uppercase tracking-[0.1em] font-medium text-zinc-600 bg-white shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    )
}

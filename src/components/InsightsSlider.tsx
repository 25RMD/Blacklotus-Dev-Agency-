import { Link } from 'react-router'
import { ArrowDownRight } from 'lucide-react'

type BlogInsight = {
    slug: string
    title: string
    date: string
    category: string
    image: string
    excerpt: string
}

const RAW_POSTS = import.meta.glob('../content/posts/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
}) as Record<string, string>

function parseFrontmatter(markdown: string): Record<string, string> {
    const match = markdown.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return {}
    return match[1].split('\n').reduce<Record<string, string>>((acc, line) => {
        const separator = line.indexOf(':')
        if (separator === -1) return acc
        const key = line.slice(0, separator).trim()
        const value = line.slice(separator + 1).trim()
        acc[key] = value
        return acc
    }, {})
}

const INSIGHTS_DATA: BlogInsight[] = Object.entries(RAW_POSTS)
    .map(([path, markdown]) => {
        const frontmatter = parseFrontmatter(markdown)
        const fileName = path.split('/').pop() ?? ''
        const slug = fileName.replace('.md', '')

        return {
            slug,
            title: frontmatter.title || slug.replace(/-/g, ' '),
            date: frontmatter.date || '',
            category: frontmatter.category || 'Engineering',
            image: frontmatter.image || '/placeholder.jpg',
            excerpt: frontmatter.excerpt || 'Read more from our engineering blog.',
        }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function InsightsSlider() {
    return (
        <section className="w-full bg-[#f7f7f5] py-24 md:py-32 overflow-hidden">
            <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16 mb-12 flex items-baseline justify-between gap-6">
                <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-display text-[#222] font-semibold tracking-[-0.02em] leading-none">
                    Related Insights
                </h2>
                <Link
                    to="/blog"
                    viewTransition
                    className="group flex shrink-0 items-center justify-end gap-1.5 text-sm font-medium text-[#444] hover:text-black transition-colors"
                >
                    View all
                    <ArrowDownRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </Link>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-12">
                <div className="flex px-6 md:px-12 lg:px-16 gap-6 w-max">
                    {INSIGHTS_DATA.map((item) => (
                        <Link
                            key={item.slug}
                            to={`/blog/${item.slug}`}
                            viewTransition
                            className="w-[280px] md:w-[360px] lg:w-[420px] shrink-0 snap-start flex flex-col gap-5 cursor-pointer group"
                        >
                            <div
                                className="w-full aspect-4/3 rounded-2xl overflow-hidden relative shadow-sm transition-transform duration-500 group-hover:scale-[1.02] bg-zinc-200"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col gap-4 px-1">
                                <h3 className="font-display text-[22px] md:text-[26px] leading-[1.2] text-[#222] font-medium tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-[#555] line-clamp-2">
                                    {item.excerpt}
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#e8e8e6] text-[#444] text-[11px] font-medium uppercase tracking-[0.05em] px-3 pt-[5px] pb-[3px] rounded-full">
                                        {item.category}
                                    </span>
                                    <span className="text-xs font-medium text-[#666]">
                                        {item.date}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {/* Spacer to allow the last item to hit the very left edge on desktop/mobile if needed */}
                    <div className="w-px md:w-[10vw]"></div>
                </div>
            </div>
        </section>
    )
}

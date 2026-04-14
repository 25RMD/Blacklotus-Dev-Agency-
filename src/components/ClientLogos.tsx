import { motion } from 'framer-motion'

const clients = [
  { name: 'Vercel', logo: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png' },
  { name: 'Linear', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Linear_logo.svg' },
  { name: 'Raycast', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Raycast_logo_icon.svg/1024px-Raycast_logo_icon.svg.png' },
  { name: 'Supabase', logo: 'https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png' },
  { name: 'Prisma', logo: 'https://cdn.worldvectorlogo.com/logos/prisma-2.svg' },
  { name: 'Tailwind', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg' },
]

export function ClientLogos() {
  return (
    <section className="w-full py-12 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
        <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Trusted by engineering teams at</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {clients.map((client) => (
            <motion.div
              key={client.name}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="h-8 md:h-10 w-auto flex items-center justify-center"
            >
              {/* Using text as placeholder if images fail, but ideally these are SVGs */}
              <span className="text-xl font-bold text-white/80">{client.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

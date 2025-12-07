import { useRef } from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: "Working with this team of brilliant, problem solving, passionate, agile Ninjas is such a joy. Their creative ambition & desire to help bring even the most eye watering & challenging projects to life is second to none.",
    author: "Chioma Okeke",
    company: "Adam&EveDDB",
    bgColor: "#e855a0",
    textColor: "#4a1942"
  },
  {
    quote: "Not content with executing whatever you ask of them to the highest standard, they consistently improve and develop concepts, taking them in exciting new directions I could have never foreseen.",
    author: "Tunde Bakare",
    company: "Edelman",
    bgColor: "#c8f5e8",
    textColor: "#1a534a"
  },
  {
    quote: "I've worked with Creative Giants for many years, and they never fail to deliver... they jump head feet into all challenges and over-deliver every time. What I especially like about them is that they often enhance the creative, as well as being solutions orientated...",
    author: "Aisha Mohammed",
    company: "Edelman",
    bgColor: "#1a2744",
    textColor: "#6b9ec4"
  },
  {
    quote: "They built our website in 3 weeks and it looks amazing. Our sales have increased 40% since launch. Highly recommend their services.",
    author: "Emeka Nnamdi",
    company: "TechStart",
    bgColor: "#e855a0",
    textColor: "#4a1942"
  },
]

export function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scrollTo = (direction: 'prev' | 'next') => {
    if (!sliderRef.current) return
    const cardWidth = sliderRef.current.offsetWidth * 0.5
    const newScrollLeft = direction === 'next'
      ? sliderRef.current.scrollLeft + cardWidth
      : sliderRef.current.scrollLeft - cardWidth

    sliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  return (
    <section id="testimonials" className="w-full bg-white min-h-screen py-8 flex flex-col overflow-hidden">
      {/* Header with consistent padding */}
      <div className="flex justify-between items-center px-6 md:px-12 lg:px-16 mb-6 relative z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-black">
          Testimonials
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => scrollTo('prev')}
            className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => scrollTo('next')}
            className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Slider wrapper - provides left margin */}
      <div className="pl-6 md:pl-12 lg:pl-16 flex-1 flex flex-col">
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-8 pr-6 md:pr-12 lg:pr-16"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-[85vw] md:w-[50vw] lg:w-[40vw] h-[75vh] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden"
              style={{
                backgroundColor: t.bgColor,
                scrollSnapAlign: 'start'
              }}
            >
              {/* Quotation mark */}
              <div
                className="absolute top-8 right-8 text-6xl md:text-8xl font-serif opacity-40"
                style={{ color: t.textColor }}
              >
                "
              </div>

              {/* Quote */}
              <p
                className="text-xl md:text-2xl lg:text-3xl font-serif italic leading-snug max-w-md mt-8"
                style={{ color: t.textColor }}
              >
                {t.quote}
              </p>

              {/* Author */}
              <div className="mt-auto pt-8">
                <p className="text-sm font-medium" style={{ color: t.textColor }}>
                  {t.author}
                </p>
                <p className="text-sm opacity-70" style={{ color: t.textColor }}>
                  {t.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

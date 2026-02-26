import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: "How much does a website cost?",
    answer: "Every project is different. Simple landing pages start around $2,000, while larger web apps can be $10,000+. We'll give you a clear quote after our first call."
  },
  {
    question: "How long does it take?",
    answer: "Most websites take 2-4 weeks. Larger projects with custom features may take 6-8 weeks. We'll give you a timeline upfront."
  },
  {
    question: "Do you offer support after launch?",
    answer: "Yes! We offer monthly maintenance plans to keep your site updated, secure, and running smoothly."
  },
  {
    question: "How do I get started?",
    answer: "Just click 'Start Project' and fill out the form. We'll get back to you within 24 hours to schedule a free consultation."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="w-full py-24 px-6 bg-black/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight mb-12 text-center text-white">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-white/10 rounded-xl bg-black overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-lg font-semibold tracking-tight text-zinc-200">{faq.question}</span>
              {openIndex === i ? (
                <Minus className="w-5 h-5 text-zinc-400" />
              ) : (
                <Plus className="w-5 h-5 text-zinc-400" />
              )}
            </button>
            
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-6 pt-0 text-base text-zinc-400 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}

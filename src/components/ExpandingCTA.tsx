import { useState, useEffect, useRef } from 'react'
import { X, ChevronDown, ArrowRight, Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const TARGET_EMAIL = 'blacklotusenquiry@gmail.com'

const budgetOptions = [
  { value: '<5k', label: '< $5k' },
  { value: '5k-15k', label: '$5k – $15k' },
  { value: '15k-50k', label: '$15k – $50k' },
  { value: '>50k', label: '$50k+' },
]

const timelineOptions = [
  { value: 'ASAP', label: 'ASAP' },
  { value: '1-3 months', label: '1–3 months' },
  { value: '3-6 months', label: '3–6 months' },
  { value: 'Flexible', label: 'Flexible' },
]

function CustomSelect({ 
  options, 
  value, 
  onChange, 
  label 
}: { 
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  label: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative group" ref={dropdownRef}>
      <label className="block text-xs text-zinc-500 mb-2 font-medium font-mono uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-left flex items-center justify-between transition-all duration-300
          ${isOpen ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border-white/10 hover:border-white/20'}
        `}
      >
        <span className="text-zinc-100 font-medium">{selectedOption?.label || options[0].label}</span>
        <ChevronDown 
          className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/5"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 flex items-center justify-between group/item
                  ${value === option.value ? 'bg-cyan-500/10 text-cyan-400' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'}
                `}
              >
                {option.label}
                {value === option.value && (
                  <motion.div layoutId="check" className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ExpandingCTA() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [budget, setBudget] = useState('<5k')
  const [timeline, setTimeline] = useState('ASAP')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleExpand = () => setIsExpanded(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const subject = `New Project Inquiry from ${formData.get('name')}`
    const body = `
Name: ${formData.get('name')}
Email: ${formData.get('email')}
Budget: ${budget}
Timeline: ${timeline}
Details: ${formData.get('details')}
    `
    
    window.location.href = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    setIsSubmitting(false)
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setIsExpanded(false)
    }, 3000)
  }

  return (
    <>
      {/* Main CTA Button */}
      <div className="relative z-10 flex flex-col items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-full opacity-70 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />
          <button
            onClick={handleExpand}
            className="relative px-8 py-4 bg-black rounded-full leading-none flex items-center gap-3 transition-transform active:scale-95"
          >
            <span className="text-zinc-100 font-medium text-lg">Start Your Project</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-4 h-4 text-white" />
            </span>
          </button>
        </motion.div>
        <p className="mt-4 text-zinc-500 text-sm">
          Let's build something extraordinary together
        </p>
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-2xl bg-zinc-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Decorative Gradients */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 sm:p-10 relative">
                {!isSuccess ? (
                  <>
                    <div className="mb-8">
                      <h2 className="text-3xl font-serif font-bold text-white mb-2">Let's Talk</h2>
                      <p className="text-zinc-400">Tell us about your vision. We'll help you build it.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs text-zinc-500 font-medium font-mono uppercase tracking-wider">Name</label>
                          <input
                            required
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-zinc-500 font-medium font-mono uppercase tracking-wider">Email</label>
                          <input
                            required
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <CustomSelect
                          label="Budget Range"
                          options={budgetOptions}
                          value={budget}
                          onChange={setBudget}
                        />
                        <CustomSelect
                          label="Timeline"
                          options={timelineOptions}
                          value={timeline}
                          onChange={setTimeline}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-zinc-500 font-medium font-mono uppercase tracking-wider">Project Details</label>
                        <textarea
                          required
                          name="details"
                          rows={4}
                          placeholder="Tell us about your project goals, target audience, and any specific requirements..."
                          className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                          />
                        ) : (
                          <>
                            <span>Send Inquiry</span>
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                      <Sparkles className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-zinc-400 max-w-xs mx-auto">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
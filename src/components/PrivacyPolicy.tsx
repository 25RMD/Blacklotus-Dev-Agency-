import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface PrivacyPolicyProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Stop Lenis and fully lock page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      window.lenis?.stop()
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.body.style.height = '100vh'
      document.documentElement.style.height = '100vh'
      // Reset scroll position when opening
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
    } else {
      window.lenis?.start()
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.style.height = ''
      document.documentElement.style.height = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.style.height = ''
      document.documentElement.style.height = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-white text-black overflow-hidden"
        >
          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            className="h-full w-full overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Header */}
            <div className="sticky top-0 left-0 w-full flex justify-between items-center px-6 py-6 md:px-10 bg-white/90 backdrop-blur-sm border-b border-zinc-100 z-50">
              <div className="flex items-center gap-4">
                <img
                  src="/BL-logo.jpg"
                  alt="Black Lotus"
                  className="h-10 w-10 rounded-full object-contain"
                />
                <span className="text-xs font-bold uppercase tracking-widest hidden md:block">
                  Privacy & Cookies
                </span>
              </div>

              <button
                onClick={onClose}
                className="rounded-full border border-zinc-200 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center gap-2"
              >
                Close <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-5xl md:text-7xl font-sans font-medium tracking-tight mb-12">
                  Privacy Policy <br />
                  <span className="text-zinc-400">& Cookie Statement</span>
                </h1>

                <div className="space-y-16 text-lg leading-relaxed text-zinc-600">
                  <section>
                    <h3 className="text-black text-xl font-bold mb-4">1. Introduction</h3>
                    <p>
                      Black Lotus Development Agency ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-black text-xl font-bold mb-4">2. Information We Collect</h3>
                    <p className="mb-4">
                      We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                      <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-black text-xl font-bold mb-4">3. Use of Your Information</h3>
                    <p>
                      Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4">
                      <li>Create and manage your account.</li>
                      <li>Email you regarding your account or order.</li>
                      <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                      <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
                      <li>Increase the efficiency and operation of the Site.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-black text-xl font-bold mb-4">4. Cookie Policy</h3>
                    <p className="mb-4">
                      We use cookies, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.
                    </p>
                    <p>
                      Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-black text-xl font-bold mb-4">5. Contact Us</h3>
                    <p>
                      If you have questions or comments about this Privacy Policy, please contact us at:
                    </p>
                    <a href="mailto:blacklotusenquiry@gmail.com" className="text-black font-bold mt-2 block hover:underline">
                      blacklotusenquiry@gmail.com
                    </a>
                  </section>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

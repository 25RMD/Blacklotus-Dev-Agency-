import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { FormEvent } from 'react'

export function GetInTouch() {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        
        const firstName = formData.get('firstName')
        const lastName = formData.get('lastName')
        const email = formData.get('email')
        const phone = formData.get('phone')
        const details = formData.get('details')

        const subject = `New Project Inquiry from ${firstName} ${lastName}`
        const body = `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Project Details:
${details}
        `
        
        window.location.href = `mailto:blacklotusenquiry@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    return (
        <section id="contact" className="w-full bg-black py-24 md:py-32">
            <div className="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">

                    {/* Left Column - Text Info */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-white/75 mb-2"
                        >
                            GET IN TOUCH
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-[clamp(3.4rem,9.4vw,8.5rem)] font-display font-semibold tracking-[-0.03em] text-white leading-[0.9] -ml-1"
                        >
                            Speak to us.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-zinc-400 max-w-sm leading-relaxed mt-3"
                        >
                            If you want to start a project, share an idea or simply say hi, we want to hear from you.
                        </motion.p>
                    </div>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-8 lg:pl-12">
                        <form className="flex flex-col gap-16" onSubmit={handleSubmit}>
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="group relative"
                                >
                                    <label className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500 mb-2">First name</label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        placeholder="Emma"
                                        className="w-full text-2xl md:text-4xl pb-4 border-b border-zinc-800 bg-transparent outline-none focus:border-white transition-colors placeholder:text-white/90 font-medium tracking-[-0.02em] text-white"
                                    />
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="group relative"
                                >
                                    <label className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Last name</label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        placeholder="Lewis"
                                        className="w-full text-2xl md:text-4xl pb-4 border-b border-zinc-800 bg-transparent outline-none focus:border-white transition-colors placeholder:text-white/90 font-medium tracking-[-0.02em] text-white"
                                    />
                                </motion.div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                    className="group relative"
                                >
                                    <label className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="emma@email.com"
                                        className="w-full text-2xl md:text-4xl pb-4 border-b border-zinc-800 bg-transparent outline-none focus:border-white transition-colors placeholder:text-white/90 font-medium tracking-[-0.02em] text-white"
                                    />
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6 }}
                                    className="group relative"
                                >
                                    <label className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Phone number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="+234"
                                        className="w-full text-2xl md:text-4xl pb-4 border-b border-zinc-800 bg-transparent outline-none focus:border-white transition-colors placeholder:text-white/90 font-medium tracking-[-0.02em] text-white"
                                    />
                                </motion.div>
                            </div>

                            {/* Row 3 */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7 }}
                                className="group relative"
                            >
                                <label className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Project details</label>
                                <textarea
                                    name="details"
                                    placeholder="Tell us about your project..."
                                    rows={1}
                                    className="w-full text-2xl md:text-4xl pb-4 border-b border-zinc-800 bg-transparent outline-none focus:border-white transition-colors placeholder:text-white/90 font-medium tracking-[-0.02em] text-white resize-none"
                                    onInput={(e) => {
                                        e.currentTarget.style.height = 'auto';
                                        e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                    }}
                                />
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8 }}
                                className="pt-4"
                            >
                                <button
                                    type="submit"
                                    className="bg-white text-black pl-8 pr-2 py-2 rounded-none border border-white flex items-center gap-6 text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-zinc-200 transition-colors group h-14"
                                >
                                    SEND ENQUIRY
                                    <span className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </span>
                                </button>
                            </motion.div>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}

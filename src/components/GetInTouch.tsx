import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export function GetInTouch() {
    return (
        <section className="w-full bg-[#fdfdfc] py-24 md:py-32">
            <div className="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">

                    {/* Left Column - Text Info */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xs font-mono uppercase tracking-widest text-black mb-2"
                        >
                            GET IN TOUCH
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-7xl md:text-8xl lg:text-9xl font-normal tracking-tighter text-black leading-[0.9] -ml-1"
                        >
                            Speak to us.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-base text-zinc-500 max-w-xs leading-relaxed mt-4"
                        >
                            If you want to start a project, share an idea or simply say hi, we want to hear from you.
                        </motion.p>
                    </div>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-8 lg:pl-12">
                        <form className="flex flex-col gap-16">
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="group relative"
                                >
                                    <label className="block text-xs text-zinc-400 mb-2">First name</label>
                                    <input
                                        type="text"
                                        placeholder="Emma"
                                        className="w-full text-4xl md:text-5xl pb-4 border-b border-zinc-200 bg-transparent outline-none focus:border-black transition-colors placeholder:text-black font-light tracking-tight text-black"
                                    />
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="group relative"
                                >
                                    <label className="block text-xs text-zinc-400 mb-2">Last name</label>
                                    <input
                                        type="text"
                                        placeholder="Lewis"
                                        className="w-full text-4xl md:text-5xl pb-4 border-b border-zinc-200 bg-transparent outline-none focus:border-black transition-colors placeholder:text-black font-light tracking-tight text-black"
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
                                    <label className="block text-xs text-zinc-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="emma@email.com"
                                        className="w-full text-4xl md:text-5xl pb-4 border-b border-zinc-200 bg-transparent outline-none focus:border-black transition-colors placeholder:text-black font-light tracking-tight text-black"
                                    />
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6 }}
                                    className="group relative"
                                >
                                    <label className="block text-xs text-zinc-400 mb-2">Phone number</label>
                                    <input
                                        type="tel"
                                        placeholder="+44"
                                        className="w-full text-4xl md:text-5xl pb-4 border-b border-zinc-200 bg-transparent outline-none focus:border-black transition-colors placeholder:text-black font-light tracking-tight text-black"
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
                                <label className="block text-xs text-zinc-400 mb-2">Project details</label>
                                <textarea
                                    placeholder="Tell us about your project..."
                                    rows={1}
                                    className="w-full text-4xl md:text-5xl pb-4 border-b border-zinc-200 bg-transparent outline-none focus:border-black transition-colors placeholder:text-black font-light tracking-tight text-black resize-none"
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
                                    className="bg-black text-white pl-8 pr-2 py-2 rounded-full flex items-center gap-6 text-xs font-bold tracking-widest hover:bg-zinc-800 transition-colors group h-14"
                                >
                                    SEND ENQUIRY
                                    <span className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}

import { motion } from "framer-motion"

export function ServicesSection() {

    const services = [
        {
            title: "Websites",
            desc: "Designing and engineering custom, high-performance web platforms with a cinematic brutalist aesthetic."
        },
        {
            title: "Apps",
            desc: "Building fast, native-feeling mobile applications with seamless user experiences and robust architectures."
        },
        {
            title: "Infrastructure Scaling",
            desc: "Architecting reliable, distributed backend systems and cloud infrastructure designed to handle exponential growth seamlessly."
        },
        {
            title: "Maintenance Support & Consulting",
            desc: "Delivering continuous system optimization, technical support, and strategic engineering guidance to ensure long-term stability."
        }
    ]

    return (
        <section id="services" className="w-full bg-black py-24 md:py-32 overflow-hidden text-white relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* Section Label */}
                <motion.p
                    className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 mb-16"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    Our Services
                </motion.p>

                {/* Services List */}
                <motion.div
                    className="h-px bg-white/20 w-full mx-auto"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: "some" }}
                    transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                />
                <div className="flex flex-col">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative flex flex-col md:flex-row md:items-center justify-between py-12 md:py-16 cursor-pointer overflow-hidden"
                        >
                            {/* Animated bottom border */}
                            <motion.div
                                className="absolute bottom-0 left-0 h-px bg-white/20 w-full z-20 group-hover:bg-black/10 transition-colors duration-500"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true, amount: "some" }}
                                transition={{ duration: 2.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            />
                            {/* Hover Background Reveal Effect */}
                            <div
                                className="absolute inset-0 bg-[#e0e0e0] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-[0.22,1,0.36,1] z-0"
                            />

                            {/* Title Content */}
                            <div className="relative z-10 w-full md:w-1/2 mb-6 md:mb-0 pr-8">
                                <h3 className="font-sans font-light tracking-tight leading-[1] text-[clamp(2.5rem,5vw,5rem)] text-white group-hover:text-black transition-colors duration-300">
                                    {service.title}
                                </h3>
                            </div>

                            {/* Description Content */}
                            <div className="relative z-10 w-full md:w-5/12 ml-auto">
                                <p className="text-zinc-400 group-hover:text-zinc-800 transition-colors duration-300 text-lg md:text-xl font-light leading-relaxed">
                                    {service.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

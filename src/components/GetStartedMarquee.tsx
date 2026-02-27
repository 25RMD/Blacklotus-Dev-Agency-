import { useRef, useEffect } from "react"
import gsap from "gsap/dist/gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

// Register GSAP plugins (only on client)
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

// Assets to mix inside the marquee cards
const marqueeCards = [
    { src: "/curtainReveal/1.jpg", type: "image", title: "Strategy" },
    { src: "/curtainReveal/2.jpg", type: "image", title: "Design" },
    { src: "/curtainReveal/3.jpg", type: "image", title: "Development" },
    { src: "/curtainReveal/4.jpg", type: "image", title: "Motion" },
    { src: "/curtainReveal/5.jpg", type: "image", title: "Scale" },
    { src: "/curtainReveal/6.jpg", type: "image", title: "Refine" },
    { src: "/curtainReveal/7.jpg", type: "image", title: "Brand" },
    { src: "/curtainReveal/8.jpg", type: "image", title: "Story" },
    { src: "/curtainReveal/9.jpg", type: "image", title: "Future" }
]

export function GetStartedMarquee() {
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const text1Ref = useRef<HTMLHeadingElement>(null)
    const text2Ref = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        // Basic cleanup in dev strict mode
        const ctx = gsap.context(() => {
            // Create a timeline linked to the scroll-sequence section
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top", // Starts when section hits top of viewport
                    end: "bottom bottom", // Ends when the 400vh container finishes
                    scrub: 1, // 1-second delay smoothing
                },
            })

            // PART 1: Slide the cards horizontally across the screen
            // Track width needs to be calculated dynamically, or large enough relative to viewport
            tl.fromTo(
                trackRef.current,
                {
                    x: () => window.innerWidth,
                },
                {
                    x: () => -(trackRef.current?.scrollWidth || window.innerWidth * 2), // Move entirely off left
                    ease: "none",
                    duration: 1, // Base timeline duration (proportionate mapping)
                },
                0 // Start at timeline zero
            )

            // PART 1b: Animate each individual card's rotation and Y offset while scrolling
            const cards = document.querySelectorAll('.marquee-card')
            cards.forEach((card, i) => {
                // All cards start at -20 degrees and rotate 40 degrees clockwise to +20 degrees
                const startRotate = -20;
                // Keep the Y-axis bobbing alternating slightly for visual interest, or simplify it? 
                // Let's keep a slight vertical scatter so they don't form a perfect horizontal line.
                const startY = i % 2 === 0 ? 80 : -60;

                const endRotate = 20;
                const endY = startY * -1.8;

                tl.fromTo(card,
                    {
                        rotation: startRotate,
                        y: startY
                    },
                    {
                        rotation: endRotate,
                        y: endY,
                        ease: "sine.inOut",
                        duration: 1 // Match the track movement duration
                    },
                    0
                )
            })

            // PART 2: Crossfade the background text and color transition halfway through the scroll

            // Transition the sticky container background from black to white
            tl.to(
                ".marquee-bg",
                {
                    backgroundColor: "#f7f7f5", // The off-white color
                    duration: 0.2,
                    ease: "power1.inOut"
                },
                0.40 // Start transitioning slightly before the text swap
            )

            tl.to(
                text1Ref.current,
                {
                    opacity: 0,
                    color: "#222", // Also tween the text color so if it fades slowly it doesn't look weird
                    duration: 0.15, // Smoother longer fade
                    ease: "power2.inOut"
                },
                0.45 // Starts exactly at 45% mark
            )

            tl.to(
                text2Ref.current,
                {
                    opacity: 1,
                    color: "#222", // Ends up black on the new white background
                    duration: 0.15,
                    ease: "power2.inOut"
                },
                0.45 // Start fading in exactly as the other starts fading out
            )
        }, containerRef) // Scope to container

        return () => ctx.revert() // Cleanup on unmount
    }, [])

    return (
        <section
            id="get-started"
            ref={containerRef}
            className="relative w-full h-[400vh] bg-black"
        >
            {/* The sticky viewport that locks to the screen */}
            <div className="marquee-bg sticky top-0 h-screen w-full overflow-hidden flex items-center bg-black text-white">

                {/* Layer 1: Background Text */}
                <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
                    <h1
                        ref={text1Ref}
                        className="absolute text-[clamp(4rem,9vw,9rem)] font-sans tracking-tight text-white"
                        style={{ fontWeight: 300, opacity: 1 }}
                    >
                        From concept
                    </h1>
                    <h1
                        ref={text2Ref}
                        className="absolute text-[clamp(4rem,9vw,9rem)] font-sans tracking-tight text-white"
                        style={{ fontWeight: 300, opacity: 0 }}
                    >
                        to craft
                    </h1>
                </div>

                {/* Layer 2: Horizontal Card Track */}
                <div
                    ref={trackRef}
                    className="absolute z-[2] flex items-center gap-[4vw] px-[10vw] will-change-transform"
                >
                    {marqueeCards.map((card, i) => {
                        return (
                            <div
                                key={i}
                                className="marquee-card flex-shrink-0 w-[300px] md:w-[400px] aspect-square rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] bg-white relative flex items-center justify-center will-change-transform"
                            >
                                <img
                                    src={card.src}
                                    alt={card.title || "Work showcase"}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                />
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}

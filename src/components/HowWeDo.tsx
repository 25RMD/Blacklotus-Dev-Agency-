export function HowWeDo() {
  const pillars = [
    { title: "Rigor", invert: true },
    { title: "Rebellion", invert: false },
    { title: "Depth", invert: false },
    { title: "Care", invert: true },
  ]

  return (
    <section id='how-we-do' className='relative w-full bg-black px-0 pb-0'>
      <div className='border-y border-black/20 bg-[#e8e8e8]'>
        <p className='px-6 md:px-12 py-5 text-[11px] font-medium tracking-[0.16em] uppercase text-black/80'>
          How we do it
        </p>
      </div>

      <div className='relative grid grid-cols-1 md:grid-cols-2'>
        {pillars.map((pillar, index) => (
          <div
            key={pillar.title}
            className={`h-[34vh] min-h-[230px] md:h-[42vh] md:min-h-[320px] border-black/20 ${
              pillar.invert ? "bg-[#111111] text-white" : "bg-[#efefef] text-black"
            } ${index % 2 === 0 ? "md:border-r" : ""} ${index < 2 ? "border-b" : ""}`}
          >
            <div className='h-full w-full flex items-center justify-center px-8'>
              <h3 className='font-display font-semibold tracking-[-0.03em] leading-none text-[clamp(3rem,8vw,6.8rem)]'>
                {pillar.title}
              </h3>
            </div>
          </div>
        ))}

        <div className='pointer-events-none absolute left-1/2 top-1/2 w-[84%] max-w-[370px] -translate-x-1/2 -translate-y-1/2 border border-black/30 bg-[#f2f2f2] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.12)]'>
          <p className='text-[clamp(0.92rem,1.35vw,1.2rem)] font-medium leading-[1.45] tracking-[-0.01em] text-black'>
            We combine strategic clarity, bold thinking, deep craft, and genuine partnership to move brands forward.
          </p>
        </div>
      </div>
    </section>
  )
}

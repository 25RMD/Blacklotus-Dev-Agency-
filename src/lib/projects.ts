export const projects = [
  {
    id: "01",
    title: "Black Lotus",
    client: "Black Lotus Dev Agency",
    year: "2025",
    role: "Frontend Developer",
    description: "Black Lotus is a premier web and software development agency delivering high-quality digital solutions. Built the corporate identity and client-facing platform.",
    url: "https://blacklotusdev.org",
    img: "/projects/blacklotus.jpg",
    tags: ["Company", "Website", "Dev Agency"],
    brandColor: "#000000",
    textColor: "#ffffff"
  },
  {
    id: "02",
    title: "EE Wellness Hub",
    client: "EE Wellness Hub",
    year: "2025",
    role: "Frontend Developer",
    description: "EE Wellness is a wellness center in Lagos dedicated to holistic health. Developed a responsive website and mobile app for seamless client booking.",
    url: "https://eewellnesshub.com",
    img: "/projects/eewellness.jpg",
    tags: ["Company", "Website", "Mobile App"],
    brandColor: "#1B4332", // Deep green
    textColor: "#ffffff"
  },
  {
    id: "03",
    title: "Platz",
    client: "Platz",
    year: "2025",
    role: "Full Stack Developer",
    description: "A platform for tokenizing land into fractional tokens tradeable over the Ethereum blockchain, democratizing real estate investment via smart contracts.",
    url: "https://platz-landtokenization.vercel.app",
    img: "/projects/platz.jpg",
    tags: ["Web3", "Website", "Ethereum"],
    brandColor: "#4285F4", // Ethereum-ish Blue/Tech
    textColor: "#ffffff"
  },
  {
    id: "04",
    title: "Tomsu Foundation",
    client: "Tomsu Development Foundation",
    year: "2025",
    role: "Frontend Developer",
    description: "An NGO with impactful actions across West Africa. Built the frontend platform to showcase initiatives, display impact, and facilitate donor engagement.",
    url: "https://tdf-front.pages.dev/",
    img: "/projects/tomsu.jpg",
    tags: ["Company", "Website", "NGO"],
    brandColor: "#E63946", // NGO-ish Red
    textColor: "#ffffff"
  },
  {
    id: "05",
    title: "Tracklearn",
    client: "Tracklearn",
    year: "2026",
    role: "Frontend Developer",
    description: "An EdTech tool for school managements to ensure quality of lessons taught, featuring AI-aided learning for students — web dashboard and mobile app.",
    url: "https://tracklearn.org",
    img: "/projects/tracklearn.jpg",
    tags: ["EdTech", "Website", "Mobile App"],
    brandColor: "#F4A261", // EdTech Orange
    textColor: "#111111"
  },
  {
    id: "06",
    title: "Precog",
    client: "Precog",
    year: "2025",
    role: "Full Stack Developer",
    description: "An advanced scam detection system for Solana memecoins that analyzes on-chain data to identify risks, helping traders make safer investment decisions.",
    url: "https://precog.trade",
    img: "/projects/precog.jpg",
    tags: ["Crypto", "Website", "Solana"],
    brandColor: "#14F195", // Solana Green
    textColor: "#000000"
  },
  {
    id: "07",
    title: "MAGA Foundation",
    client: "Making Africa Great Again",
    year: "2024",
    role: "Full-Stack Website",
    description: "A fullstack website for an NGO focused on empowering African communities across the continent.",
    url: "https://makingafricagreatagain.org",
    img: "/projects/ng.jpeg",
    tags: ["NGO", "Website", "Africa"],
    brandColor: "#0D3B66", // Deep Blue
    textColor: "#ffffff"
  },
  {
    id: "08",
    title: "King Royal Events",
    client: "King Royal Events",
    year: "2024",
    role: "Full-Stack Website",
    description: "A fullstack website for an event center located in Maiduguri, featuring booking, gallery, and event management.",
    url: "https://kingroyal-events.com",
    img: "/projects/event.jpeg",
    tags: ["Events", "Website", "Booking"],
    brandColor: "#D4AF37", // Gold
    textColor: "#111111"
  },
  {
    id: "09",
    title: "Tabula Rasa",
    client: "Tabula Rasa",
    year: "2025",
    role: "Website",
    description: "Access the world's largest collection of African language data, ethically sourced and ready for AI training. Each dataset represents the voice and culture of millions.",
    url: "https://tabularasa.vercel.app/",
    img: "/projects/tabularasa.svg",
    tags: ["AI", "Data", "Africa"],
    brandColor: "#8338EC", // AI Purple
    textColor: "#ffffff"
  },
  {
    id: "10",
    title: "Medivision",
    client: "Medivision",
    year: "2025",
    role: "Website",
    description: "A cutting-edge AR simulator that brings anatomy to life with interactive 3D models.",
    url: "https://medicalsimulator.vercel.app/",
    img: "/projects/medivision.png",
    tags: ["AR", "Medical", "3D"],
    brandColor: "#06D6A0", // Medical Teal
    textColor: "#111111"
  }
]

export type Project = typeof projects[0]

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3 // Set a comfortable ambient volume
    }
  }, [])

  useEffect(() => {
    const handleStartAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error)
        })
        setIsPlaying(true)
      }
    }

    window.addEventListener('start-audio', handleStartAudio)
    return () => window.removeEventListener('start-audio', handleStartAudio)
  }, [isPlaying])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] mix-blend-difference">
      <audio
        ref={audioRef}
        src="/ambient.mp3" // Place your ambient music file in the public folder as ambient.mp3
        loop
        preload="auto"
      />
      <motion.button
        onClick={togglePlay}
        className="flex items-center justify-center w-12 h-12 rounded-full text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? "Mute ambient music" : "Play ambient music"}
      >
        {isPlaying ? (
          <Volume2 size={24} />
        ) : (
          <VolumeX size={24} />
        )}
      </motion.button>
    </div>
  )
}

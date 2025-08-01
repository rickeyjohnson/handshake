import { useEffect, useState } from 'react'

const images = [
  '/public/images/dashboard.png',
  '/public/images/transactions-ss.png',
  '/public/images/goals-ss.png',
  '/public/images/budgets-ss.png',
]

export default function ImageScroller() {
  const [scrollIndex, setScrollIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('scroller')
      if (!section) return

      const { top, height } = section.getBoundingClientRect()
      const scrollY = Math.max(0, -top)
      const index = Math.min(
        images.length - 1,
        Math.floor((scrollY / height) * images.length)
      )
      setScrollIndex(index)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="scroller" className="relative w-full h-[400vh] bg-white">
      <div className="sticky top-[5%] -translate-y-1/2 left-0 w-full flex justify-center items-center">
        <div className="relative w-[90%] h-auto">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`image-${i}`}
              className={`absolute inset-0 w-full h-auto object-contain rounded-2xl shadow-2xl shadow-stone-400 transition-all duration-700 ease-in-out
                ${i === scrollIndex
                  ? 'opacity-100 scale-100 z-20'
                  : 'opacity-0 scale-95 z-0'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
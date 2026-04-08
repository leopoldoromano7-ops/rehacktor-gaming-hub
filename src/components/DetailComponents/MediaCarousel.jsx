import { useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi'

export default function MediaCarousel({ images = [], gameName, embedded = false }) {
  const media = [...new Set(images.filter(Boolean))]
  const [activeIndex, setActiveIndex] = useState(0)

  if (!media.length) {
    return null
  }

  const activeImage = media[activeIndex] ?? media[0]

  function showPrevious() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? media.length - 1 : currentIndex - 1,
    )
  }

  function showNext() {
    setActiveIndex((currentIndex) =>
      currentIndex === media.length - 1 ? 0 : currentIndex + 1,
    )
  }

  const imageHeight = embedded
    ? 'h-[190px] w-full object-cover sm:h-[300px] xl:h-[460px]'
    : 'h-[250px] w-full object-cover sm:h-[340px] xl:h-[420px]'

  const galleryContent = (
    <div className={embedded ? 'space-y-3 p-4 sm:p-5' : 'space-y-4 p-4 sm:p-5'}>
      <div className="overflow-hidden rounded-sm border border-[#c084fc]/10 bg-[#0d0a22]">
        <img
          alt={`${gameName} screenshot ${activeIndex + 1}`}
          className={imageHeight}
          src={activeImage}
        />
      </div>

      {media.length > 1 ? (
        <div className="space-y-3 sm:space-y-0">
          <div className="flex items-center justify-between gap-3 sm:hidden">
            <button
              className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-sm border border-[#c084fc]/16 bg-[#120f31] text-[#f5f3ff] transition-colors hover:border-[#ec4899]/28 hover:bg-[#211950]"
              onClick={showPrevious}
              type="button"
            >
              <FiChevronLeft className="text-xl" />
            </button>

            <span className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">
              {activeIndex + 1} / {media.length}
            </span>

            <button
              className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-sm border border-[#c084fc]/16 bg-[#120f31] text-[#f5f3ff] transition-colors hover:border-[#ec4899]/28 hover:bg-[#211950]"
              onClick={showNext}
              type="button"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-sm border border-[#c084fc]/16 bg-[#120f31] text-[#f5f3ff] transition-colors hover:border-[#ec4899]/28 hover:bg-[#211950]"
              onClick={showPrevious}
              type="button"
            >
              <FiChevronLeft className="text-xl" />
            </button>

            <div className="grid flex-1 auto-cols-[140px] grid-flow-col gap-3 overflow-x-auto pb-1">
              {media.map((image, index) => (
                <button
                  className={[
                    'overflow-hidden rounded-sm border bg-[#0d0a22] text-left transition-all',
                    index === activeIndex
                      ? 'border-[#ec4899]/40 shadow-[0_0_0_1px_rgba(236,72,153,0.24)]'
                      : 'border-[#c084fc]/10 hover:border-[#c084fc]/30',
                  ].join(' ')}
                  key={image}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <img
                    alt={`${gameName} thumbnail ${index + 1}`}
                    className="h-20 w-full object-cover"
                    loading="lazy"
                    src={image}
                  />
                </button>
              ))}
            </div>

            <button
              className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-sm border border-[#c084fc]/16 bg-[#120f31] text-[#f5f3ff] transition-colors hover:border-[#ec4899]/28 hover:bg-[#211950]"
              onClick={showNext}
              type="button"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>

          <div className="grid auto-cols-[112px] grid-flow-col gap-3 overflow-x-auto pb-1 sm:hidden">
            {media.map((image, index) => (
              <button
                className={[
                  'overflow-hidden rounded-sm border bg-[#0d0a22] text-left transition-all',
                  index === activeIndex
                    ? 'border-[#ec4899]/40 shadow-[0_0_0_1px_rgba(236,72,153,0.24)]'
                    : 'border-[#c084fc]/10 hover:border-[#c084fc]/30',
                ].join(' ')}
                key={image}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <img
                  alt={`${gameName} thumbnail ${index + 1}`}
                  className="h-[4.5rem] w-full object-cover"
                  loading="lazy"
                  src={image}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )

  if (embedded) {
    return galleryContent
  }

  return (
    <section className="surface-panel overflow-hidden rounded-sm border border-[#c084fc]/12 shadow-[0_16px_40px_rgba(5,5,16,0.38)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#c084fc]/10 bg-[#231d58] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#d4b8ff] sm:px-5">
        <span className="inline-flex items-center gap-2">
          <FiImage className="text-sm" />
          <span>Media gallery</span>
        </span>
        <span>{activeIndex + 1} / {media.length}</span>
      </div>

      {galleryContent}
    </section>
  )
}

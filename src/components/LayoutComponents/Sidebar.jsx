import { useEffect, useState } from 'react'
import { FiChevronUp, FiX } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router-dom'
import { routes } from '../../router/routes.js'

function getChipClass(isActive) {
  return [
    'flex w-full items-center justify-between rounded-sm border px-3 py-3 text-left text-sm transition-colors',
    isActive
      ? 'border-[#c084fc]/35 bg-[#261f5e] text-white brand-highlight'
      : 'border-transparent bg-[#0e0b26] text-[#efe8ff] hover:border-[#c084fc]/18 hover:bg-[#18123b] hover:text-white',
  ].join(' ')
}

export default function Sidebar({ genres, source, sourceMessage, topOffset = 0 }) {
  const desktopTopOffset = topOffset || 140
  const desktopHeight = `calc(100vh - ${desktopTopOffset + 16}px)`
  const mobileFixedTop = topOffset || 0
  const { pathname } = useLocation()
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
  const activeGenre = genres.find((genre) => routes.genre(genre.slug) === pathname)
  const mobileTriggerLabel = activeGenre?.name || 'Generi'

  function closeMobileSheet() {
    setIsMobileSheetOpen(false)
  }

  function openMobileSheet() {
    setIsMobileSheetOpen(true)
  }

  useEffect(() => {
    closeMobileSheet()
  }, [pathname])

  useEffect(() => {
    if (!isMobileSheetOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileSheetOpen])

  return (
    <aside className="order-first min-w-0 lg:self-start">
      <div className="sm:hidden h-[3.75rem]">
        <div className="fixed inset-x-3 z-40" style={{ top: `${mobileFixedTop}px` }}>
          <button
            aria-controls="mobile-genres-sheet"
            aria-expanded={isMobileSheetOpen}
          className="surface-panel flex w-full items-center justify-between gap-3 rounded-sm border border-[#c084fc]/12 px-4 py-3 shadow-[0_14px_36px_rgba(5,5,16,0.38)] transition-colors hover:border-[#c084fc]/24"
          onClick={openMobileSheet}
          type="button"
        >
          <span className="truncate text-[11px] font-medium uppercase tracking-[0.28em] text-[#c084fc]">
            {mobileTriggerLabel}
          </span>
          <FiChevronUp className="text-base text-[#c084fc]" />
        </button>
        </div>

        {isMobileSheetOpen ? (
          <div className="fixed inset-0 z-[70]">
            <button
              aria-label="Chiudi elenco generi"
              className="absolute inset-0 bg-[#050510]/72 backdrop-blur-[2px]"
              onClick={closeMobileSheet}
              type="button"
            />

            <div
              className="surface-panel absolute inset-x-0 bottom-0 rounded-t-[1.4rem] border-x border-t border-[#c084fc]/14 px-4 pb-6 pt-4 shadow-[0_-24px_60px_rgba(5,5,16,0.58)]"
              id="mobile-genres-sheet"
            >
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[#c084fc]/30" />

              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c084fc]">
                    Browse
                  </p>
                  <h2 className="mt-2 font-display text-[1.8rem] uppercase leading-none tracking-[0.08em] text-white">
                    Genres
                  </h2>
                </div>

                <button
                  aria-label="Chiudi elenco generi"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#c084fc]/14 bg-[#120f31] text-[#f5f3ff] transition-colors hover:border-[#c084fc]/24 hover:bg-[#18123b]"
                  onClick={closeMobileSheet}
                  type="button"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <nav
                aria-label="Genres"
                className="grid max-h-[60vh] grid-cols-1 gap-2 overflow-y-auto pr-1 overscroll-contain"
              >
                <NavLink className={({ isActive }) => getChipClass(isActive)} end onClick={closeMobileSheet} to={routes.home}>
                  <span>Tutti i giochi</span>
                  <span className="text-xs uppercase tracking-[0.16em] text-[#c084fc]">All</span>
                </NavLink>
                {genres.map((genre) => (
                  <NavLink
                    key={genre.id ?? genre.slug}
                    className={({ isActive }) => getChipClass(isActive)}
                    onClick={closeMobileSheet}
                    to={routes.genre(genre.slug)}
                  >
                    <span>{genre.name}</span>
                    <span className="text-xs uppercase tracking-[0.16em] text-[#b4a9df]">Genre</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        ) : null}
      </div>

      <div
        className="hidden space-y-4 sm:block lg:fixed lg:w-72 lg:-translate-x-[30px] lg:[top:var(--sidebar-top)] lg:[height:var(--sidebar-height)]"
        style={{
          '--sidebar-top': `${desktopTopOffset}px`,
          '--sidebar-height': desktopHeight,
        }}
      >
        <div className="surface-panel flex flex-col rounded-sm border border-[#c084fc]/12 p-4 shadow-[0_14px_36px_rgba(5,5,16,0.38)] lg:h-full">
          <div className="space-y-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c084fc]">
              Browse
            </span>
            <div className="space-y-2">
              <h2 className="font-display text-[2rem] uppercase leading-none tracking-[0.08em] text-white">
                Genres
              </h2>
            </div>
          </div>

          <nav
            aria-label="Genres"
            className="mt-5 grid max-h-[60vh] grid-cols-1 gap-2 overflow-y-auto pr-1 overscroll-contain sm:grid-cols-2 lg:flex lg:flex-1 lg:min-h-0 lg:max-h-none lg:flex-col"
          >
            <NavLink className={({ isActive }) => getChipClass(isActive)} end to={routes.home}>
              <span>Tutti i giochi</span>
              <span className="text-xs uppercase tracking-[0.16em] text-[#c084fc]">All</span>
            </NavLink>
            {genres.map((genre) => (
              <NavLink
                key={genre.id ?? genre.slug}
                className={({ isActive }) => getChipClass(isActive)}
                to={routes.genre(genre.slug)}
              >
                <span>{genre.name}</span>
                <span className="text-xs uppercase tracking-[0.16em] text-[#b4a9df]">Genre</span>
              </NavLink>
            ))}
          </nav>
        </div>

      </div>
    </aside>
  )
}

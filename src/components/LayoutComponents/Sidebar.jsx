import { NavLink } from 'react-router-dom'
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

  return (
    <aside className="order-first min-w-0 lg:self-start">
      <div
        className="space-y-4 lg:fixed lg:w-72 lg:[top:var(--sidebar-top)] lg:[height:var(--sidebar-height)]"
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

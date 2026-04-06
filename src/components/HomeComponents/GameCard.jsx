import { Link } from 'react-router-dom'
import {
  clampText,
  formatReleaseDate,
  formatScore,
  getGameDescription,
  getGenreNames,
  getPlatformNames,
  getToneFromSeed,
} from '../../utils/game-utils.js'
import { routes } from '../../router/routes.js'

function buildFallbackSummary(game, genres, platforms) {
  const details = []

  if (platforms.length) {
    details.push(`su ${platforms.join(' / ')}`)
  }

  if (game.released) {
    details.push(`uscito il ${formatReleaseDate(game.released)}`)
  }

  if (typeof game.rating === 'number') {
    details.push(`rating utenti ${formatScore(game.rating)}`)
  }

  if (!details.length && !genres.length) {
    return 'Scheda live RAWG con dati essenziali, piattaforme e valutazioni del gioco.'
  }

  const lead = genres.length ? `${genres.join(', ')}` : 'Gioco'
  return `${lead} ${details.join(', ')}.`
}

export default function GameCard({ game }) {
  const genres = getGenreNames(game).slice(0, 3)
  const platforms = getPlatformNames(game).slice(0, 2)
  const summary =
    clampText(getGameDescription(game), 104) ||
    buildFallbackSummary(game, genres, platforms)

  return (
    <article className="group surface-panel-soft overflow-hidden rounded-sm border border-[#c084fc]/12 shadow-[0_16px_38px_rgba(5,5,16,0.34)] transition-all duration-200 hover:border-[#c084fc]/28 hover:shadow-[0_24px_52px_rgba(5,5,16,0.46)]">
      
      <div className="grid min-h-[220px] gap-px bg-[#c084fc]/10 sm:[grid-template-columns:230px_minmax(0,1fr)]">
        <Link className="relative min-h-[220px] overflow-hidden bg-[#0d0a22]" to={routes.detail(game.id)}>
          {game.background_image ? (
            <img
              alt={game.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              src={game.background_image}
            />
          ) : (
            <div
              className="flex h-full w-full items-end p-5"
              style={{ background: getToneFromSeed(game.slug || game.name) }}
            >
              <span className="font-display text-3xl leading-none text-white">{game.name}</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050510]/85 to-transparent" />
        </Link>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <h2 className="font-display text-[1.7rem] leading-none text-white transition-colors group-hover:text-[#c084fc] sm:text-[1.85rem]">
                <Link to={routes.detail(game.id)}>{game.name}</Link>
              </h2>
              <p className="text-sm leading-6 text-[#ddd6fe]">{summary}</p>
            </div>

            <div className="shrink-0 rounded-sm border border-[#ec4899]/22 bg-[#0d0a22] px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Meta</p>
              <p className="text-lg font-semibold text-[#f5f3ff]">{game.metacritic ?? 'n/a'}</p>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-[#f5f3ff] sm:grid-cols-2 2xl:grid-cols-3">
            <div className="rounded-sm bg-[#0d0a22] px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Release</p>
              <p className="mt-1 leading-5">{formatReleaseDate(game.released)}</p>
            </div>
            <div className="rounded-sm bg-[#0d0a22] px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">User rating</p>
              <p className="mt-1 leading-5">{formatScore(game.rating)}</p>
            </div>
            <div className="rounded-sm bg-[#0d0a22] px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Platforms</p>
              <p className="mt-1 leading-5">{platforms.join(' / ') || 'Multi-platform'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <span className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#f5f3ff]" key={genre}>
                {genre}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#c084fc]/10 pt-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#b4a9df]">Game capsule</p>
            <Link className="brand-secondary inline-flex rounded-sm px-4 py-2.5 text-sm font-semibold text-white" to={routes.detail(game.id)}>
              Scheda
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

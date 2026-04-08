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
import SourceBadge from '../SharedComponents/SourceBadge.jsx'
import MediaCarousel from './MediaCarousel.jsx'

export default function Header({ game, images = [], source, sourceMessage }) {
  const description =
    getGameDescription(game) ||
    'Descrizione non disponibile, ma la struttura della pagina e pronta per gestire dati completi, preferiti e recensioni.'
  const shortDescription = clampText(description, 190)
  const genres = getGenreNames(game)
  const platforms = getPlatformNames(game)
  const media = [...new Set(images.filter(Boolean))]

  return (
    <section className="surface-panel overflow-hidden rounded-sm border border-[#c084fc]/12 shadow-[0_20px_52px_rgba(5,5,16,0.42)]">
      <div className="border-b border-[#c084fc]/10 bg-[#231d58] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#d4b8ff] sm:px-5">
        Game profile
      </div>

      <div className="grid gap-px bg-[#c084fc]/10 xl:[grid-template-columns:minmax(0,1.35fr)_360px]">
        <div className="min-w-0 bg-[#0d0a22]">
          {media.length ? (
            <MediaCarousel embedded gameName={game.name} images={media} />
          ) : game.background_image ? (
            <img
              alt={game.name}
              className="h-full min-h-[180px] w-full object-cover sm:min-h-[220px] xl:min-h-[400px]"
              src={game.background_image}
            />
          ) : (
            <div
              className="flex min-h-[180px] items-end p-5 sm:min-h-[220px] sm:p-8 xl:min-h-[400px]"
              style={{ background: getToneFromSeed(game.slug || game.name) }}
            >
              <span className="font-display text-3xl leading-none text-white sm:text-5xl">
                {game.name}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex flex-col gap-4 bg-[linear-gradient(180deg,#241d59_0%,#0f0b29_100%)] p-4 sm:gap-5 sm:p-5">
          <Link className="text-[11px] uppercase tracking-[0.16em] text-[#c084fc] hover:text-white sm:text-xs sm:tracking-[0.18em]" to={routes.home}>
            Torna alla home
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge
              liveLabel="Live detail"
              mockLabel="API status"
              source={source}
            />
            <span className="rounded-sm bg-black/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#d4b8ff]">
              Scheda gioco
            </span>
          </div>

          <div className="space-y-3 min-w-0">
            <h1 className="font-display break-words text-3xl leading-none text-white sm:text-4xl">{game.name}</h1>
            <p className="text-sm leading-6 text-[#ddd6fe]">{shortDescription}</p>
          </div>

          <div className="space-y-2 text-sm text-[#f5f3ff]">
            <div className="flex flex-col gap-1 border-b border-[#c084fc]/10 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">Release</span>
              <span>{formatReleaseDate(game.released)}</span>
            </div>
            <div className="flex flex-col gap-1 border-b border-[#c084fc]/10 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">User rating</span>
              <span>{formatScore(game.rating)}</span>
            </div>
            <div className="flex flex-col gap-1 border-b border-[#c084fc]/10 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">Metacritic</span>
              <span className="text-[#f5f3ff]">{game.metacritic ?? 'n/a'}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">Platforms</span>
              <span className="break-words text-left sm:text-right">{platforms.join(' / ') || 'Multi-platform'}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 4).map((genre) => (
              <span className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#f5f3ff]" key={genre}>
                {genre}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {game.website ? (
              <a className="brand-secondary inline-flex w-full items-center justify-center rounded-sm px-4 py-2.5 text-sm font-semibold text-white sm:w-auto" href={game.website} rel="noreferrer" target="_blank">
                Sito ufficiale
              </a>
            ) : null}
            <a
              className="brand-primary inline-flex w-full items-center justify-center rounded-sm px-4 py-2.5 text-sm font-semibold text-[#130f2c] sm:w-auto"
              href={`https://rawg.io/games/${game.slug}`}
              rel="noreferrer"
              target="_blank"
            >
              Scheda RAWG
            </a>
          </div>

          <p className="text-xs leading-5 text-[#b4a9df]">{sourceMessage}</p>
        </div>
      </div>
    </section>
  )
}

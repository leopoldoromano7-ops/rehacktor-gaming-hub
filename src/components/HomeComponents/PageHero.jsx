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

function buildFeaturedFallback(genres, platforms, featuredGame) {
  const parts = []

  if (genres.length) {
    parts.push(genres.join(', '))
  }

  if (platforms.length) {
    parts.push(`su ${platforms.join(' / ')}`)
  }

  if (featuredGame?.released) {
    parts.push(`uscito il ${formatReleaseDate(featuredGame.released)}`)
  }

  return parts.length ? `${parts.join(' - ')}.` : ''
}

export default function PageHero({
  eyebrow,
  title,
  description,
  source,
  sourceMessage,
  stats = [],
  featuredGame,
  brandLogo,
  stack = [],
  compact = false,
  sideTitle,
  sideDescription,
  contextDetails = [],
  contextTags = [],
  showActions = true,
  showTags = true,
  showSourceMessage = true,
  desktopMinHeightClass = '',
  showTopRibbon = true,
}) {
  const isBrandHero = Boolean(brandLogo) && !featuredGame
  const genres = featuredGame ? getGenreNames(featuredGame).slice(0, 3) : []
  const platforms = featuredGame ? getPlatformNames(featuredGame).slice(0, 3) : []
  const featuredSummary = featuredGame
    ? clampText(getGameDescription(featuredGame), 190) || description
    : description
  const imageSummary = featuredGame
    ? clampText(getGameDescription(featuredGame), 110) ||
      buildFeaturedFallback(genres, platforms, featuredGame)
    : ''
  const detailRows = contextDetails.filter((item) => item?.label && item?.value)
  const displayTags = showTags
    ? contextTags.filter(Boolean).length
      ? contextTags.filter(Boolean)
      : genres
    : []
  const panelTitle = sideTitle || title
  const panelDescription = sideDescription || featuredSummary
  const heroColumns = compact
    ? 'lg:[grid-template-columns:minmax(0,1.52fr)_280px]'
    : 'lg:[grid-template-columns:minmax(0,1.52fr)_350px]'
  const mediaMinHeight = compact ? 'min-h-[190px] sm:min-h-[220px]' : 'min-h-[280px]'
  const mediaContentPadding = compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'
  const panelShell = compact ? 'gap-4 p-4' : 'gap-5 p-5'
  const panelTitleClass = compact ? 'text-[2rem]' : 'text-3xl'
  const mediaTitleClass = compact ? 'text-3xl sm:text-[2.5rem]' : 'text-4xl sm:text-5xl'

  return (
    <section className="surface-panel overflow-hidden rounded-sm border border-[#c084fc]/12 shadow-[0_20px_52px_rgba(5,5,16,0.42)]">
      {showTopRibbon ? (
        <div className="border-b border-[#c084fc]/10 bg-[#231d58] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#d4b8ff] sm:px-5">
          {featuredGame && !compact ? 'Curated spotlight' : eyebrow}
        </div>
      ) : null}

      <div className={`grid gap-px bg-[#c084fc]/10 ${heroColumns} ${desktopMinHeightClass}`}>
        {isBrandHero ? (
          <div className={`relative min-h-[320px] overflow-hidden bg-[#090714] ${desktopMinHeightClass}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.18),transparent_26%),radial-gradient(circle_at_70%_20%,rgba(192,132,252,0.2),transparent_24%),linear-gradient(135deg,#120f31_0%,#090714_48%,#050510_100%)]" />
            <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-[#8b5cf6]/22 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-[#ec4899]/16 blur-3xl" />
            <div className={`relative flex min-h-[320px] h-full flex-col items-center justify-center gap-6 p-8 text-center sm:min-h-[420px] sm:p-12 ${desktopMinHeightClass}`}>
              <img
                alt="Rehacktor logo"
                className="h-28 w-28 object-contain sm:h-36 sm:w-36"
                src={brandLogo}
              />

              <div className="space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c084fc]">
                  {eyebrow}
                </p>
                <h1 className="font-display text-4xl leading-none text-white sm:text-6xl">
                  {title}
                </h1>
                <p className="mx-auto max-w-2xl text-base leading-7 text-[#ddd6fe] sm:text-lg">
                  {description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Link
            className={`group relative overflow-hidden bg-[#090714] ${mediaMinHeight} ${desktopMinHeightClass}`}
            to={featuredGame ? routes.detail(featuredGame.id) : routes.home}
          >
            {featuredGame?.background_image ? (
              <img
                alt={featuredGame.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={featuredGame.background_image}
              />
            ) : (
              <div
                className={`h-full w-full ${mediaMinHeight}`}
                style={{ background: getToneFromSeed(featuredGame?.slug || title) }}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/38 to-transparent" />
            <div className={`absolute bottom-0 left-0 right-0 ${mediaContentPadding}`}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c084fc]">
                {eyebrow}
              </p>
              <h1 className={`mt-2 font-display leading-none text-white ${mediaTitleClass}`}>
                {featuredGame?.name || title}
              </h1>
              {compact && imageSummary ? (
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#ddd6fe]">{imageSummary}</p>
              ) : null}
              {compact && featuredGame ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredGame.released ? (
                    <span className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22]/88 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#f5f3ff]">
                      {formatReleaseDate(featuredGame.released)}
                    </span>
                  ) : null}
                  {typeof featuredGame.rating === 'number' ? (
                    <span className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22]/88 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#f5f3ff]">
                      Rating {formatScore(featuredGame.rating)}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Link>
        )}

        <div className={`flex h-full flex-col bg-[linear-gradient(180deg,#241d59_0%,#0f0b29_100%)] ${panelShell} ${desktopMinHeightClass}`}>
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge source={source} />
            <span className="rounded-sm bg-black/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#d4b8ff]">
              {eyebrow}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className={`font-display leading-none text-white ${panelTitleClass}`}>
              {panelTitle}
            </h2>
            <p className="text-sm leading-6 text-[#ddd6fe]">{panelDescription}</p>
          </div>

          {stack.length ? (
            <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">Stack usato</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {stack.map((item) => (
                  <span
                    className="rounded-sm border border-[#c084fc]/10 bg-[#120f31] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[#f5f3ff]"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {detailRows.length ? (
            <div className="space-y-2 text-sm text-[#f5f3ff]">
              {detailRows.map((item) => (
                <div
                  className="flex items-center justify-between gap-3 border-b border-[#c084fc]/10 pb-2 last:border-b-0 last:pb-0"
                  key={item.label}
                >
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">
                    {item.label}
                  </span>
                  <span className="text-right">{item.value}</span>
                </div>
              ))}
            </div>
          ) : featuredGame ? (
            <div className="space-y-2 text-sm text-[#f5f3ff]">
              <div className="flex items-center justify-between gap-3 border-b border-[#c084fc]/10 pb-2">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">
                  Release
                </span>
                <span>{formatReleaseDate(featuredGame.released)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-[#c084fc]/10 pb-2">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">
                  User rating
                </span>
                <span>{formatScore(featuredGame.rating)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#b4a9df]">
                  Platforms
                </span>
                <span className="text-right">{platforms.join(' / ') || 'Multi-platform'}</span>
              </div>
            </div>
          ) : null}

          {displayTags.length ? (
            <div className="flex flex-wrap gap-2">
              {displayTags.map((tag) => (
                <span
                  className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#f5f3ff]"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {stats.filter(Boolean).length ? (
            <div className="grid gap-2">
              {stats.filter(Boolean).map((item) => (
                <div
                  className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-3 py-2 text-sm text-[#f5f3ff]"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          ) : null}

          {showActions ? (
            <div className="mt-auto flex flex-wrap gap-2">
              {featuredGame ? (
                <Link
                  className={`brand-secondary inline-flex rounded-sm font-semibold text-white ${compact ? 'px-3.5 py-2 text-sm' : 'px-4 py-2.5 text-sm'}`}
                  to={routes.detail(featuredGame.id)}
                >
                  Apri scheda
                </Link>
              ) : null}
              <Link
                className={`brand-primary inline-flex rounded-sm font-semibold text-[#130f2c] ${compact ? 'px-3.5 py-2 text-sm' : 'px-4 py-2.5 text-sm'}`}
                to={routes.home}
              >
                {isBrandHero ? 'Scorri il catalogo' : 'Vai al catalogo'}
              </Link>
            </div>
          ) : null}

          {showSourceMessage && sourceMessage ? (
            <p className="text-xs leading-5 text-[#b4a9df]">{sourceMessage}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

import { useLoaderData } from 'react-router-dom'
import GameGrid from '../components/HomeComponents/GameGrid.jsx'
import PageHero from '../components/HomeComponents/PageHero.jsx'
import logo from '../assets/logo2.svg'
import { getPlatformNames } from '../utils/game-utils.js'

export default function HomePage() {
  const { games, totalCount, sortMode, source, sourceMessage } = useLoaderData()
  const currentYear = new Date().getFullYear()
  const totalLabel = new Intl.NumberFormat('it-IT').format(totalCount ?? games.length)
  const featuredGame = games[0]
  const modeLabel =
    sortMode === 'trending'
      ? 'Trending now'
      : sortMode === 'top-rated'
        ? 'Top rated'
        : `Radar ${currentYear}`
  const topPlatforms = [
    ...new Set(games.flatMap((game) => getPlatformNames(game))),
  ]
    .slice(0, 3)
    .join(' / ')
  const isSortedView = sortMode === 'trending' || sortMode === 'top-rated'

  return (
    <div className="space-y-6">
      {isSortedView ? (
        <PageHero
          compact
          contextDetails={[
            { label: 'Vista attiva', value: modeLabel },
            { label: 'Titoli totali', value: totalLabel },
            { label: 'Piattaforme', value: topPlatforms || 'Multi-platform' },
          ]}
          desktopMinHeightClass="lg:min-h-[calc(100vh-156px)]"
          description="La home si adatta al filtro selezionato e porta subito in evidenza il primo titolo del feed ordinato."
          eyebrow={modeLabel}
          featuredGame={featuredGame}
          showSourceMessage={false}
          showTags={false}
          showTopRibbon={false}
          sideDescription={
            sortMode === 'trending'
              ? 'Stai guardando i giochi che emergono di piu nel catalogo RAWG in base a popolarita e interesse recente.'
              : 'Stai guardando i giochi ordinati per rating, con una vetrina che mette subito in evidenza il primo titolo del feed.'
          }
          sideTitle={modeLabel}
          source={source}
          sourceMessage={sourceMessage}
          title={modeLabel}
        />
      ) : (
        <PageHero
          brandLogo={logo}
          description="Una piattaforma gaming costruita per esplorare cataloghi, schede dettaglio, profili utente, preferiti e recensioni in un unica esperienza neon."
          desktopMinHeightClass="lg:min-h-[calc(100vh-156px)]"
          eyebrow="Homepage"
          showActions={false}
          source={source}
          sourceMessage={sourceMessage}
          stack={['React', 'React Router', 'Tailwind', 'DaisyUI', 'Supabase', 'RAWG API']}
          stats={[`${totalLabel} titoli totali`, modeLabel]}
          title="REHACKTOR"
        />
      )}

      <GameGrid
        emptyBody="RAWG non ha restituito titoli per questa selezione. Riprova tra poco o cambia filtro."
        emptyTitle="Nessun gioco in vetrina"
        games={games}
      />
    </div>
  )
}

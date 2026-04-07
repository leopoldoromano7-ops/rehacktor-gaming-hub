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
    <div className="space-y-6 ">
      {isSortedView ? (
        <PageHero
          compact
          contextDetails={[
            { label: 'Elenco', value: modeLabel },
            { label: 'Titoli totali', value: totalLabel },
            { label: 'Piattaforme', value: topPlatforms || 'Multi-platform' },
          ]}
          contextTags={[modeLabel, source === 'rawg' ? 'Feed live' : 'Offline']}
          eyebrow={modeLabel}
          featuredGame={featuredGame}
          sideDescription={
            sortMode === 'trending'
              ? 'Stai guardando i giochi che emergono di piu nel catalogo in base alla loro popolarita.'
              : 'Stai guardando i giochi piu votati ed apprezzati del catalogo .'
          }
          sideTitle={modeLabel}
          source={source}
          sourceMessage={
            source === 'rawg'
              ? modeLabel
              : sourceMessage
          }
          title={modeLabel}
        />
      ) : (
        <PageHero
          brandLogo={logo}
          description="Una piattaforma di consulting basata sul mondo del gaming! costruita per esplorare i videogiochi a 360 gradi!."
          desktopMinHeightClass="lg:min-h-[calc(100vh-156px)]"
          eyebrow="Homepage"
          showActions={false}
          sideDescription="Analizza trend, generi e schede di gioco in un catalogo pensato per orientarti tra dati live, insight rapidi e consultazione visuale."
          source={source}
          sourceMessage={sourceMessage}
          stack={['React', 'React Router', 'Tailwind', 'DaisyUI', 'Supabase', 'RAWG API']}
          stats={[`${totalLabel} titoli totali`, modeLabel]}
          title="REHACKTOR"
        />
      )}

      <GameGrid
        emptyBody="Purtoppo non siamo stati in grado di restituiti titoli per questa selezione. Riprova tra poco o cambia filtro."
        emptyTitle="Nessun gioco in vetrina"
        games={games}
      />
    </div>
  )
}

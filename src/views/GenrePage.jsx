import { useLoaderData } from 'react-router-dom'
import GameGrid from '../components/HomeComponents/GameGrid.jsx'
import PageHero from '../components/HomeComponents/PageHero.jsx'
import { getPlatformNames } from '../utils/game-utils.js'

export default function GenrePage() {
  const { games, totalCount, genreLabel, source, sourceMessage } = useLoaderData()
  const featuredGame = games[0]
  const totalLabel = new Intl.NumberFormat('it-IT').format(totalCount ?? games.length)
  const topPlatforms = [
    ...new Set(games.flatMap((game) => getPlatformNames(game))),
  ]
    .slice(0, 3)
    .join(' / ')

  return (
    <div className="space-y-6">
      <PageHero
        compact
        contextDetails={[
          { label: 'Filtro attivo', value: genreLabel },
          { label: 'Titoli totali', value: totalLabel },
          { label: 'Piattaforme', value: topPlatforms || 'Multi-platform' },
        ]}
        contextTags={[genreLabel, source === 'rawg' ? 'Feed live' : 'Offline']}
        eyebrow="Genere"
        featuredGame={featuredGame}
        sideDescription={`Hai selezionato il genere ${genreLabel}. Qui trovi tutti i giochi di questo specifico genere restituiti dal catalogo.`}
        sideTitle={`${genreLabel}`}
        source={source}
        sourceMessage={
          source === 'rawg'
            ? `${genreLabel}`
            : sourceMessage
        }
        title={genreLabel}
      />

      <GameGrid
        emptyBody="Questo genere al momento non ha risultati da RAWG. Prova un altro filtro."
        emptyTitle={`Nessun gioco in ${genreLabel}`}
        games={games}
      />
    </div>
  )
}

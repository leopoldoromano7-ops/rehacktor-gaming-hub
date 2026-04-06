import { useLoaderData } from 'react-router-dom'
import GameGrid from '../components/HomeComponents/GameGrid.jsx'
import PageHero from '../components/HomeComponents/PageHero.jsx'

export default function SearchPage() {
  const { games, query, source, sourceMessage } = useLoaderData()

  return (
    <div className="space-y-6">
      <PageHero
        description="La ricerca resta dentro lo stesso hub visivo ma cambia davvero i dati, cosi l esperienza resta fluida senza perdere contesto."
        eyebrow="Ricerca"
        featuredGame={games[0]}
        source={source}
        sourceMessage={sourceMessage}
        stats={[`${games.length} risultati`, 'Rotta parametrica']}
        title={`Risultati per "${query}"`}
      />

      <GameGrid
        emptyBody="Prova un altro titolo oppure torna alla home per ripartire dalla selezione principale."
        emptyTitle={`Nessun risultato per "${query}"`}
        games={games}
      />
    </div>
  )
}

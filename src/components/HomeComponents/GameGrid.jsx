import EmptyState from '../SharedComponents/EmptyState.jsx'
import GameCard from './GameCard.jsx'

export default function GameGrid({ games, emptyTitle, emptyBody }) {
  if (!games?.length) {
    return <EmptyState body={emptyBody} title={emptyTitle} />
  }

  return (
    <section aria-label="Games" className="grid gap-4 xl:grid-cols-2">
      {games.map((game) => (
        <GameCard game={game} key={game.id ?? game.slug} />
      ))}
    </section>
  )
}

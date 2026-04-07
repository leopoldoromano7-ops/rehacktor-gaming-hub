import { useContext, useEffect, useState } from 'react'
import supabase from '../../database/supabase.js'
import { UserContext } from '../../context/UserContext.jsx'
import EmptyState from '../SharedComponents/EmptyState.jsx'
import GameCard from './GameCard.jsx'

const FAVOURITES_TABLE = 'favourites'

export default function GameGrid({ games, emptyTitle, emptyBody }) {
  const { profile } = useContext(UserContext)
  const [favouriteIds, setFavouriteIds] = useState(() => new Set())
  const [updatingIds, setUpdatingIds] = useState(() => new Set())
  const [isLoadingFavourites, setIsLoadingFavourites] = useState(false)
  const [favouriteError, setFavouriteError] = useState('')

  useEffect(() => {
    let cancelled = false
    const gameIds = (games ?? []).map((game) => game.id).filter(Boolean)

    async function loadFavouriteIds() {
      if (!profile?.id || !gameIds.length) {
        setFavouriteIds(new Set())
        setIsLoadingFavourites(false)
        setFavouriteError('')
        return
      }

      setIsLoadingFavourites(true)
      setFavouriteError('')

      const { data, error } = await supabase
        .from(FAVOURITES_TABLE)
        .select('game_id')
        .eq('profile_id', profile.id)
        .in('game_id', gameIds)

      if (cancelled) {
        return
      }

      if (error) {
        setFavouriteIds(new Set())
        setFavouriteError('Non riesco a sincronizzare i preferiti in questo momento.')
        setIsLoadingFavourites(false)
        return
      }

      setFavouriteIds(new Set((data ?? []).map((item) => item.game_id)))
      setIsLoadingFavourites(false)
    }

    loadFavouriteIds()

    return () => {
      cancelled = true
    }
  }, [games, profile?.id])

  if (!games?.length) {
    return <EmptyState body={emptyBody} title={emptyTitle} />
  }

  async function handleToggleFavourite(game) {
    if (!profile?.id || !game?.id) {
      return
    }

    const gameId = game.id
    const isCurrentlyFavourite = favouriteIds.has(gameId)

    if (updatingIds.has(gameId)) {
      return
    }

    setFavouriteError('')
    setUpdatingIds((currentIds) => new Set(currentIds).add(gameId))
    setFavouriteIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (isCurrentlyFavourite) {
        nextIds.delete(gameId)
      } else {
        nextIds.add(gameId)
      }

      return nextIds
    })

    const { error } = isCurrentlyFavourite
      ? await supabase
          .from(FAVOURITES_TABLE)
          .delete()
          .eq('profile_id', profile.id)
          .eq('game_id', gameId)
      : await supabase
          .from(FAVOURITES_TABLE)
          .insert({
            profile_id: profile.id,
            game_id: gameId,
            game_name: game.name,
          })

    if (error) {
      setFavouriteIds((currentIds) => {
        const nextIds = new Set(currentIds)

        if (isCurrentlyFavourite) {
          nextIds.add(gameId)
        } else {
          nextIds.delete(gameId)
        }

        return nextIds
      })
      setFavouriteError(error.message || 'Non riesco ad aggiornare i preferiti in questo momento.')
    }

    setUpdatingIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.delete(gameId)
      return nextIds
    })
  }

  return (
    <div className="space-y-3">
      {favouriteError ? (
        <p className="text-sm leading-6 text-[#f4b7da]">{favouriteError}</p>
      ) : null}

      <section aria-label="Games" className="grid gap-4 xl:grid-cols-2">
        {games.map((game) => (
          <GameCard
            game={game}
            isFavourite={favouriteIds.has(game.id)}
            isFavouriteLoading={Boolean(profile?.id) && isLoadingFavourites && !updatingIds.has(game.id)}
            isUpdatingFavourite={updatingIds.has(game.id)}
            key={game.id ?? game.slug}
            onToggleFavourite={handleToggleFavourite}
            showFavouriteAction={Boolean(profile?.id)}
          />
        ))}
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { FiMessageSquare } from 'react-icons/fi'
import supabase from '../../database/supabase.js'

const FAVOURITES_TABLE = 'favourites'
const REVIEWS_TABLE = 'reviews'

export default function BodySection({ game, profile_id }) {
  const [isFavourite, setIsFavourite] = useState(false)
  const [isLoadingFavourite, setIsLoadingFavourite] = useState(true)
  const [isUpdatingFavourite, setIsUpdatingFavourite] = useState(false)
  const [favouriteError, setFavouriteError] = useState('')
  const [description, setDescription] = useState('')
  const [gameReviews, setGameReviews] = useState([])
  const [checkReview, setCheckReview] = useState(false)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')

  async function getFavourite() {
    if (!profile_id || !game?.id) {
      setIsLoadingFavourite(false)
      return
    }

    setIsLoadingFavourite(true)
    setFavouriteError('')

    const { data: favourites, error } = await supabase
      .from(FAVOURITES_TABLE)
      .select('*')
      .eq('profile_id', profile_id)
      .eq('game_id', game.id)

    if (error) {
      setFavouriteError('Non riesco a leggere i preferiti in questo momento.')
      setIsFavourite(false)
      setIsLoadingFavourite(false)
      return
    }

    setIsFavourite((favourites ?? []).length > 0)
    setIsLoadingFavourite(false)
  }

  async function addGame() {
    if (!profile_id || !game?.id || isUpdatingFavourite) {
      return
    }

    setIsUpdatingFavourite(true)
    setFavouriteError('')

    const { error } = await supabase
      .from(FAVOURITES_TABLE)
      .insert({
        profile_id,
        game_id: game.id,
        game_name: game.name,
      })

    if (error) {
      setFavouriteError(error.message || 'Non riesco ad aggiungere questo gioco ai preferiti.')
      setIsUpdatingFavourite(false)
      return
    }

    setIsFavourite(true)
    setIsUpdatingFavourite(false)
  }

  async function removeGame() {
    if (!profile_id || !game?.id || isUpdatingFavourite) {
      return
    }

    setIsUpdatingFavourite(true)
    setFavouriteError('')

    const { error } = await supabase
      .from(FAVOURITES_TABLE)
      .delete()
      .eq('profile_id', profile_id)
      .eq('game_id', game.id)

    if (error) {
      setFavouriteError(error.message || 'Non riesco a rimuovere questo gioco dai preferiti.')
      setIsUpdatingFavourite(false)
      return
    }

    setIsFavourite(false)
    setIsUpdatingFavourite(false)
  }

  function handleDescription(event) {
    setDescription(event.target.value)
  }

  async function getReviews() {
    if (!game?.id) {
      setIsLoadingReviews(false)
      return
    }

    setIsLoadingReviews(true)
    setReviewError('')

    const { data: reviews, error } = await supabase
      .from(REVIEWS_TABLE)
      .select('*')
      .order('id', { ascending: false })
      .eq('game_id', game.id)

    if (error) {
      setReviewError(error.message || 'Non riesco a leggere le recensioni di questo gioco.')
      setGameReviews([])
      setIsLoadingReviews(false)
      return
    }

    setGameReviews(reviews ?? [])
    setIsLoadingReviews(false)
  }

  async function addReview() {
    if (!profile_id || !game?.id || !description.trim() || isSubmittingReview) {
      return
    }

    setIsSubmittingReview(true)
    setReviewError('')

    const { error } = await supabase
      .from(REVIEWS_TABLE)
      .insert({
        profile_id,
        game_id: game.id,
        description: description.trim(),
      })

    if (error) {
      setReviewError(error.message || 'Non riesco a pubblicare la recensione in questo momento.')
      setIsSubmittingReview(false)
      return
    }

    setDescription('')
    await getReviews()
    setCheckReview((currentValue) => !currentValue)
    setIsSubmittingReview(false)
  }

  useEffect(() => {
    getFavourite()
    getReviews()
  }, [profile_id, game?.id, checkReview])

  return (
    <section className="grid gap-4 xl:[grid-template-columns:minmax(0,1.35fr)_320px]">
      <div className="surface-panel-soft rounded-sm border border-[#c084fc]/12 shadow-[0_16px_40px_rgba(5,5,16,0.34)]">
        <div className="flex items-center gap-2 border-b border-[#c084fc]/10 bg-[#231d58] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#d4b8ff] sm:px-5">
          <FiMessageSquare className="text-sm" />
          <span>Area recensioni</span>
        </div>

        <div className="p-5">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[#c084fc]">Lascia una recensione</p>
              <p className="mt-2 text-sm leading-6 text-[#ddd6fe]">
                Scrivi la tua recensione del gioco e leggi quelle che sono gia state lasciate dagli altri utenti.
              </p>
            </div>

            <textarea
              className="min-h-[180px] w-full rounded-sm border border-[#c084fc]/12 bg-[#0d0a22] px-4 py-3 text-sm text-white outline-none placeholder:text-[#9f93d0]"
              onChange={handleDescription}
              placeholder={`Scrivi qui cosa ne pensi di ${game.name}...`}
              value={description}
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="brand-secondary inline-flex rounded-sm px-4 py-2.5 text-sm font-semibold text-white"
                disabled={!description.trim() || isSubmittingReview}
                onClick={addReview}
                type="button"
              >
                {isSubmittingReview ? 'Invio...' : 'Pubblica recensione'}
              </button>
            </div>

            {reviewError ? (
              <p className="text-sm leading-6 text-[#f4b7da]">{reviewError}</p>
            ) : null}

            <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.22em] text-[#c084fc]">Recensioni del gioco</p>
                <span className="text-xs uppercase tracking-[0.18em] text-[#b4a9df]">
                  {gameReviews.length} totali
                </span>
              </div>

              {isLoadingReviews ? (
                <p className="mt-4 text-sm text-[#ddd6fe]">Sto caricando le recensioni...</p>
              ) : null}

              {!isLoadingReviews && !gameReviews.length ? (
                <p className="mt-4 text-sm text-[#ddd6fe]">
                  Nessuna recensione presente per questo gioco. Puoi essere il primo a lasciarne una.
                </p>
              ) : null}

              {gameReviews.length ? (
                <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto pr-1">
                  {gameReviews.map((review, index) => (
                    <article
                      className="rounded-sm border border-[#c084fc]/10 bg-[#120f31] p-3"
                      key={review.id ?? `${review.profile_id}-${review.game_id}-${index}`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b4a9df]">
                        Review {index + 1}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#f5f3ff]">{review.description}</p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <aside className="surface-panel-soft rounded-sm border border-[#c084fc]/12 shadow-[0_16px_40px_rgba(5,5,16,0.34)]">
        <div className="border-b border-[#c084fc]/10 bg-[#231d58] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#d4b8ff] sm:px-5">
          Preferiti
        </div>

        <div className="flex h-full flex-col gap-4 p-5">
          <p className="text-sm leading-6 text-[#ddd6fe]">
            Aggiungi o rimuovi questo gioco dai tuoi preferiti. Lo stato viene letto dal database al primo render della pagina.
          </p>

          <button
            className={[
              'inline-flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-sm border px-4 py-6 transition-colors',
              isFavourite
                ? 'border-[#ec4899]/35 bg-[#ec4899]/10 text-white'
                : 'border-[#c084fc]/14 bg-[#0d0a22] text-[#ddd6fe] hover:border-[#c084fc]/28 hover:bg-[#120f31]',
            ].join(' ')}
            disabled={isLoadingFavourite || isUpdatingFavourite}
            onClick={isFavourite ? removeGame : addGame}
            type="button"
          >
            {isFavourite ? (
              <FaHeart className="text-4xl text-[#ec4899]" />
            ) : (
              <FaRegHeart className="text-4xl text-[#c084fc]" />
            )}

            <span className="text-sm font-semibold uppercase tracking-[0.18em]">
              {isLoadingFavourite
                ? 'Controllo...'
                : isUpdatingFavourite
                  ? 'Aggiorno...'
                  : isFavourite
                    ? 'Rimuovi dai preferiti'
                    : 'Aggiungi ai preferiti'}
            </span>
          </button>

          <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-4 py-3 text-sm text-[#f5f3ff]">
            Stato attuale:{' '}
            <span className={isFavourite ? 'text-[#f4b7da]' : 'text-[#c084fc]'}>
              {isFavourite ? 'gioco presente nei preferiti' : 'gioco non presente nei preferiti'}
            </span>
          </div>

          {favouriteError ? (
            <p className="text-sm leading-6 text-[#f4b7da]">{favouriteError}</p>
          ) : null}
        </div>
      </aside>
    </section>
  )
}

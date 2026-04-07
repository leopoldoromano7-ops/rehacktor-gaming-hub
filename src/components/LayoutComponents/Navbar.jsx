import { forwardRef, startTransition, useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FiLogOut, FiUser, FiUserPlus } from 'react-icons/fi'
import { FaUserAstronaut } from 'react-icons/fa'
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import logo from '../../assets/logo2.svg'
import { UserContext } from '../../context/UserContext.jsx'
import supabase from '../../database/supabase.js'
import { getSearchSuggestionsPayload } from '../../services/rawg.js'
import { formatReleaseDate, getGenreNames, getToneFromSeed } from '../../utils/game-utils.js'
import { routes } from '../../router/routes.js'

const Navbar = forwardRef(function Navbar(_, ref) {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [suggestionsError, setSuggestionsError] = useState('')
  const searchRef = useRef(null)
  const avatarMenuRef = useRef(null)
  const debounceRef = useRef(null)
  const abortRef = useRef(null)
  const { user, profile, signOut } = useContext(UserContext)

  async function handleLogout() {
    setIsAvatarMenuOpen(false)
    await signOut()
    navigate(routes.home, { replace: true })
  }

  function getUserLabel() {
    return profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'Player'
  }

  function getNavClass(isActive) {
    return [
      'inline-flex h-10 items-center rounded-sm border px-4 text-sm font-medium uppercase tracking-[0.16em] transition-colors',
      isActive
        ? 'border-[#c084fc]/45 bg-[#8b5cf6]/18 text-white brand-highlight'
        : 'border-transparent bg-transparent text-[#e7ddff] hover:border-[#c084fc]/20 hover:bg-[#c084fc]/10 hover:text-white',
    ].join(' ')
  }

  function getSpotlightLinkClass(isActive) {
    return [
      'inline-flex h-11 items-center rounded-sm border px-4 text-sm font-medium transition-colors',
      isActive
        ? 'border-[#ec4899]/20 bg-[#ec4899]/12 text-white'
        : 'border-[#ec4899]/12 bg-transparent text-[#e7ddff] hover:border-[#ec4899]/24 hover:bg-[#211950] hover:text-white',
    ].join(' ')
  }

  function resetSuggestions() {
    setSuggestions([])
    setSuggestionsError('')
    setIsLoadingSuggestions(false)
  }

  function clearPendingSearch() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }

    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
  }

  function closeSuggestions() {
    setIsSearchOpen(false)
  }

  function toggleAvatarMenu() {
    setIsAvatarMenuOpen((currentValue) => !currentValue)
  }

  function scheduleSuggestionsSearch(nextQuery) {
    const trimmedQuery = nextQuery.trim()
    clearPendingSearch()

    if (trimmedQuery.length < 1) {
      resetSuggestions()
      return
    }

    setIsLoadingSuggestions(true)
    setSuggestionsError('')

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const results = await getSearchSuggestionsPayload(trimmedQuery, controller.signal)
        setSuggestions(results)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSuggestions([])
          setSuggestionsError('Suggerimenti non disponibili')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSuggestions(false)
        }
      }
    }, 180)
  }

  function handleQueryChange(event) {
    const nextQuery = event.target.value
    setQuery(nextQuery)
    scheduleSuggestionsSearch(nextQuery)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedQuery = query.trim()
    closeSuggestions()

    startTransition(() => {
      navigate(trimmedQuery ? routes.search(trimmedQuery) : routes.home)
    })
  }

  function handleSuggestionSelect(target) {
    clearPendingSearch()
    closeSuggestions()
    setQuery('')
    resetSuggestions()

    startTransition(() => {
      navigate(target)
    })
  }

  function getPrimaryGenre(game) {
    return getGenreNames(game)[0] || 'Genere n/d'
  }

  useEffect(() => {
    function handlePointerDown(event) {
      if (!searchRef.current?.contains(event.target)) {
        closeSuggestions()
      }

       if (!avatarMenuRef.current?.contains(event.target)) {
        setIsAvatarMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      clearPendingSearch()
    }
  }, [])

  useEffect(() => {
    let avatarObjectUrl

    async function downloadAvatar() {
      if (!profile?.avatar_url) {
        setAvatarUrl('')
        return
      }

      const { data } = await supabase.storage
        .from('avatars')
        .download(profile.avatar_url)

      if (data) {
        avatarObjectUrl = URL.createObjectURL(data)
        setAvatarUrl(avatarObjectUrl)
      }
    }

    downloadAvatar()

    return () => {
      if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl)
      }
    }
  }, [profile?.avatar_url])

  const showSuggestionsPanel = isSearchOpen && query.trim().length >= 1
  const currentSort = new URLSearchParams(location.search).get('sort') || 'catalog'

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-4 z-50 px-3 sm:top-6 sm:px-4 lg:px-6"
    >
      <header className="surface-panel mx-auto max-w-[1500px] border-b border-[#c084fc]/12 shadow-[0_18px_48px_rgba(5,5,16,0.55)] backdrop-blur">
        <div className="flex flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex flex-col gap-4 lg:flex-row lg:items-center">
              <Link className="group flex min-w-0 items-center gap-3 sm:gap-4" to={routes.home}>
                <img alt="Rehacktor logo" className="h-16 w-16 object-contain sm:h-20 sm:w-20" src={logo} />
                <span className="flex min-w-0 flex-col">
                  <small className="text-[0.68rem] uppercase tracking-[0.4em] text-[#c084fc]">
                    rehacktor pulse
                  </small>
                  <strong className="font-display text-[1.55rem] uppercase leading-none tracking-[0.08em] text-white sm:text-[1.9rem]">
                    Rehacktor
                  </strong>
                </span>
              </Link>

              <nav aria-label="Primary" className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <NavLink className={({ isActive }) => getNavClass(isActive)} end to={routes.home}>
                  Catalogo
                </NavLink>
                <Link
                  className={getSpotlightLinkClass(currentSort === 'trending')}
                  to="/?sort=trending"
                >
                  Trending now
                </Link>
                <Link
                  className={getSpotlightLinkClass(currentSort === 'top-rated')}
                  to="/?sort=top-rated"
                >
                  Top rated
                </Link>
                {!user ? (
                  <>
                    <NavLink className={({ isActive }) => getNavClass(isActive)} end to={routes.register}>
                      <span className="inline-flex items-center gap-2">
                        <FiUserPlus className="text-base" />
                      </span>
                    </NavLink>
                    <NavLink className={({ isActive }) => getNavClass(isActive)} end to={routes.login}>
                      <span className="inline-flex items-center gap-2">
                        <HiOutlineArrowRightOnRectangle className="text-base" />
                      </span>
                    </NavLink>
                  </>
                ) : null}
              </nav>
            </div>

            <form className="flex w-full flex-col gap-2 xl:w-auto xl:min-w-[25rem]" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="game-search">
                Cerca un gioco
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1" ref={searchRef}>
                  <div className="flex w-full flex-col overflow-hidden rounded-sm border border-[#8b5cf6]/35 bg-[#110f2d] min-[480px]:flex-row min-[480px]:items-center">
                    <input
                      id="game-search"
                      autoComplete="off"
                      className="h-11 w-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#a59bd4]"
                      name="query"
                      onChange={handleQueryChange}
                      onFocus={() => setIsSearchOpen(true)}
                      placeholder="cerca nel catalogo"
                      type="search"
                      value={query}
                    />
                    <button className="brand-primary inline-flex h-11 w-full items-center justify-center px-5 text-sm font-semibold text-[#130f2c] min-[480px]:w-auto" type="submit">
                      Cerca
                    </button>
                  </div>

                  {showSuggestionsPanel ? (
                    <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-sm border border-[#8b5cf6]/25 bg-[#140f32] shadow-[0_22px_56px_rgba(5,5,16,0.62)]">
                      {isLoadingSuggestions ? (
                        <div className="flex items-center gap-3 px-4 py-4 text-sm text-[#f5f3ff]">
                          <span className="loading loading-spinner loading-sm text-[#c084fc]" />
                          <span>Sto cercando i giochi...</span>
                        </div>
                      ) : null}

                      {!isLoadingSuggestions && suggestionsError ? (
                        <div className="px-4 py-4 text-sm text-[#f4b7da]">{suggestionsError}</div>
                      ) : null}

                      {!isLoadingSuggestions && !suggestionsError && suggestions.length ? (
                        <div className="max-h-[22rem] overflow-y-auto py-2">
                          {suggestions.map((game) => (
                            <button
                              className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-[#211950]"
                              key={game.id ?? game.slug}
                              onClick={() => handleSuggestionSelect(routes.detail(game.id))}
                              type="button"
                            >
                              <span className="h-14 w-24 flex-none overflow-hidden rounded-sm border border-[#c084fc]/14 bg-[#0b091e]">
                                {game.background_image ? (
                                  <img
                                    alt={game.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                    src={game.background_image}
                                  />
                                ) : (
                                  <span
                                    className="flex h-full w-full items-end p-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                                    style={{ background: getToneFromSeed(game.slug || game.name) }}
                                  >
                                    {game.name.slice(0, 12)}
                                  </span>
                                )}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-white">{game.name}</span>
                                <span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-[#c084fc]">
                                  {getPrimaryGenre(game)}
                                </span>
                                <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-[#b4a9df]">
                                  {formatReleaseDate(game.released)}
                                </span>
                              </span>

                              <span className="rounded-sm bg-[#0b091e] px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c084fc]">
                                gioco
                              </span>
                            </button>
                          ))}

                          <div className="border-t border-[#c084fc]/10 px-3 pt-2">
                            <button
                              className="w-full rounded-sm px-3 py-3 text-left text-sm font-medium text-[#c084fc] transition-colors hover:bg-[#211950]"
                              onClick={() => handleSuggestionSelect(routes.search(query.trim()))}
                              type="button"
                            >
                              Vedi tutti i risultati per "{query.trim()}"
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {!isLoadingSuggestions && !suggestionsError && !suggestions.length ? (
                        <div className="px-4 py-4 text-sm text-[#b4a9df]">
                          Nessun gioco trovato con queste lettere.
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {user ? (
                  <>
                    <div className="relative flex-none self-end sm:self-auto" ref={avatarMenuRef}>
                      <button
                        aria-label="Apri menu utente"
                        className="brand-highlight flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#ec4899]/22 bg-[#1f173f]"
                        onClick={toggleAvatarMenu}
                        type="button"
                      >
                        {avatarUrl ? (
                          <img
                            alt={getUserLabel()}
                            className="h-full w-full object-cover"
                            src={avatarUrl}
                          />
                        ) : (
                          <FaUserAstronaut className="text-xl text-[#f4b7da]" />
                        )}
                      </button>

                      {isAvatarMenuOpen ? (
                        <div className="absolute right-0 top-full z-40 mt-2 min-w-[13rem] overflow-hidden rounded-sm border border-[#8b5cf6]/25 bg-[#140f32] shadow-[0_22px_56px_rgba(5,5,16,0.62)]">
                          <div className="border-b border-[#c084fc]/10 px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">
                              Utente
                            </p>
                            <p className="mt-1 truncate text-sm font-medium text-white">
                              {getUserLabel()}
                            </p>
                          </div>

                          <Link
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#f5f3ff] transition-colors hover:bg-[#211950]"
                            onClick={() => setIsAvatarMenuOpen(false)}
                            to={routes.profile}
                          >
                            <FiUser className="text-base text-[#c084fc]" />
                            <span>Profilo</span>
                          </Link>

                          <button
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#f5f3ff] transition-colors hover:bg-[#211950]"
                            onClick={handleLogout}
                            type="button"
                          >
                            <FiLogOut className="text-base text-[#f4b7da]" />
                            <span>Logout</span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </header>
    </div>
  )
})

export default Navbar

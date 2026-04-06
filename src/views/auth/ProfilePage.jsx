import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUserAstronaut } from 'react-icons/fa'
import { FiHeart, FiMail, FiShield, FiUser } from 'react-icons/fi'
import Miranda from '../../assets/miranda.jpg'
import supabase from '../../database/supabase.js'
import { UserContext } from '../../context/UserContext.jsx'
import { routes } from '../../router/routes.js'

const FAVOURITES_TABLE = 'favourites'

export default function ProfilePage() {
  const { user, profile } = useContext(UserContext)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [userFavourites, setUserFavourites] = useState([])
  const [isLoadingFavourites, setIsLoadingFavourites] = useState(false)
  const [favouritesError, setFavouritesError] = useState('')

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

  useEffect(() => {
    async function getFavourites() {
      if (!profile?.id) {
        setUserFavourites([])
        return
      }

      setIsLoadingFavourites(true)
      setFavouritesError('')

      const { data: favourites, error } = await supabase
        .from(FAVOURITES_TABLE)
        .select('*')
        .eq('profile_id', profile.id)

      if (error) {
        setFavouritesError('Non riesco a leggere i giochi preferiti in questo momento.')
        setUserFavourites([])
        setIsLoadingFavourites(false)
        return
      }

      setUserFavourites(favourites ?? [])
      setIsLoadingFavourites(false)
    }

    getFavourites()
  }, [profile?.id])

  const displayName = profile?.username || user?.user_metadata?.username || user?.email || 'Player'
  const shortId = user?.id ? `${user.id.slice(0, 8)}...` : 'n/a'

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="w-full max-w-md rounded-sm border border-[#c084fc]/15 bg-[#110f2d] p-8 text-center shadow-[0_18px_40px_rgba(5,5,16,0.38)]">
          <h2 className="text-2xl font-bold text-white">Profilo non disponibile</h2>
          <p className="mt-3 text-[#c084fc]">
            Effettua il login per vedere il tuo profilo.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              className="brand-primary rounded-sm px-4 py-2 font-semibold text-[#130f2c]"
              to={routes.login}
            >
              Login
            </Link>
            <Link
              className="rounded-sm border border-[#c084fc]/20 px-4 py-2 font-semibold text-white"
              to={routes.register}
            >
              Register
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="px-4 py-6 sm:px-0">
      <section className="surface-panel overflow-hidden rounded-sm border border-[#c084fc]/12 shadow-[0_20px_52px_rgba(5,5,16,0.42)]">
        <div className="border-b border-[#c084fc]/10 bg-[#231d58] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#d4b8ff]">
          Player profile
        </div>

        <div className="grid gap-px bg-[#c084fc]/10 xl:[grid-template-columns:380px_minmax(0,1fr)]">
          <aside className="surface-panel-soft flex flex-col items-center gap-5 p-6">
            <div className="brand-highlight flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-[#ec4899]/25 bg-[#1f173f]">
              <img
                alt="Profile"
                className="h-full w-full object-cover"
                src={avatarUrl || Miranda}
              />
            </div>

            <div className="space-y-2 text-center">
              <span className="inline-flex items-center gap-2 rounded-sm border border-[#ec4899]/20 bg-[#ec4899]/12 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#f4b7da]">
                <FaUserAstronaut className="text-sm" />
                Signed in
              </span>
              <h1 className="font-display text-4xl leading-none text-white">{displayName}</h1>
              <p className="text-sm text-[#b4a9df]">Profilo personale collegato al tuo account Supabase.</p>
            </div>

            <div className="grid w-full gap-3">
              <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Account id</p>
                <p className="mt-1 text-sm text-white">{shortId}</p>
              </div>
              <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Provider</p>
                <p className="mt-1 text-sm text-white">Supabase Auth</p>
              </div>
              <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Favourite games</p>
                <p className="mt-1 text-sm text-white">{userFavourites.length}</p>
              </div>
            </div>
          </aside>

          <div className="space-y-4 bg-[linear-gradient(180deg,#241d59_0%,#0f0b29_100%)] p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] p-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-sm bg-[#8b5cf6]/12 p-2 text-[#c084fc]">
                    <FiUser />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Username</p>
                    <p className="mt-1 text-sm text-white">{profile?.username || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] p-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-sm bg-[#8b5cf6]/12 p-2 text-[#c084fc]">
                    <FiMail />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Email</p>
                    <p className="mt-1 text-sm text-white">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] p-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-sm bg-[#8b5cf6]/12 p-2 text-[#c084fc]">
                    <FiShield />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Status</p>
                    <p className="mt-1 text-sm text-white">{user.email_confirmed_at ? 'Confirmed' : 'Pending verify'}</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] p-5">
              <h2 className="font-display text-2xl text-white">Profile Details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Display name</p>
                  <p className="mt-1 text-base text-white">{displayName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Email</p>
                  <p className="mt-1 text-base text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Username profile</p>
                  <p className="mt-1 text-base text-white">{profile?.username || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">User id</p>
                  <p className="mt-1 text-base text-white">{shortId}</p>
                </div>
              </div>
            </section>

            <section className="rounded-sm border border-[#c084fc]/10 bg-[#0d0a22] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-white">Favourite Games</h2>
                  <p className="mt-1 text-sm text-[#b4a9df]">
                    Elenco completo dei giochi che hai salvato tra i preferiti.
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-sm border border-[#ec4899]/20 bg-[#ec4899]/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#f4b7da]">
                  <FiHeart className="text-sm" />
                  <span>{userFavourites.length} salvati</span>
                </span>
              </div>

              {isLoadingFavourites ? (
                <p className="mt-5 text-sm text-[#ddd6fe]">Sto caricando i tuoi giochi preferiti...</p>
              ) : null}

              {favouritesError ? (
                <p className="mt-5 text-sm text-[#f4b7da]">{favouritesError}</p>
              ) : null}

              {!isLoadingFavourites && !favouritesError && !userFavourites.length ? (
                <div className="mt-5 rounded-sm border border-[#c084fc]/10 bg-[#120f31] px-4 py-4 text-sm text-[#ddd6fe]">
                  Non hai ancora aggiunto giochi ai preferiti.
                </div>
              ) : null}

              {userFavourites.length ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {userFavourites.map((favourite) => (
                    <Link
                      className="rounded-sm border border-[#c084fc]/10 bg-[linear-gradient(180deg,#120f31_0%,#0d0a22_100%)] p-4 shadow-[0_12px_28px_rgba(5,5,16,0.24)] transition-colors hover:border-[#ec4899]/22 hover:bg-[#18133c]"
                      key={`${favourite.profile_id}-${favourite.game_id}`}
                      to={routes.detail(favourite.game_id)}
                    >
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#b4a9df]">Favourite game</p>
                      <h3 className="mt-3 font-display text-2xl leading-none text-white">
                        {favourite.game_name}
                      </h3>
                      <p className="mt-3 text-sm text-[#c084fc]">Apri dettaglio #{favourite.game_id}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>

            <div className="flex flex-wrap gap-3">
              <Link className="rounded-sm border border-[#c084fc]/20 px-4 py-2.5 font-semibold text-white" to={routes.profile_settings}>
                Modifica
              </Link>
              <Link className="brand-primary rounded-sm px-4 py-2.5 font-semibold text-[#130f2c]" to={routes.home}>
                Torna alla home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

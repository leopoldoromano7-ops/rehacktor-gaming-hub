import { useContext } from 'react'
import { Link, useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import DetailGroup from '../components/DetailComponents/DetailGroup.jsx'
import Header from '../components/DetailComponents/Header.jsx'
import BodySection from '../components/GameDetailComponents/BodySection.jsx'
import centraleNucleareAnimat from '../assets/centrale_nucleare_animat.svg'
import {
  getGameDescription,
  getGenreNames,
  getPeopleNames,
  getPlatformNames,
  getTagNames,
} from '../utils/game-utils.js'
import { routes } from '../router/routes.js'
import { UserContext } from '../context/UserContext.jsx'

export default function DetailPage() {
  const { game, screenshots = [], source, sourceMessage } = useLoaderData()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const { profile } = useContext(UserContext)
  const isNavigating = navigation.state !== 'idle'
  const description =
    getGameDescription(game) ||
    'Descrizione non disponibile, ma la struttura della pagina e pronta per gestire dati completi, preferiti e recensioni.'
  const genres = getGenreNames(game)
  const platforms = getPlatformNames(game)
  const developers = getPeopleNames(game.developers)
  const publishers = getPeopleNames(game.publishers)
  const tags = getTagNames(game).slice(0, 8)
  const backdropImage =
    screenshots[0] ||
    game.background_image ||
    game.background_image_additional ||
    ''

  return (
    <main className="min-h-screen bg-[#050510] text-base-content" data-theme="night">
      {isNavigating ? (
        <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-[#050510]/30 backdrop-blur-[1px]">
          <div className="flex items-center justify-center">
            <img
              alt="Loading animation"
              className="h-50 w-50 object-contain sm:h-50 sm:w-50"
              src={centraleNucleareAnimat}
            />
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {backdropImage ? (
          <div
            className="absolute inset-0 scale-[1.04] bg-cover bg-center opacity-24 blur-sm"
            style={{ backgroundImage: `url(${backdropImage})` }}
          />
        ) : null}
        <div className="app-backdrop absolute inset-0" />
        <div className="app-grid absolute inset-0" />
        <div className="absolute left-[-12rem] top-[-3rem] h-72 w-72 rounded-full bg-[#8b5cf6]/24 blur-3xl" />
        <div className="absolute right-[-8rem] top-24 h-56 w-56 rounded-full bg-[#ec4899]/12 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[#1e1b4b]/70 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-0 pb-10 pt-5 sm:px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-sm border border-[#ec4899]/16 bg-[#120f31]/88 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#f5f3ff] transition-colors hover:border-[#ec4899]/30 hover:bg-[#211950]"
              onClick={() => navigate(-1)}
              type="button"
            >
              <FiArrowLeft className="text-sm" />
              <span>Torna indietro</span>
            </button>

            <Link
              className="inline-flex items-center rounded-sm border border-[#c084fc]/14 bg-[#1e1b4b]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#ddd6fe] transition-colors hover:border-[#c084fc]/30 hover:text-white"
              to={routes.home}
            >
              Torna al catalogo
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <Header game={game} images={screenshots} source={source} sourceMessage={sourceMessage} />

          <section className="surface-panel-soft rounded-sm border border-[#c084fc]/12 p-6 shadow-[0_16px_40px_rgba(5,5,16,0.34)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c084fc]">About this game</p>
            <p className="mt-4 max-w-5xl text-base leading-8 text-[#f5f3ff]">{description}</p>
          </section>

          {profile ? <BodySection game={game} profile_id={profile.id} /> : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <DetailGroup items={genres} title="Generi" />
            <DetailGroup items={platforms} title="Piattaforme" />
            <DetailGroup items={developers} title="Sviluppatori" />
            <DetailGroup items={publishers} title="Publisher" />
            <DetailGroup items={tags} title="Tag" />
            <section className="surface-panel-soft rounded-sm border border-[#c084fc]/12 shadow-[0_12px_30px_rgba(5,5,16,0.32)]">
              <div className="flex h-full flex-col justify-center gap-3 p-5">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#ec4899]/16 bg-[#120f31]/88 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#f5f3ff] transition-colors hover:border-[#ec4899]/30 hover:bg-[#211950]"
                  onClick={() => navigate(-1)}
                  type="button"
                >
                  <FiArrowLeft className="text-sm" />
                  <span>Torna indietro</span>
                </button>

                <Link
                  className="inline-flex items-center justify-center rounded-sm border border-[#c084fc]/14 bg-[#1e1b4b]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#ddd6fe] transition-colors hover:border-[#c084fc]/30 hover:text-white"
                  to={routes.home}
                >
                  Torna al catalogo
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

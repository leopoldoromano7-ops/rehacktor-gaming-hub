import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigation, useRouteLoaderData } from 'react-router-dom'
import { routes } from '../../router/routes.js'
import centraleNucleareAnimat from '../../assets/centrale_nucleare_animat.svg'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const rootData = useRouteLoaderData('root') ?? {}
  const { genres = [], source = 'rawg', sourceMessage = 'Generi e dati live da RAWG.' } = rootData
  const navbarRef = useRef(null)
  const [navbarHeight, setNavbarHeight] = useState(124)
  const isNavigating = navigation.state !== 'idle'
  const isAuthFormPage = pathname === routes.register || pathname === routes.login
  const isAuthPage =
    isAuthFormPage ||
    pathname === routes.profile ||
    pathname === routes.profile_settings
  const navbarGap = 30
  const layoutTopOffset = navbarHeight + navbarGap

  useEffect(() => {
    if (!navbarRef.current) {
      return undefined
    }

    const element = navbarRef.current
    const updateNavbarHeight = () => {
      setNavbarHeight(element.getBoundingClientRect().height)
    }

    updateNavbarHeight()

    const observer = new ResizeObserver(() => {
      updateNavbarHeight()
    })

    observer.observe(element)
    window.addEventListener('resize', updateNavbarHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateNavbarHeight)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#050510] text-base-content" data-theme="night">
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
        <div className="app-backdrop absolute inset-0" />
        <div className="app-grid absolute inset-0" />
        <div className="absolute left-[-12rem] top-[-3rem] h-72 w-72 rounded-full bg-[#8b5cf6]/24 blur-3xl" />
        <div className="absolute right-[-8rem] top-24 h-56 w-56 rounded-full bg-[#ec4899]/12 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[#1e1b4b]/70 blur-3xl" />
      </div>

      <div
        className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-3 pb-6 sm:px-4 lg:px-6"
        style={{ paddingTop: `${layoutTopOffset}px` }}
      >
        <Navbar ref={navbarRef} />

        <main className={isAuthPage ? 'flex-1' : 'grid gap-4 lg:items-start lg:[grid-template-columns:280px_minmax(0,1fr)]'}>
          {!isAuthPage ? <Sidebar genres={genres} source={source} sourceMessage={sourceMessage} topOffset={layoutTopOffset} /> : null}
          <section className={isAuthPage ? 'min-w-0 flex-1' : 'min-w-0'}>
            <Outlet />
          </section>
        </main>

        {isAuthPage ? (
          <Footer />
        ) : (
          <div className="grid mt-3 gap-4 lg:[grid-template-columns:280px_minmax(0,1fr)]">
            <div className="hidden lg:block" />
            <Footer className="lg:mt-0" />
          </div>
        )}
      </div>
    </div>
  )
}

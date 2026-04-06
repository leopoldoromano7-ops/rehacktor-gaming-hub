import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/LayoutComponents/Layout.jsx'
import DetailPage from '../views/DetailPage.jsx'
import GenrePage from '../views/GenrePage.jsx'
import HomePage from '../views/HomePage.jsx'
import SearchPage from '../views/SearchPage.jsx'
import LoginPage from '../views/auth/LoginPage.jsx'
import ProfilePage from '../views/auth/ProfilePage.jsx'
import ProfileSettingsPage from '../views/auth/ProfileSettingPage.jsx'
import RegisterPage from '../views/auth/RegisterPage.jsx'
import { getGameDetails, genreLoader, homeLoader, rootLoader, searchLoader } from './loaders.jsx'
import { routePaths } from './routes.js'

export const router = createBrowserRouter([
  {
    path: routePaths.home,
    id: 'root',
    loader: rootLoader,
    Component: Layout,
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: HomePage,
      },
      {
        path: routePaths.search,
        loader: searchLoader,
        Component: SearchPage,
      },
      {
        path: routePaths.genre,
        loader: genreLoader,
        Component: GenrePage,
      },
      {
        path: routePaths.register,
        Component: RegisterPage,
      },
      {
        path: routePaths.login,
        Component: LoginPage,
      },
      {
        path: routePaths.profile,
        Component: ProfilePage,
      },
      {
        path: routePaths.profile_settings,
        Component: ProfileSettingsPage,
      }
    ],
  },
  {
    path: routePaths.detail,
    loader: getGameDetails,
    Component: DetailPage,
  },
])

export default router

import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.jsx'
import { UserContextProvider } from './context/UserContext.jsx'

export default function App() {
  return (
    <>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </>
  )
}

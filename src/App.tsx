import { RouterProvider } from 'react-router-dom'
import { router } from '@/core/router.tsx'
import { AuthProvider } from '@/store/authContext.tsx'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App

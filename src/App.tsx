import AppRouters from '@/router.tsx'
import { AuthProvider } from '@/store/authContext.tsx'

function App() {
  return (
    <AuthProvider>
      <AppRouters />
    </AuthProvider>
  )
}

export default App

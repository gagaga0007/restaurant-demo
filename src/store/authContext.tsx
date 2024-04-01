import { createContext, PropsWithChildren, useContext, useState } from 'react'

interface AuthProps {
  userName: string
  setUserName: (value?: string) => void
  roomNumber: string
  setRoomNumber: (value?: string) => void
}

const AuthContext = createContext<AuthProps>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userName, setUserName] = useState<string>()
  const [roomNumber, setRoomNumber] = useState<string>()

  return (
    <AuthContext.Provider
      value={{
        userName,
        setUserName,
        roomNumber,
        setRoomNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const auth = useContext(AuthContext)
  if (!auth) {
    return null
  }
  return auth
}

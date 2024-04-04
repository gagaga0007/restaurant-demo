import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react'
import { UserTypeEnum } from '@/model/interface/base.ts'

interface AuthProps {
  userName: string
  setUserName: (value?: string) => void
  roomNumber: string
  setRoomNumber: (value?: string) => void
  userType: UserTypeEnum
  setUserType: (value?: UserTypeEnum) => void
  onLogout: () => void
}

const AuthContext = createContext<AuthProps>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userName, setUserName] = useState<string>()
  const [roomNumber, setRoomNumber] = useState<string>()
  const [userType, setUserType] = useState<UserTypeEnum>()

  const onLogout = useCallback(() => {
    setUserName(undefined)
    setRoomNumber(undefined)
    setUserType(undefined)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        userName,
        setUserName,
        roomNumber,
        setRoomNumber,
        userType,
        setUserType,
        onLogout,
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

import { Outlet, useNavigate } from 'react-router-dom'
import { useMount } from 'ahooks'
import { useAuth } from '@/store/authContext.tsx'

const IndexPage = () => {
  const { userName, roomNumber } = useAuth()
  const navigate = useNavigate()

  useMount(() => {
    if (!userName && !roomNumber) {
      navigate('/user-login')
    }
  })

  return (
    <>
      <Outlet />
    </>
  )
}

export default IndexPage

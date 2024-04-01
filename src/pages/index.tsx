import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useMount } from 'ahooks'
import { useAuth } from '@/store/authContext.tsx'
import { routes } from '@/core/routes.ts'
import { Layout } from 'antd'
import { BaseHeader } from '@/components/base/baseHeader.tsx'
import { BaseSider } from '@/components/base/baseSider.tsx'
import { useMemo } from 'react'

const { Content } = Layout

const IndexPage = () => {
  const { userName } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isAdminPage = useMemo(() => {
    return location.pathname.includes('admin')
  }, [location.pathname])

  useMount(() => {
    if (!userName) {
      navigate(`/${routes.LOGIN}`)
    }
  })

  return (
    <Layout style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <BaseHeader />
      <Layout>
        {isAdminPage && <BaseSider />}
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default IndexPage

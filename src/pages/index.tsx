import { Outlet, useNavigate } from 'react-router-dom'
import { useMount } from 'ahooks'
import { useAuth } from '@/store/authContext.tsx'
import { routes } from '@/core/routes.ts'
import { Layout } from 'antd'
import { BaseHeader } from '@/components/base/baseHeader.tsx'
import { BaseSider } from '@/components/base/baseSider.tsx'
import { useMemo } from 'react'
import { UserTypeEnum } from '@/model/interface/base.ts'

const { Content } = Layout

const IndexPage = () => {
  const { userName, userType } = useAuth()
  const navigate = useNavigate()

  const isAdminPage = useMemo(() => {
    return userType === UserTypeEnum.ADMIN
  }, [userType])

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

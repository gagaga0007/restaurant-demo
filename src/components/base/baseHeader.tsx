import { Button, Layout, Space, Tooltip, Typography } from 'antd'
import { useAuth } from '@/store/authContext.tsx'
import { LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/core/routes.ts'
import { UserTypeEnum } from '@/model/interface/base.ts'

const { Header } = Layout

export const BaseHeader = () => {
  const navigate = useNavigate()
  const { userName, onLogout, userType } = useAuth()

  const logout = () => {
    onLogout()
    navigate(`/${routes.LOGIN}`)
  }

  return (
    <Header
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography.Text style={{ color: '#ffffff', fontSize: 26, letterSpacing: '4px', fontWeight: 'bold' }}>
        LOGO
      </Typography.Text>
      <Space size={16}>
        <Typography.Text style={{ color: '#ffffff' }}>
          ようこそ，{userName}
          {userType === UserTypeEnum.CUSTOMER ? ' 様' : ''}
        </Typography.Text>
        <Tooltip placement="bottom" title="ログアウト">
          <Button type="primary" ghost shape="circle" danger size="small" icon={<LogoutOutlined />} onClick={logout} />
        </Tooltip>
      </Space>
    </Header>
  )
}

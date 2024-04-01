import { Button, Layout, Space, Tooltip, Typography } from 'antd'
import { useAuth } from '@/store/authContext.tsx'
import { LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/core/routes.ts'

const { Header } = Layout

export const BaseHeader = () => {
  const navigate = useNavigate()
  const { userName, setUserName, setRoomNumber } = useAuth()

  const onLogout = () => {
    setUserName(undefined)
    setRoomNumber(undefined)
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
        xxx酒店
      </Typography.Text>
      <Space size={16}>
        <Typography.Text style={{ color: '#ffffff' }}>欢迎，{userName}</Typography.Text>
        <Tooltip placement="bottom" title="退出登录">
          <Button
            type="primary"
            ghost
            shape="circle"
            danger
            size="small"
            icon={<LogoutOutlined />}
            onClick={onLogout}
          />
        </Tooltip>
      </Space>
    </Header>
  )
}

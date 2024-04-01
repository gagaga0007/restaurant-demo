/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Button, Card, Divider, Space, Typography } from 'antd'
import { useState } from 'react'
import BgImg from '@/assets/userLoginBgImg.jpeg'
import { RightOutlined } from '@ant-design/icons'
import { AdminLogin } from '@/components/login/adminLogin.tsx'
import { CustomerLogin } from '@/components/login/customerLogin.tsx'
import { useAuth } from '@/store/authContext.tsx'

const LoginPage = () => {
  const { setUserName, setRoomNumber } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  const onChangeUserType = () => {
    setUserName(undefined)
    setRoomNumber(undefined)
    setIsAdmin((value) => !value)
  }

  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #fafafa;
        background-image: url('${BgImg}');
        background-size: cover;
        background-repeat: no-repeat;
      `}
    >
      <Card
        css={css`
          width: 25%;
          box-shadow: rgba(0, 0, 0, 0.12) 0 0 35px 15px;
        `}
      >
        <Typography.Title
          css={css`
            margin: 0;
            letter-spacing: 6px;
            text-align: center;
          `}
          level={2}
        >
          XXX酒店{isAdmin ? '管理员登录' : '餐位预定'}
        </Typography.Title>
        <Divider />
        {isAdmin ? <AdminLogin /> : <CustomerLogin />}
      </Card>
      <Button type="link" onClick={onChangeUserType}>
        <Space>
          <span>切换至{!isAdmin ? '管理员' : '顾客'}</span>
          <RightOutlined />
        </Space>
      </Button>
    </div>
  )
}

export default LoginPage

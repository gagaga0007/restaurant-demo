/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Button, Card, Divider, Space, Typography } from 'antd'
import { useState } from 'react'
import BgImg from '@/assets/userLoginBgImg.jpeg'
import { RightOutlined } from '@ant-design/icons'
import { AdminLogin } from '@/components/login/adminLogin.tsx'
import { CustomerLogin } from '@/components/login/customerLogin.tsx'
import { useAuth } from '@/store/authContext.tsx'
import { Config } from '@/core/config.ts'

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
          width: 30%;
          box-shadow: rgba(0, 0, 0, 0.12) 0 0 35px 15px;

          @media screen and (max-width: ${Config.MOBILE_WIDTH}px) {
            width: 96%;
            margin: 0 2%;
          }
        `}
      >
        <Typography.Title
          css={css`
            margin: 0;
            letter-spacing: 2px;
            text-align: center;

            @media screen and (max-width: ${Config.MOBILE_WIDTH}px) {
              font-size: 22px !important;
            }
          `}
          level={3}
        >
          雲仙みかどホテル{isAdmin ? '管理者のログイン' : '食事の予約'}
        </Typography.Title>
        <Divider />
        {isAdmin ? <AdminLogin /> : <CustomerLogin />}
      </Card>
      <Button type="link" onClick={onChangeUserType}>
        <Space>
          <span>{!isAdmin ? '管理者' : 'お客様'}側に切り替える</span>
          <RightOutlined />
        </Space>
      </Button>
    </div>
  )
}

export default LoginPage

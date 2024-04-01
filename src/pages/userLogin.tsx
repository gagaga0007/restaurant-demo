/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Card, Divider, Typography } from 'antd'
import { useState } from 'react'
import { OrderEditor } from '@/components/userLogin/orderEditor.tsx'
import { LoginEditor } from '@/components/userLogin/loginEditor.tsx'
import BgImg from '@/assets/userLoginBgImg.jpeg'

const UserLogin = () => {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
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
          XXX酒店餐位预定
        </Typography.Title>
        <Divider />
        {isLogin ? <OrderEditor setIsLogin={setIsLogin} /> : <LoginEditor setIsLogin={setIsLogin} />}
      </Card>
    </div>
  )
}

export default UserLogin

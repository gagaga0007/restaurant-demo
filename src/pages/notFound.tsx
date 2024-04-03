import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/core/routes.ts'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404 Not Found"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate(`/${routes.LOGIN}`)}>
          Back to login
        </Button>
      }
      style={{ height: '100vh', display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    />
  )
}

export default NotFoundPage

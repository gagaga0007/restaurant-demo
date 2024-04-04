import AppRouters from '@/router.tsx'
import { AuthProvider } from '@/store/authContext.tsx'
import 'dayjs/locale/ja.js'
import locale from 'antd/locale/ja_JP.js'
import dayjs from 'dayjs'
import { ConfigProvider } from 'antd'

dayjs.locale('ja')

function App() {
  return (
    <ConfigProvider locale={locale}>
      <AuthProvider>
        <AppRouters />
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App

import AppRouters from '@/router.tsx'
import { AuthProvider } from '@/store/authContext.tsx'
import 'dayjs/locale/ja.js'
import locale from 'antd/locale/ja_JP.js'
import dayjs from 'dayjs'
import { ConfigProvider } from 'antd'
import { Config } from '@/core/config.ts'

dayjs.locale('ja')

function App() {
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          // lg
          screenLG: Config.MOBILE_WIDTH, // List
          screenLGMin: Config.MOBILE_WIDTH, // Row/Col
        },
      }}
    >
      <AuthProvider>
        <AppRouters />
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App

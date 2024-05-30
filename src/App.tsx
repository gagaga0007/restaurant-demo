import AppRouters from '@/router.tsx'
import { AuthProvider } from '@/store/authContext.tsx'
import 'dayjs/locale/ja.js'
import utc from 'dayjs/plugin/utc.js'
import locale from 'antd/locale/ja_JP.js'
import dayjs from 'dayjs'
import { ConfigProvider, App as AntdApp } from 'antd'
import { Config } from '@/core/config.ts'

dayjs.locale('ja')
dayjs.extend(utc)

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
      <AntdApp>
        <AuthProvider>
          <AppRouters />
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App

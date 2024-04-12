/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Layout, Menu, MenuProps } from 'antd'
import { routes } from '@/core/routes.ts'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { EditOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Config } from '@/core/config.ts'

const { Sider } = Layout

const siderMenu: Required<MenuProps>['items'][number][] = [
  { key: `/${routes.LAYOUT_EDIT}`, label: 'レイアウト変更', icon: <EditOutlined /> },
  { key: `/${routes.ORDER_LIST}`, label: '予覧リスト', icon: <UnorderedListOutlined /> },
]

export const BaseSider = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // const [siderCollapsed, setSiderCollapsed] = useState(false)

  const onChangeMenu = (key: string) => {
    if (key !== location.pathname) {
      navigate(key)
    }
  }

  const selectKeys = useMemo(() => [location.pathname], [location.pathname])

  return (
    <Sider
      // collapsible
      // collapsed={siderCollapsed}
      // onCollapse={(value) => setSiderCollapsed(value)}
      css={css`
        @media screen and (max-width: ${Config.MOBILE_WIDTH}px) {
          flex-basis: 86px !important;
          min-width: 86px !important;
        }
      `}
    >
      <Menu
        mode="inline"
        items={siderMenu}
        selectedKeys={selectKeys}
        onClick={(e) => onChangeMenu(e.key)}
        style={{ height: '100%', borderRight: 0, padding: 8 }}
      />
    </Sider>
  )
}

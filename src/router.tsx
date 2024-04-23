import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IndexPage from '@/pages'
import LayoutEditPage from '@/pages/admin/layoutEdit.tsx'
import LoginPage from '@/pages/login.tsx'
import { Suspense } from 'react'
import { Spin } from 'antd'
import { routes } from '@/core/routes.ts'
import LayoutSelectPage from '@/pages/customer/layoutSelect.tsx'
import OrderListPage from '@/pages/admin/orderList.tsx'
import NotFoundPage from '@/pages/notFound.tsx'

// const EditorPage = React.lazy(() => import('@/xxx'))

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spin />}>
        <Routes>
          <Route path="/" element={<IndexPage />}>
            {/* CUSTOMER */}
            <Route path={routes.LAYOUT_SELECT} element={<LayoutSelectPage />} />
            {/* ADMIN */}
            <Route path={routes.LAYOUT_EDIT} element={<LayoutEditPage />} />
            <Route path={routes.ORDER_LIST} element={<OrderListPage />} />
          </Route>
          {/* ALL */}
          <Route path={`/${routes.LOGIN}`} element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouters

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IndexPage from '@/pages'
import EditorEditPage from '@/pages/admin/editorEdit.tsx'
import LoginPage from '@/pages/login.tsx'
import { Suspense } from 'react'
import { Spin } from 'antd'
import { routes } from '@/core/routes.ts'
import EditorSelectPage from '@/pages/customer/editorSelect.tsx'
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
            <Route path={routes.EDITOR_SELECT} element={<EditorSelectPage />} />
            {/* ADMIN */}
            <Route path={routes.EDITOR_EDIT} element={<EditorEditPage />} />
            <Route path={routes.ORDER_LIST} element={<OrderListPage />} />
          </Route>
          <Route path={`/${routes.LOGIN}`} element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouters

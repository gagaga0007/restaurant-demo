import { createBrowserRouter } from 'react-router-dom'
import IndexPage from '@/pages'
import EditorEdit from '@/pages/editorEdit.tsx'
import UserLogin from '@/pages/userLogin.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
    children: [
      {
        path: 'editor',
        element: <EditorEdit />,
      },
    ],
  },
  {
    path: '/user-login',
    element: <UserLogin />,
  },
])

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import authRoutes from '@/routes/auth.routes'
import mainRoutes from '@/routes/main.routes'

const router = createBrowserRouter([...authRoutes, ...mainRoutes])

export default function RouteIndex() {
  return <RouterProvider router={router} />
}

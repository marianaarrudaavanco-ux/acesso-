import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './index.css'
import App from './App.tsx'
import Linhas from './pages/Linhas.tsx'
import LinhaPage from './pages/Linha.tsx'
import EstacaoPage from './pages/Estacao.tsx'
import Guia from './pages/Guia.tsx'
import NaoEncontrado from './pages/NaoEncontrado.tsx'

// O mapa (Leaflet) é a parte mais pesada: só baixa quando alguém abre a tela do mapa.
const Mapa = lazy(() => import('./pages/Mapa.tsx'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Linhas /> },
      { path: 'linha/:numero', element: <LinhaPage /> },
      { path: 'estacao/:id', element: <EstacaoPage /> },
      {
        path: 'mapa',
        element: (
          <Suspense fallback={<p className="carregando">Carregando o mapa…</p>}>
            <Mapa />
          </Suspense>
        ),
      },
      { path: 'guia', element: <Guia /> },
      { path: '*', element: <NaoEncontrado /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

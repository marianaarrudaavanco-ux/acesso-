import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './index.css'
import App from './App.tsx'
import Linhas from './pages/Linhas.tsx'
import LinhaPage from './pages/Linha.tsx'
import EstacaoPage from './pages/Estacao.tsx'
import Guia from './pages/Guia.tsx'
import NaoEncontrado from './pages/NaoEncontrado.tsx'

// O mapa (MapLibre) é a parte mais pesada: baixa separado, para as outras telas abrirem rápido.
const Inicio = lazy(() => import('./pages/Inicio.tsx'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<p className="carregando">Carregando o mapa…</p>}>
            <Inicio />
          </Suspense>
        ),
      },
      { path: 'linhas', element: <Linhas /> },
      { path: 'linha/:numero', element: <LinhaPage /> },
      { path: 'estacao/:id', element: <EstacaoPage /> },
      { path: 'guia', element: <Guia /> },
      // Endereço antigo do mapa: manda para o início, que agora é o mapa.
      { path: 'mapa', element: <Navigate to="/" replace /> },
      { path: '*', element: <NaoEncontrado /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

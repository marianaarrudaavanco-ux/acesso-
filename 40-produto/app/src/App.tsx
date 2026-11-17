import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export default function App() {
  const { pathname } = useLocation()
  const principal = useRef<HTMLElement>(null)

  // Ao trocar de tela, volta pro topo e leva o foco pro conteúdo novo.
  // Sem isso, quem usa leitor de tela não percebe que a página mudou.
  useEffect(() => {
    window.scrollTo(0, 0)
    principal.current?.focus()
  }, [pathname])

  return (
    <>
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <header className="topo">
        <div className="topo__barra">
          <Link to="/" className="marca" aria-label="AccessMetro SP, início">
            <span className="marca__simbolo" aria-hidden="true" />
            AccessMetro<span className="marca__sp">SP</span>
          </Link>
          <nav aria-label="Principal">
            <ul className="menu">
              <li><NavLink to="/" end>Linhas</NavLink></li>
              <li><NavLink to="/mapa">Mapa</NavLink></li>
              <li><NavLink to="/guia">Guia</NavLink></li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="piso-tatil" aria-hidden="true" />

      <main id="conteudo" ref={principal} tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="rodape">
        <div className="rodape__dentro">
          <p>
            <strong>AccessMetro SP</strong> · projeto da turma 2ADM2 do Senac Nações Unidas.
          </p>
          <p>
            Estações e linhas: GeoSampa (Prefeitura de São Paulo). Mapa: © OpenStreetMap, © CARTO.
            Protótipo: confira sempre os avisos oficiais nas estações.
          </p>
        </div>
      </footer>
    </>
  )
}

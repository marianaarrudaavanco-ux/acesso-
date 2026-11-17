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
          <Link to="/" className="marca">
            AccessMetro <span>SP</span>
          </Link>
          <nav aria-label="Principal">
            <ul className="menu">
              <li><NavLink to="/" end>Linhas</NavLink></li>
              <li><NavLink to="/mapa">Mapa</NavLink></li>
              <li><NavLink to="/guia">Guia</NavLink></li>
            </ul>
          </nav>
        </div>
        <div className="piso-tatil" aria-hidden="true" />
      </header>

      <main id="conteudo" ref={principal} tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="rodape">
        <p>
          Projeto da turma 2CDD01 do Senac Nações Unidas. Estações: GeoSampa (Prefeitura de São Paulo).
          Mapa: © colaboradores do OpenStreetMap.
        </p>
        <p>Protótipo: confira sempre os avisos oficiais nas estações.</p>
      </footer>
    </>
  )
}

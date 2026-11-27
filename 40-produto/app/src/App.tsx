import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import PaletaPrevia from './components/PaletaPrevia'
import { trocarTema, useTema } from './components/tema'

export default function App() {
  const { pathname } = useLocation()
  const tema = useTema()
  const principal = useRef<HTMLElement>(null)
  // No início o mapa ocupa a tela inteira: sem rodapé e sem margens.
  const telaDeMapa = pathname === '/'

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
            <span className="marca__texto">AccessMetro</span><span className="marca__sp">SP</span>
          </Link>
          <div className="topo__direita">
          <nav aria-label="Principal">
            <ul className="menu">
              <li><NavLink to="/" end><IconeMenu nome="mapa" /><span>Mapa</span></NavLink></li>
              <li><NavLink to="/linhas"><IconeMenu nome="linhas" /><span>Linhas</span></NavLink></li>
              <li><NavLink to="/guia"><IconeMenu nome="guia" /><span>Guia</span></NavLink></li>
            </ul>
          </nav>
          <button type="button" className="botao-tema" aria-pressed={tema === 'escuro'} onClick={trocarTema}>
            <IconeTema escuro={tema === 'escuro'} />
            <span className="sr-only">Modo escuro</span>
          </button>
          </div>
        </div>
      </header>
      <div className="piso-tatil" aria-hidden="true" />

      <main id="conteudo" ref={principal} tabIndex={-1} className={telaDeMapa ? 'main--mapa' : undefined}>
        <Outlet />
      </main>

      {!telaDeMapa && (
        <footer className="rodape">
          <div className="rodape__dentro">
            <p>
              <strong>AccessMetro SP</strong>, projeto da turma 2ADM2 do Senac Nações Unidas.
            </p>
            <p>
              Estações e linhas: GeoSampa (Prefeitura de São Paulo). Mapa: OpenFreeMap, © OpenMapTiles, © colaboradores
              do OpenStreetMap. Protótipo: confira sempre os avisos oficiais nas estações.
            </p>
          </div>
        </footer>
      )}
      <PaletaPrevia />
    </>
  )
}

/** Ícones do menu: só aparecem no celular, onde o menu vira a barra de baixo (como nos apps). */
function IconeMenu({ nome }: { nome: 'mapa' | 'linhas' | 'guia' }) {
  return (
    <svg className="menu__icone" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {nome === 'mapa' && <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></>}
      {nome === 'linhas' && <><circle cx="6" cy="6" r="2.2" /><circle cx="6" cy="18" r="2.2" /><path d="M6 8.2v7.6" /><path d="M11 6h10M11 12h10M11 18h10" /></>}
      {nome === 'guia' && <><circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><path d="M12 7.5v.01" /></>}
    </svg>
  )
}

/** Lua no modo claro (toque para escurecer), sol no escuro. */
function IconeTema({ escuro }: { escuro: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {escuro
        ? <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>
        : <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />}
    </svg>
  )
}

import Icone from '../components/Icone'
import { FONTES_GUIA, POSTOS_PCD, RECURSOS } from '../data/recursos'
import { estacoesTestadas, VISTORIAS } from '../data/vistorias'

export default function Guia() {
  const testadas = estacoesTestadas()

  return (
    <>
      <header className="faixa faixa--escura cabecalho-guia">
        <h1>Guia de acessibilidade</h1>
        <p>O que é cada recurso, como usar e como pedir ajuda nas estações.</p>
      </header>

      <section aria-labelledby="t-ajuda" className="bloco">
        <h2 id="t-ajuda">Precisa de ajuda?</h2>
        <ul className="lista-simples">
          <li>Peça a um funcionário na entrada ou na bilheteria. O atendimento preferencial vale em todas as bilheterias do Metrô.</li>
          <li>Diga em qual estação vai descer: a equipe avisa a estação de destino para receber você.</li>
          <li>Postos de Atendimento à Pessoa com Deficiência, com conserto de cadeira de rodas e bengala: {POSTOS_PCD.join(' e ')}.</li>
          <li>Central de Informações do Metrô: <a href="tel:08007707722">0800 770 7722</a>, das 5h à meia-noite.</li>
        </ul>
      </section>

      <section aria-labelledby="t-recursos" className="bloco">
        <h2 id="t-recursos">Recurso por recurso</h2>
        <div className="guia-recursos">
          {RECURSOS.map((r) => (
            <section key={r.chave} className="guia-recurso" aria-labelledby={`g-${r.chave}`}>
              <h3 id={`g-${r.chave}`}>
                <Icone nome={r.chave} tamanho={32} />
                {r.nome}
              </h3>
              <p>{r.oQueE}</p>
              <ul className="lista-simples">
                {r.comoUsar.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section aria-labelledby="t-testes" className="bloco">
        <h2 id="t-testes">Testes em campo</h2>
        <p>
          O grupo vai até as estações e testa cada recurso. Na página da estação aparece o resultado
          (funciona, não funciona ou não tem), o dia do teste e quem testou.
        </p>
        <p className="nota">
          {testadas === 0
            ? 'Nenhuma estação testada ainda.'
            : `${VISTORIAS.length} ${VISTORIAS.length === 1 ? 'teste registrado' : 'testes registrados'} em ${testadas} ${testadas === 1 ? 'estação' : 'estações'}.`}
        </p>
      </section>

      <section aria-labelledby="t-dados" className="bloco">
        <h2 id="t-dados">De onde vêm as informações</h2>
        <ul className="lista-simples">
          <li>Estações, linhas e traçados: GeoSampa, base oficial da Prefeitura de São Paulo, com nomes conferidos linha por linha.</li>
          <li>Integração entre linhas: estações de linhas diferentes a menos de 450 metros uma da outra.</li>
          <li>Situação dos recursos: testes feitos pelo grupo nas estações.</li>
          <li>Como chegar: abre a rota a pé no Google Maps, a partir de onde você está.</li>
        </ul>
        <h3 className="fontes-titulo">Fontes das orientações</h3>
        <ul className="fontes">
          {FONTES_GUIA.map((f) => (
            <li key={f.url}><a href={f.url} target="_blank" rel="noreferrer">{f.texto}</a></li>
          ))}
        </ul>
      </section>
    </>
  )
}

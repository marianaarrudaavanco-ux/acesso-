/**
 * Avisos de quem passou pela estação (estilo Waze). Fica na página da estação.
 *
 * Qualquer um vê os avisos; só quem está na estação (até 500 m) consegue avisar ou responder.
 * Por isso os botões pedem a localização na hora do toque, e não ao abrir a página.
 */
import { useId, useState } from 'react'
import type { Estacao } from '../data/estacoes'
import { distanciaM } from '../mapa/geo'
import {
  criarRelato, haQuanto, idsDoMesmoLugar, horaEData, jaRespondi, pegarPosicao, RAIO_ESTACAO_M, RELATOS_LIGADOS,
  textoTipo, TIPOS_RELATO, useRelatos, votarRelato, type Relato, type TipoRelato,
} from '../data/relatos'

/** Pede a localização e já confere a distância aqui, para dar uma resposta clara antes de ir ao servidor. */
async function posicaoNaEstacao(estacao: Estacao) {
  const onde = await pegarPosicao()
  const metros = distanciaM(onde, estacao)
  if (metros > RAIO_ESTACAO_M) {
    const longe = metros >= 1000 ? `${(metros / 1000).toFixed(1).replace('.', ',')} km` : `${Math.round(metros)} m`
    throw new Error(`Você está a ${longe} da estação. Só dá para avisar ou confirmar estando nela (até ${RAIO_ESTACAO_M} m).`)
  }
  return onde
}

export default function Relatos({ estacao }: { estacao: Estacao }) {
  const { lista, erro, carregando, recarregar } = useRelatos(idsDoMesmoLugar(estacao))
  const [formAberto, setFormAberto] = useState(false)
  const [mensagem, setMensagem] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)
  const [ocupado, setOcupado] = useState<string | null>(null) // id do aviso (ou 'novo') esperando resposta

  async function responder(r: Relato, voto: 'ainda' | 'resolveu') {
    setOcupado(r.id); setMensagem(null)
    try {
      await votarRelato(r.id, voto, await posicaoNaEstacao(estacao))
      setMensagem({ tipo: 'ok', texto: voto === 'ainda' ? 'Obrigado! O aviso continua valendo por mais 3 horas.' : 'Obrigado! Com mais uma resposta igual, o aviso sai.' })
      navigator.vibrate?.(15)
      await recarregar()
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: (e as Error).message })
    } finally {
      setOcupado(null)
    }
  }

  return (
    <section aria-labelledby="t-relatos" className="bloco relatos" id="avisos">
      <h2 id="t-relatos">Avisos de quem passou por aqui</h2>
      <p className="nota">
        Avisos de outros passageiros, não da operadora. Cada um some sozinho 3 horas depois da última confirmação e
        nunca fica mais de 24 horas.
      </p>

      {!RELATOS_LIGADOS && <p className="aviso aviso--neutro">Os avisos estão desligados nesta versão do site.</p>}

      {RELATOS_LIGADOS && (
        <>
          {carregando && <p className="nota">Carregando avisos…</p>}
          {erro && <p className="painel__erro" role="alert">{erro}</p>}
          {!carregando && !erro && lista.length === 0 && <p className="relatos__vazio">Nenhum problema avisado agora.</p>}

          {lista.length > 0 && (
            <ul className="relatos__lista">
              {lista.map((r) => (
                <li key={r.id} className="relato">
                  <p className="relato__titulo">
                    <span className="relato__alerta" aria-hidden="true">!</span>
                    <strong>{textoTipo(r.tipo)}</strong>
                  </p>
                  {r.comentario && <p className="relato__comentario">“{r.comentario}”</p>}
                  <p className="relato__quando">
                    Avisado {haQuanto(r.criado_em)} ({horaEData(r.criado_em)})
                    {r.confirmacoes > 0 && ` · ${r.confirmacoes === 1 ? '1 pessoa confirmou' : `${r.confirmacoes} pessoas confirmaram`}`}
                    {r.resolveu > 0 && ` · ${r.resolveu} disse que resolveu`}
                    <br />Sai do ar às {horaEData(r.valido_ate)} se ninguém confirmar.
                  </p>
                  {jaRespondi(r.id) ? (
                    <p className="relato__respondido">Você já respondeu este aviso.</p>
                  ) : (
                    <div className="relato__acoes">
                      <button type="button" className="botao-contorno" disabled={ocupado !== null} onClick={() => responder(r, 'ainda')}>
                        Ainda está assim
                      </button>
                      <button type="button" className="botao-contorno" disabled={ocupado !== null} onClick={() => responder(r, 'resolveu')}>
                        Já resolveu
                      </button>
                    </div>
                  )}
                  {ocupado === r.id && <p className="nota">Conferindo se você está na estação…</p>}
                </li>
              ))}
            </ul>
          )}

          <div aria-live="polite">
            {mensagem && <p className={mensagem.tipo === 'ok' ? 'relatos__ok' : 'painel__erro'} role={mensagem.tipo === 'erro' ? 'alert' : undefined}>{mensagem.texto}</p>}
          </div>

          {formAberto ? (
            <FormRelato
              estacao={estacao}
              aoCancelar={() => setFormAberto(false)}
              aoEnviar={async (tipo, comentario) => {
                setOcupado('novo'); setMensagem(null)
                try {
                  await criarRelato(estacao.id, tipo, comentario, await posicaoNaEstacao(estacao))
                  setFormAberto(false)
                  setMensagem({ tipo: 'ok', texto: 'Aviso enviado. Obrigado por ajudar quem vem depois!' })
                  navigator.vibrate?.(15)
                  await recarregar()
                } catch (e) {
                  setMensagem({ tipo: 'erro', texto: (e as Error).message })
                } finally {
                  setOcupado(null)
                }
              }}
              enviando={ocupado === 'novo'}
            />
          ) : (
            <button type="button" className="botao relatos__novo" onClick={() => { setFormAberto(true); setMensagem(null) }}>
              Avisar um problema
            </button>
          )}
        </>
      )}
    </section>
  )
}

function FormRelato({ estacao, aoCancelar, aoEnviar, enviando }: {
  estacao: Estacao
  aoCancelar: () => void
  aoEnviar: (tipo: TipoRelato, comentario: string) => void
  enviando: boolean
}) {
  const [tipo, setTipo] = useState<TipoRelato | null>(null)
  const [comentario, setComentario] = useState('')
  const idTexto = useId()
  const precisaTexto = tipo === 'outro' && comentario.trim() === ''

  return (
    <form
      className="form-relato"
      onSubmit={(ev) => { ev.preventDefault(); if (tipo && !precisaTexto) aoEnviar(tipo, comentario) }}
    >
      <fieldset>
        <legend>O que aconteceu na estação {estacao.nome}?</legend>
        <div className="form-relato__tipos">
          {TIPOS_RELATO.map((t) => (
            <label key={t.tipo} className="opcao-relato">
              <input type="radio" name="tipo" value={t.tipo} checked={tipo === t.tipo} onChange={() => setTipo(t.tipo)} />
              <span>{t.texto}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor={idTexto} className="form-relato__rotulo">
        Detalhe {tipo === 'outro' ? '(obrigatório)' : '(opcional)'}
      </label>
      <textarea
        id={idTexto}
        value={comentario}
        onChange={(ev) => setComentario(ev.target.value)}
        maxLength={200}
        rows={3}
        placeholder="Ex.: elevador da saída da Praça da Sé, cuidado"
      />
      <p className="form-relato__contagem" aria-hidden="true">{comentario.length}/200</p>

      <p className="nota">Para enviar, o site pede sua localização uma vez, só para conferir que você está na estação.</p>
      <div className="relato__acoes">
        <button type="submit" className="botao-acento" disabled={!tipo || precisaTexto || enviando}>
          {enviando ? 'Enviando…' : 'Enviar aviso'}
        </button>
        <button type="button" className="botao-contorno" onClick={aoCancelar} disabled={enviando}>Cancelar</button>
      </div>
    </form>
  )
}

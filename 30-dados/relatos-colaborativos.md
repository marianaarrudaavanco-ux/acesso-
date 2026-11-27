# Relatos colaborativos (estilo Waze)
> Decisão: D-003 e D-011. Proposta do Enzo, desenhada em 2026-11-11. Status: **implementado em 2026-11-27** (banco no Supabase, tela na página da estação e resumo no mapa).

## Como funciona para o usuário
1. Na tela da estação, toca em **"Avisar um problema"**, escolhe o tipo e, se quiser, escreve um detalhe (até 200 letras).
2. O alerta aparece para todos na estação e no mapa: "Elevador parado · reportado há 12 min".
3. Quem passar depois toca em **"Ainda está assim"** ou **"Já resolveu"**.

## Tipos de problema
Elevador parado · Escada rolante parada · Banheiro fechado · Rampa ou acesso bloqueado · Piso tátil danificado · Outro problema (com detalhe obrigatório).

## Regras
- **Só quem está na estação** (até 500 m do ponto dela) avisa ou responde. O site pede a localização na hora do toque; o banco confere de novo.
- **Expira sozinho** 3 horas depois do aviso ou da última confirmação, e **nunca passa de 24 horas** desde o aviso (D-011).
- Avisar de novo um problema que já está no ar vira confirmação dele (não duplica).
- No máximo 5 avisos por aparelho por hora.
- **"Ainda está assim"** renova o prazo (até o teto de 24 h) e aumenta a confiança. Quem avisou não confirma o próprio aviso, mas pode dizer "já resolveu" (sai na hora).
- **Dois "já resolveu"** derrubam o alerta.
- **Sem login.** Cada aparelho recebe um ID anônimo salvo no navegador; o mesmo ID não reporta o mesmo problema na mesma estação duas vezes enquanto o alerta estiver ativo, nem vota duas vezes no mesmo relato.

## Onde está
| O quê | Onde |
|---|---|
| Tabelas, funções e regras (SQL) | `30-dados/supabase/001_relatos.sql` |
| Posição das estações no banco (gerado do JSON do site) | `30-dados/supabase/002_estacoes.sql` |
| Projeto no Supabase | `accessmetro` (org Senac-Fit, São Paulo), id `yuuutgnrxrdwxsqgqzor` |
| Código do site | `40-produto/app/src/data/relatos.ts` e `40-produto/app/src/components/Relatos.tsx` |

As tabelas `relatos` e `relato_votos` ficam fechadas para o site; ele só chama 3 funções (`relatos_ativos`, `criar_relato`, `votar_relato`). O ID do aparelho nunca sai do banco.
A lista se atualiza a cada 30 segundos (não usamos o Realtime: mais simples, e meio minuto não muda nada para um elevador parado).

## Limites conhecidos
- A localização vem do celular: quem souber falsificar o GPS consegue avisar de longe. Para um protótipo sem login, é o controle possível.
- No subsolo o GPS falha; o celular usa wi-fi e antena, com erro grande. Por isso o raio é 500 m.

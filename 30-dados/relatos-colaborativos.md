# Relatos colaborativos (estilo Waze)
> Decisão: D-003. Proposta do Enzo, desenhada em 2026-11-11. Status: desenhado, não implementado.

## Como funciona para o usuário
1. Na tela da estação, toca em **"Reportar problema"** e escolhe o tipo.
2. O alerta aparece para todos na estação e no mapa: "Elevador parado · reportado há 12 min".
3. Quem passar depois toca em **"Ainda está assim"** ou **"Já resolveu"**.

## Tipos de problema
Elevador parado · Banheiro fechado · Rampa ou acesso bloqueado · Escada rolante parada · Piso tátil danificado.

## Regras
- **Expira sozinho** depois de `[a confirmar: 2 ou 3]` horas sem confirmação.
- **"Ainda está assim"** renova o prazo e aumenta a confiança.
- **Dois "já resolveu"** derrubam o alerta.
- **Sem login.** Cada aparelho recebe um ID anônimo salvo no navegador; o mesmo ID não reporta o mesmo problema na mesma estação duas vezes enquanto o alerta estiver ativo, nem vota duas vezes no mesmo relato.

## Tabelas no Supabase (proposta)
| Tabela | Campos principais |
|---|---|
| `reports` | id, estação, tipo, criado em, ID do aparelho |
| `report_votes` | id, report, voto (`ainda` / `resolveu`), criado em, ID do aparelho |

Atualização ao vivo com o Realtime do Supabase. Chaves só em variável de ambiente (regra 8 do `AGENTS.md`).

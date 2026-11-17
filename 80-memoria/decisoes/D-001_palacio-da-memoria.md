# D-001: Organizar o repositório como palácio da memória (v0.1)
- **Data:** 2026-11-17 · **Quem decidiu:** Enzo · **Status:** Valendo
## Contexto
O projeto passa por várias conversas com o Claude (app e Code) e por várias pessoas do grupo. Conversas longas perdem contexto, e o prazo (28/11) não deixa espaço para rediscutir o que já foi decidido.
## Decisão
O repositório `marianaarrudaavanco-ux/acesso-` vira o palácio: alas numeradas na raiz (`00` portaria, `10` projeto, `20` direção, `30` dados, `40` produto, `80` memória, `90` arquivo). O código do site mora em `40-produto/app/`.
## Por quê (e o que foi descartado)
- Código numa ala (`40-produto/app/`) em vez de `app/` na raiz: mantém tudo dentro da mesma organização; custa só configurar o Root Directory na Vercel.
- Só Claude (app e Code) como agentes; outras IAs entram com nova decisão.
- Os arquivos do protótipo do Gemini (index.html, css/style.css, js/script.js, js/data.js) estavam vazios (0 bytes) no repositório e foram removidos em vez de arquivados.
## Consequências
- Toda sessão de trabalho deixa diário em `80-memoria/diario/`.
- A Vercel precisa apontar para `40-produto/app` quando o app existir.
## Fonte
Conversa do Enzo com o `claude` em 2026-11-17.

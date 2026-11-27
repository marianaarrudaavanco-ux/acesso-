# 2026-11-27 · claude · Relatos colaborativos no ar

## Pedido
Enzo: implementar os avisos estilo Waze (elevador quebrou, cuidado…), só para quem estiver na estação; testar, deixar o banco zerado.
No meio, pediu prazo de 24 h / datas para aviso velho não confundir.

## O que fiz (com caminhos completos)
- Criei o projeto `accessmetro` no Supabase (org Senac-Fit, sa-east-1) e rodei `30-dados/supabase/001_relatos.sql` e `30-dados/supabase/002_estacoes.sql`.
- `40-produto/app/src/data/relatos.ts`: chamadas ao banco, ID anônimo do aparelho, localização, textos de tempo e o hook `useRelatos` (atualiza a cada 30 s).
- `40-produto/app/src/components/Relatos.tsx`: avisos na página da estação (lista, "Ainda está assim" / "Já resolveu", formulário).
- `40-produto/app/src/pages/Estacao.tsx`: a seção de avisos subiu para antes da tabela de acessibilidade.
- `40-produto/app/src/pages/Inicio.tsx`: resumo do aviso no painel da estação no mapa.
- `40-produto/app/src/index.css`: bloco "Avisos de passageiros".
- `30-dados/relatos-colaborativos.md`: status, regras finais, onde está cada coisa e limites.

## Testes
- No banco, como usuário anônimo (dentro de transação desfeita no fim): longe recusa; perto cria; mesmo tipo vira confirmação; não confirma o próprio; voto longe recusa; voto repetido recusa; dois "já resolveu" derrubam; "outro" sem texto recusa; 6º aviso na hora recusa; aviso velho some; renovação respeita 24 h; tabela fechada para o anônimo. Banco conferido zerado no fim (0 relatos, 0 votos, 211 estações).
- No navegador (390×844, servidor simulado com as mesmas regras): 11 verificações de fluxo passaram, incluindo aviso que aparece na Sé das duas linhas e o resumo no mapa.

## Decisões e erros registrados
- `80-memoria/decisoes/D-011_relatos-no-ar.md`

## Pendente
- Pôr `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` na Vercel (time acessmetro) e fazer redeploy.
- Teste real numa estação, com o celular.

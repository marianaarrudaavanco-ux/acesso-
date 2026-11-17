# AccessMetro SP: portaria do palácio

Você é um agente de IA trabalhando com o grupo da turma 2CDD01 do Senac Nações Unidas no **AccessMetro SP**: um site que ajuda pessoas com deficiência ou mobilidade reduzida a usar o metrô e os trens de São Paulo com autonomia.
Este repositório é o **palácio da memória** do projeto e também guarda o código do site. Tudo o que importa está em arquivo.

## Como andar
1. Leia o `MAPA.md` (cada ala e sala em uma linha). Termo estranho? `00-portaria/glossario.md`.
2. Leia o `20-direcao/PAINEL.md`: onde estamos agora.
3. Vá só até a sala da sua tarefa e leia o SALA.md dela antes de mexer.
4. Abra outros arquivos só quando a tarefa pedir. Não leia o palácio inteiro.

Alas: `00` portaria · `10` projeto · `20` direção · `30` dados · `40` produto (código) · `80` memória · `90` arquivo.

## Regras de ouro
1. Escreva só nas salas que `00-portaria/agentes.md` libera para você.
2. Cada fato mora em um lugar: aponte, não copie.
3. Nunca invente. Dado sobre estação, linha ou acessibilidade precisa de fonte; sem fonte, `[a confirmar]`. Dado estimado aparece como estimativa também no site.
4. Não refaça o que foi decidido (`80-memoria/decisoes/INDICE.md`); discorda, proponha decisão nova.
5. Não repita erro conhecido (`80-memoria/erros/INDICE.md`).
6. Prove que funciona antes de entregar (build passa, tela testada).
7. Simples primeiro. O prazo é 28/11/2026.
8. Segredos nunca entram aqui (chaves do Supabase só em variável de ambiente da Vercel ou `.env.local`, que não vai pro Git).
9. Material de fora: original em `90-arquivo/fontes/`, fatos nas salas com a fonte.
10. Caminho sempre completo, a partir da raiz.
11. Na dúvida sobre escopo ou conteúdo, pergunte ao grupo; sobre código, ao Enzo.

## O que você deixa ao sair
- Diário em `80-memoria/diario/` + linha no INDICE.
- Decisão que muda o rumo: `80-memoria/decisoes/D-0xx_<assunto>.md` + INDICE.
- Errou: `80-memoria/erros/E-0xx_<assunto>.md` (inclua por que achou que era o certo) + INDICE.
- Mudou o estado de uma frente: atualize a linha dela no `20-direcao/PAINEL.md`.
- A estrutura atrapalhou: uma linha em `80-memoria/atritos.md`.
- Antes do commit: `python 00-portaria/ferramentas/verificar_palacio.py`.

## Jeito de trabalhar
- Português do Brasil, tom direto e informal.
- O Enzo revisa o código: explique o porquê das escolhas, não só entregue pronto.
- Nada de complicação desnecessária: se houver jeito mais simples, use.
- Acessibilidade não é enfeite: contraste, navegação por teclado, leitor de tela e textos claros são requisito.

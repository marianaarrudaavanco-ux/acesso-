# D-002: Reescrever o site do zero com Vite + React + TypeScript
- **Data:** 2026-11-11 · **Quem decidiu:** Enzo · **Status:** Valendo
## Contexto
A documentação original previa HTML, CSS e JS puros (`90-arquivo/fontes/2026-11-11_grupo_documentacao-original.md`, seção 2), escolha feita porque a IA usada na época gerava código ruim.
## Decisão
Vite + React + TypeScript, com `react-leaflet` para o mapa e deploy na Vercel. O código é reescrito do zero. O `claude` escreve o código; o Enzo revisa e testa.
## Por quê (e o que foi descartado)
- TypeScript define o formato de linha e estação e evita bug de dado errado.
- React organiza as várias telas em componentes; o Enzo já usou React.
- Descartado Vite + TS sem framework: mais código manual para renderizar telas.
- Descartado Next.js: mais pesado do que o projeto precisa.
- Os PCs do Senac não deixam instalar programas, por isso o código é feito pelo Claude e revisado pelo Enzo, sem depender de Node nas máquinas da escola.
## Consequências
- Build com Node (Vercel faz isso sozinha).
- Ala `40-produto/` com regras de build e acessibilidade.
## Fonte
Conversa do Enzo com o `claude` em 2026-11-11.

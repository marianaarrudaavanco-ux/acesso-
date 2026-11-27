# Atritos
> Uma linha por vez que a estrutura do palácio atrapalhou mais do que ajudou. Lido de tempos em tempos para ajustar a estrutura.

| Data | Quem | O que atrapalhou | Sugestão |
|---|---|---|---|
- 2026-11-27 · claude · `verificar_palacio.py` acusa segredo em `apikey: VARIAVEL` (nome de cabeçalho lendo variável de ambiente). Contornado pondo o nome entre aspas; vale o regex ignorar valores que são só um nome de variável.

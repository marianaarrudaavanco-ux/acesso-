# Atritos
> Uma linha por vez que a estrutura do palácio atrapalhou mais do que ajudou. Lido de tempos em tempos para ajustar a estrutura.

| Data | Quem | O que atrapalhou | Sugestão |
|---|---|---|---|
| 2026-11-27 | claude | `00-portaria/ferramentas/verificar_palacio.py` acusa segredo quando o código manda o cabeçalho da chave lendo uma variável de ambiente (sem aspas no nome do cabeçalho) | O regex poderia ignorar quando o valor é só um nome de variável em maiúsculas |

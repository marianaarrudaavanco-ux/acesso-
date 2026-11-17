"""Verificador do palácio da memória. Uso: python 00-portaria/ferramentas/verificar_palacio.py"""
import re, sys, datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
erros, avisos = [], []
OBRIGATORIOS = ["AGENTS.md", "MAPA.md", "20-direcao/PAINEL.md", "80-memoria/decisoes/INDICE.md",
                "80-memoria/erros/INDICE.md", "80-memoria/diario/INDICE.md", "00-portaria/agentes.md"]
IGNORAR = {".git", "node_modules", ".venv", "__pycache__", "90-arquivo", "dist"}
SEGREDOS = [r"sk-[A-Za-z0-9_-]{20,}", r"ghp_[A-Za-z0-9]{30,}", r"AKIA[0-9A-Z]{16}",
            r"-----BEGIN [A-Z ]*PRIVATE KEY-----", r"(?i)(senha|password|api[_-]?key|token)\s*[:=]\s*['\"]?[^\s'\"`<\[]{8,}"]

def arquivos(ext):
    for p in RAIZ.rglob(f"*{ext}"):
        if not IGNORAR & set(p.relative_to(RAIZ).parts):
            yield p

for o in OBRIGATORIOS:
    if not (RAIZ / o).exists():
        erros.append(f"Falta o arquivo obrigatório {o}")

for ala in sorted(RAIZ.iterdir()):
    if ala.is_dir() and re.match(r"\d\d-", ala.name) and ala.name[:2] not in {"00", "20", "80", "90"}:
        if not (ala / "SALA.md").exists():
            avisos.append(f"Ala {ala.name} sem SALA.md")

# Caminhos citados entre crases precisam existir (na raiz ou ao lado de quem cita)
for md in arquivos(".md"):
    if "modelos" in md.parts:
        continue
    for c in re.findall(r"`([^`\s]+)`", md.read_text(encoding="utf-8", errors="ignore")):
        c = c.rstrip("/")
        if any(x in c for x in "<>*[]{}$") or "AAAA" in c or "0xx" in c or "://" in c:
            continue
        parece = re.match(r"\d\d-[\w.-]+(/|$)", c) or re.fullmatch(r"[\w.-]+\.(md|py|html|json|xlsx|csv|pdf|png)", c)
        if parece and not (RAIZ / c).exists() and not (md.parent / c).exists():
            erros.append(f"{md.relative_to(RAIZ)}: caminho citado não existe: {c}")

# Índices completos e números sem repetição
for pasta, prefixo in [("decisoes", "D-"), ("erros", "E-"), ("diario", "")]:
    d = RAIZ / "80-memoria" / pasta
    indice = d / "INDICE.md"
    if not indice.exists():
        continue
    texto = indice.read_text(encoding="utf-8")
    nums = {}
    for f in d.glob("*.md"):
        if f.name == "INDICE.md":
            continue
        if f.name not in texto:
            erros.append(f"80-memoria/{pasta}/{f.name} não está no INDICE")
        if prefixo:
            n = f.name.split("_")[0]
            if n in nums:
                erros.append(f"Número repetido {n}: {nums[n]} e {f.name}")
            nums[n] = f.name

# PAINEL desatualizado
painel = RAIZ / "20-direcao/PAINEL.md"
if painel.exists():
    m = re.search(r"Última atualização:\s*(\d{4}-\d\d-\d\d)", painel.read_text(encoding="utf-8"))
    if not m:
        avisos.append("PAINEL sem linha 'Última atualização: AAAA-MM-DD'")
    elif (datetime.date.today() - datetime.date.fromisoformat(m.group(1))).days > 14:
        avisos.append(f"PAINEL não é atualizado desde {m.group(1)}")

# Segredos
for ext in (".md", ".py", ".js", ".ts", ".tsx", ".json", ".html", ".env", ".yml", ".yaml", ".txt"):
    for f in arquivos(ext):
        t = f.read_text(encoding="utf-8", errors="ignore")
        for padrao in SEGREDOS:
            if re.search(padrao, t):
                erros.append(f"{f.relative_to(RAIZ)}: parece conter um segredo ({padrao[:20]}...)")
                break

for a in avisos:
    print("AVISO:", a)
for e in erros:
    print("ERRO: ", e)
print(f"\n{len(erros)} erro(s), {len(avisos)} aviso(s).")
sys.exit(1 if erros else 0)

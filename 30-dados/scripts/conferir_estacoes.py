"""
Confere 40-produto/app/src/data/estacoes.json contra listas de referência, linha por linha
(nome e ordem). Uso: python 30-dados/scripts/conferir_estacoes.py 40-produto/app/src/data/estacoes.json

Referência: tabelas de estações das páginas de cada linha na Wikipédia em inglês
(https://en.wikipedia.org/wiki/Line_1_(São_Paulo_Metro) etc.), conferidas em 2026-11-17, com três ajustes:
- Linha 4: sem Chácara do Jockey (em obras, previsão 2028) e com Higienópolis-Mackenzie (a tabela lida omitiu).
- Linha 11: sem Penha (em obras junto com a Linha 2).
- Linha 13: só as 3 estações da linha regular (Barra Funda, Luz e Brás são só do Expresso Aeroporto).
Fontes dos ajustes: 30-dados/linhas.md.
"""
import json, unicodedata, re, sys
W = {
1:"Tucuruvi|Parada Inglesa|Jardim São Paulo–Ayrton Senna|Santana|Carandiru|Portuguesa-Tietê|Armênia|Tiradentes|Luz|São Bento|Sé|Japão-Liberdade|São Joaquim|Vergueiro|Paraíso|Ana Rosa|Vila Mariana|Santa Cruz|Praça da Árvore|Saúde-Ultrafarma|São Judas|Conceição|Jabaquara-Comitê Paralímpico Brasileiro",
2:"Vila Madalena|Santuário Nossa Senhora de Fátima-Sumaré|Clínicas|Consolação|Trianon-Masp|Brigadeiro|Paraíso|Ana Rosa|Chácara Klabin|Santos-Imigrantes|Alto do Ipiranga|Sacomã|Tamanduateí|Vila Prudente",
3:"Palmeiras–Barra Funda|Marechal Deodoro|Santa Cecília|República|Anhangabaú|Sé|Pedro II|Brás|Bresser–Mooca|Belém|Tatuapé|Carrão|Penha|Vila Matilde|Guilhermina–Esperança|Patriarca–Vila Ré|Artur Alvim|Corinthians–Itaquera",
4:"Luz|República|Higienópolis-Mackenzie|Paulista|Oscar Freire|Fradique Coutinho|Faria Lima|Pinheiros|Butantã|São Paulo–Morumbi|Vila Sônia–Professora Elisabeth Tenreiro",
5:"Capão Redondo|Campo Limpo|Vila das Belezas|Giovanni Gronchi|Santo Amaro|Largo Treze|Adolfo Pinheiro|Alto da Boa Vista|Borba Gato|Brooklin|Campo Belo|Eucaliptos|Moema|AACD–Servidor|Hospital São Paulo|Santa Cruz|Chácara Klabin",
15:"Vila Prudente|Oratório|São Lucas|Camilo Haddad|Vila Tolstói|Vila União|Jardim Planalto|Sapopemba|Fazenda da Juta|São Mateus|Jardim Colonial",
17:"Morumbi|Chucri Zaidan|Vila Cordeiro|Campo Belo|Vereador José Diniz|Brooklin Paulista|Aeroporto de Congonhas|Washington Luís",
7:"Palmeiras-Barra Funda|Água Branca|Lapa|Piqueri|Pirituba|Vila Clarice|Jaraguá|Vila Aurora|Perus|Caieiras|Franco da Rocha|Baltazar Fidélis|Francisco Morato|Botujuru|Campo Limpo Paulista|Várzea Paulista|Jundiaí",
8:"Júlio Prestes|Palmeiras-Barra Funda|Lapa|Domingos de Moraes|Imperatriz Leopoldina|Presidente Altino|Osasco|Comandante Sampaio|Quitaúna|General Miguel Costa|Carapicuíba|Santa Terezinha|Antônio João|Barueri|Jardim Belval|Jardim Silveira|Jandira|Sagrado Coração|Engenheiro Cardoso|Itapevi|Santa Rita|Ambuitá|Amador Bueno",
9:"Osasco|Presidente Altino|Ceasa|Villa Lobos-Jaguaré|Cidade Universitária|Pinheiros|Hebraica-Rebouças|Cidade Jardim|Vila Olímpia|Berrini|Morumbi-Claro|Granja Julieta|João Dias|Santo Amaro|Socorro|Jurubatuba-Senac|Autódromo|Primavera-Interlagos|Grajaú|Bruno Covas/Mendes-Vila Natal|Varginha",
10:"Palmeiras-Barra Funda|Luz|Brás|Juventus-Mooca|Ipiranga|Tamanduateí|São Caetano do Sul-Prefeito Walter Braido|Utinga|Prefeito Saladino|Prefeito Celso Daniel-Santo André|Capuava|Mauá|Guapituba|Ribeirão Pires-Antônio Bespalec|Rio Grande da Serra",
11:"Palmeiras-Barra Funda|Luz|Brás|Tatuapé|Corinthians-Itaquera|Dom Bosco|José Bonifácio|Guaianases|Antonio Gianetti Neto|Ferraz de Vasconcelos|Poá|Calmon Viana|Suzano|Jundiapeba|Braz Cubas|Mogi das Cruzes|Estudantes",
12:"Brás|Tatuapé|Engenheiro Goulart|USP Leste|Comendador Ermelino|São Miguel Paulista|Jardim Helena-Vila Mara|Itaim Paulista|Jardim Romano|Engenheiro Manoel Feio|Itaquaquecetuba|Aracaré|Calmon Viana",
13:"Engenheiro Goulart|Guarulhos–CECAP|Aeroporto–Guarulhos",
}
def n(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]','',s)
d=json.load(open(sys.argv[1]))
ok=True
for linha,ref in W.items():
    ref=ref.split('|'); nos=[e['nome'] for e in d if e['linha']==linha]
    iguais = [n(a) for a in nos]==[n(b) for b in ref]
    if not iguais:
        ok=False
        print(f"Linha {linha}: DIFERENTE\n  nosso: {nos}\n  ref:   {ref}")
    else:
        print(f"Linha {linha}: {len(nos)} estações, mesma ordem e nomes ✓")
print("TUDO CERTO" if ok else "HÁ DIFERENÇAS")

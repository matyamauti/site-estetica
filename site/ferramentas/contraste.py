# Contraste do texto do CTA sobre o vídeo de fundo.
# 1) Fotografar com o texto escondido, em vários segundos do vídeo:
#    ESCONDER=.cta__inner VIDEO_T=n OUT=ferramentas/saida/fundo \
#      node ferramentas/cdp.mjs foto 1440x900:.cta:1500 375x812:.cta:1500
#    e renomear para fundo/d-n.png e fundo/m-n.png
# 2) python ferramentas/contraste.py 0.5 1 2.5 ...
# "pior" = percentil 95 de luminância do fundo atrás do texto (quase o ponto
# mais claro); "medio" = mediana. AA pede 4,5 (texto normal) / 3 (título).
import sys
from PIL import Image


def lum(c):
    c = [v / 255 for v in c]
    c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def razao(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


IVORY, CHAMP = (247, 242, 238), (196, 174, 148)  # telefone do CTA é marfim desde 22/09/2026
# caixas medidas no navegador (getBoundingClientRect) com a seção no topo
CAIXAS = {
    'd': {'titulo': ((248, 300, 1192, 479), IVORY), 'telefone': ((889, 582, 1018, 601), IVORY)},
    'm': {'titulo': ((69, 193, 306, 316), IVORY), 'telefone': ((191, 484, 320, 504), IVORY)},
}
piores = {}
for t in sys.argv[1:]:
    for dev, caixas in CAIXAS.items():
        im = Image.open(f'ferramentas/saida/fundo/{dev}-{t}.png').convert('RGB')
        out = []
        for nome, (b, cor) in caixas.items():
            px = sorted(im.crop(b).get_flattened_data(), key=lum)
            p = razao(cor, px[int(len(px) * 0.95)])
            m = razao(cor, px[len(px) // 2])
            piores[(dev, nome)] = min(piores.get((dev, nome), 99), p)
            out.append(f'{nome} pior {p:.1f} medio {m:.1f}')
        print(f'{t:>4}s {dev}  ' + ' | '.join(out))
print('PIOR CASO:', {f'{d}/{n}': round(v, 1) for (d, n), v in piores.items()})

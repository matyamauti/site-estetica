# Fotografias — onde colocar

Nenhuma imagem foi inventada. Cada bloco de foto do site está desenhado como
**placeholder identificado**: aparece um selo "FOTO PENDENTE" com a descrição
do enquadramento e o caminho exato do arquivo.

Para trocar, **basta salvar a foto com o nome abaixo, na pasta indicada**.
Nenhum código precisa ser editado — o componente detecta o arquivo sozinho.

## Já no site

| Arquivo | Origem | Onde aparece |
|---|---|---|
| `jade/jade-retrato.webp` + `-640.webp` | Retrato de estúdio, 1136×1384 | **Sobre** |
| `jade/jade-trabalhando.webp` | Recorte do post "Minha Trajetória", 232×736 | sem uso (galeria removida em 21/09/2026) |

Os PNG originais continuam em `public/images/J/` — nada foi apagado. O
recorte tirou o texto do post e a assinatura; sobrou só a figura dela.

**A da galeria é o elo fraco.** Veio de um print de 613px de largura, e a
parte aproveitável tinha 232px. Ela aparece pequena, como figura recortada
sobre a cor da marca, justamente para o tamanho não denunciar. Se a Jade
tiver o arquivo original dessa foto, trocar melhora na hora.

## Ainda faltam

| Arquivo | Enquadramento | Onde aparece |
|---|---|---|
| `public/images/jade/hero-retrato.jpg` | Vertical, amplo, a Jade no espaço. É a primeira coisa que a pessoa vê. | Hero |
| ~~`micropigmentacao-destaque.jpg`~~ ✅ `public/images/jade/micropigmentacao.webp` (21/09/2026) | Vertical, Jade com o aparelho | Seção de destaque |
| ✅ `public/images/tratamentos/*-640.webp` / `-960.webp` (21/09/2026) | 4:5, recortadas de `images/resultados/*.png` | Carrossel de tratamentos (4 slides) |
| ✅ `public/images/jade/experiencia.webp` (21/09/2026) | Vertical, Jade com os instrumentos | Experiência |
| ✅ `public/images/resultados/caso-01-antes.webp` / `-depois.webp` (21/09/2026) | 1080×1296, recortadas de `Procedimentos/` | Resultados, caso 01 |
| Próximos casos: `caso-02-antes` / `caso-02-depois` | Vertical, **mesmo ângulo e enquadramento nas duas** — com ângulos diferentes o comparador mostra dois rostos emendados | Resultados |

## Três avisos que valem dinheiro

**1. Antes e depois precisam do mesmo enquadramento.** O comparador desliza
uma foto sobre a outra. Se o ângulo, a distância ou a luz mudarem entre as
duas, a comparação fica confusa em vez de impressionante.

**2. Foto de cliente exige autorização.** A seção de Resultados traz um aviso
dizendo que as imagens serão de casos reais autorizados. Guarde a autorização
por escrito de cada pessoa antes de publicar.

**3. Não precisa comprimir.** Pode mandar o arquivo original, do tamanho que
sair da câmera ou do celular. Eu converto para WebP em duas larguras e ligo
no `srcset`, que é o que faz o celular baixar a versão pequena e o desktop a
grande. O retrato de estúdio saiu de 1,4 MB de PNG para 45 KB assim, sem
perda visível.

## Uma imagem que falta

`public/og.jpg`, 1200×630 — é a miniatura que aparece quando alguém manda o
link do site no WhatsApp. Quando ela existir, descomente a linha `og:image`
em `index.html` e troque o domínio.

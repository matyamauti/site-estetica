# Jade Romero | Estética e Beleza — site

Site institucional. React + Vite + GSAP, CSS próprio com tokens.

## Rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:5183. Para gerar a versão de publicação:

```bash
npm run build
```

A pasta `dist/` resultante é o que vai para a hospedagem.

## Onde mexer em cada coisa

| Quero mudar | Arquivo |
|---|---|
| Textos, telefone, endereço, depoimentos, lista de tratamentos | `src/lib/site.js` |
| Cores, fontes, espaçamento, curvas de animação | `src/styles/tokens.css` |
| Largura do container e botões | `src/styles/layout.css` |
| Uma seção específica | `src/components/<Nome>.jsx` |
| Comportamento das animações | `src/lib/motion.js` |
| Fotografias | ver [IMAGENS.md](IMAGENS.md) |

**`src/lib/site.js` é o arquivo mais importante.** Ele concentra todo o
conteúdo: nenhum texto de marca está escrito dentro de componente. Para
atualizar o site no dia a dia, comece por ele.

## Decisões que não são óbvias

**O container é uma conta só.** Em `layout.css`, a distância do conteúdo até
a borda da tela é sempre `max(--gutter, (100% - 1320px) / 2)`. As fotos que
sangram usam a mesma conta invertida, por isso continuam alinhadas ao texto.
A conta usa `100%` e nunca `100vw` — `100vw` inclui a barra de rolagem do
Windows e é a causa clássica de scroll horizontal.

**O site é legível sem JavaScript.** O estado inicial invisível das
revelações só é aplicado quando o JS confirma que vai animar, marcando
`<html data-motion="on">`. Crawler do Google e leitor de tela nunca recebem
`opacity: 0`.

**Movimento reduzido é respeitado de verdade.** Com `prefers-reduced-motion`
ativo, nada anima, os números aparecem já contados e o conteúdo nasce no
estado final.

**As animações do hero usam `fromTo`, nunca `from`.** `from` grava como
destino o valor que o elemento tem no instante em que o tween é criado; se o
efeito rodar duas vezes, ele animaria de zero para zero e o hero ficaria em
branco. Aconteceu durante o desenvolvimento.

**As animações de rolagem seguem o sistema de era-residence.com.**
Vieram de lá as curvas, as durações (1,2s) e o critério de qual efeito vai
em qual elemento — não o código. Cada elemento declara o próprio efeito com
um atributo, e `src/lib/motion.js` faz o resto:

| Atributo | Efeito | Usado em |
|---|---|---|
| `data-anim="linhas"` | cada linha sobe por dentro de uma máscara | frases, parágrafos, depoimentos |
| `data-anim="letras"` | cada letra se desdobra | só títulos curtos |
| `data-anim="cortina"` | cortina diagonal e a foto desinfla por dentro | fotos, comparador, mapa |
| `data-anim="bloco"` | sobe 3rem com fade | botões, números, itens |
| `data-fio` | o traço fino se desenha da esquerda | linhas finas acima de blocos |
| `data-anim-grupo` | os itens de dentro disparam juntos, em cascata | cabeçalhos de seção |
| `data-parallax="img"` / `"sobe"` | a foto flutua / o bloco sobe mais rápido | só no desktop |

Além das revelações, as peças de assinatura da referência:

- **Hero preso à rolagem** (`Hero.jsx`, `montarHero` em `motion.js`): moldura
  cacau com janela em arco → o arco abre e a Jade desliza para a direita → a
  frase dela sobe → pausa → uma cúpula marfim sobe com "Corpo · Mente · Emoção"
  e vira o fundo do manifesto. A seção tem 380svh de altura; o palco é sticky.
- **Header sem barra**: selo circular que gira com a rolagem e links
  empilhados. A cor troca pela seção sob o header (`data-tema` nas seções).
- **Régua lateral** (`Trilho.jsx`): número e nome da seção + fio de progresso.
- **Tratamentos em carrossel**: nome gigante letra a letra, foto por cortina.
- **Palavra gigante** "Autocuidado" com a foto subindo por cima.
- **Botão circular** com texto girando no CTA.
- **Script** Mrs Saint Delafield, escolhida lado a lado com o script dos
  posts dela. Só para uma palavra por vez.

Rolagem suave com Lenis, só na roda do mouse — no toque continua nativa.
Ficou de fora de propósito o *snap* de seção da referência, que puxa a
rolagem sozinho (o briefing proíbe *scroll hijacking*).

Com `prefers-reduced-motion`, nada disso roda: sem Lenis, sem divisão de
texto, todo o conteúdo já visível. Testado.

**Os números são reais.** 14 anos, 4,9 e 265 avaliações vieram da cliente.
Os dois depoimentos são os que ela enviou, na íntegra. Não há preço, duração
nem promessa de resultado em lugar nenhum do site, porque nada disso foi
informado.

## Publicar

O build é estático. Serve qualquer hospedagem — Netlify, Vercel, Hostinger,
ou a que a cliente já usar. Arraste a pasta `dist/`.

Antes de publicar:

1. Colocar as fotografias reais (ver [IMAGENS.md](IMAGENS.md)).
2. Gerar `og.jpg` e descomentar a linha `og:image` no `index.html`.
3. Colar o `<iframe>` do Google Maps em `src/components/Location.jsx`, no
   lugar marcado.
4. Conferir se a lista de tratamentos em `src/lib/site.js` bate com o que a
   Jade realmente oferece.

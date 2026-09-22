# Site Jade Romero (`site/`)

As **regras invioláveis**, a **marca** e a **bio** estão no `CLAUDE.md` da raiz
do projeto. Este arquivo cobre só o site. Última atualização: 22/09/2026.

---

## 1. Estado

Site de uma página. **No ar desde 22/09/2026: https://jaderomero.vercel.app**
(Vercel, conta `yamautimatheuseng-5058`, projeto `jaderomero-estetica`; o
Matheus trocou o endereço para `jaderomero.vercel.app`).

**Publicar de novo:** `npm run build`, copiar `dist/` para uma pasta à parte
(com o `vercel.json` de cache) e `vercel deploy --prod` de lá — só o pacote
pronto sobe, nunca o projeto. Conferir depois: `curl` do endereço e dos
arquivos, e `ANTES.png` dos originais tem que dar 404. Os links longos
`*-projects.vercel.app` pedem login (proteção da Vercel) — é normal.

```bash
cd site && npm run dev        # http://localhost:5183
npm run build                 # gera dist/ (estático, serve em qualquer host)
```

O servidor de desenvolvimento pode cair entre sessões (a porta para de
responder e as ferramentas devolvem página vazia). Conferir com
`curl -s -o /dev/null -w "%{http_code}" http://localhost:5183/` antes de auditar.

**Stack:** Vite 7 + React 19 + GSAP 3.15 (ScrollTrigger, SplitText,
CustomEase) + Lenis 1.3. CSS próprio com tokens, **sem Tailwind** — os padrões
dele (`rounded-xl`, `shadow-md`) são o kit de cards que o briefing proibia, e o
briefing pediu cores em variáveis CSS. JS: **139,4 KB gzip**; CSS 8,3 KB gzip.

**Ordem da página:** Hero → Manifesto (foto "Autocuidado") → Sobre →
Tratamentos (carrossel) → Destaque (Micropigmentação) → Resultados →
Experiência ("AUTOCUIDADO") → Números → Avaliações → CTA (vídeo) →
Localização → Rodapé. A **Galeria** foi removida em 21/09/2026.

**Mapa:**

| Arquivo | O que é |
|---|---|
| `src/lib/site.js` | **Todo o conteúdo.** Textos, contato, tratamentos, casos de antes/depois, depoimentos, frases dela. Comece por aqui |
| `src/lib/motion.js` | Todo o movimento: Lenis, revelações, hero, Experiência, temas, régua, selo, parallax |
| `src/styles/tokens.css` | Cores, fontes, espaçamento, curvas |
| `src/styles/layout.css` | Container, botões, `Figure`, placeholder |
| `src/styles/base.css` | Reset, foco, esconderijo das animações, fio, parallax, Lenis |
| `src/styles/sections.css` | Seções sem CSS próprio (Manifesto, Sobre, Destaque, Experiência, CTA…) |
| `src/components/*.jsx/.css` | Uma seção por componente |
| `ferramentas/` | Auditoria, filmagem e testes de interação (seção 8) |
| `IMAGENS.md` | Quais fotos existem, quais faltam e com que nome salvar |
| `design-system/jade-romero/` (raiz) | MASTER do ui-ux-pro-max + override `pages/home.md` |

**Arquivos de mídia em `public/`:**

| Pasta | Conteúdo | Vai para o site? |
|---|---|---|
| `images/jade/` | hero, retrato (Sobre), autocuidado (Manifesto), micropigmentacao (Destaque), experiencia — WebP com versão menor | ✅ usado |
| `images/tratamentos/` | 4 fotos do carrossel, 4:5, `-640`/`-960` | ✅ usado |
| `images/resultados/caso-0N-*.webp` | antes/depois recortados, 1080×1296 + `-720` | ✅ usado |
| `video/cuidado.mp4` + `cuidado-capa.jpg` | fundo do CTA | ✅ usado |
| `site/originais/` (fora de `public/`) | originais das fotos e vídeos (38 MB), movidos em 22/09/2026 | ❌ não vão para o ar (`dist/` = 3,3 MB) |

---

## 2. Design

**Paleta** (`tokens.css`). Os contrastes foram calculados, não estimados:

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `--c-ivory` | `#f7f2ee` | fundo base | — |
| `--c-linen` | `#efe7df` | fundo alternado | — |
| `--c-nude-brand` | `#dec4b1` | seção Sobre (`.is-nude`) — cor de marca medida nos posts | — |
| `--c-hero-field` | `#e4c5b3` | fundo do hero = fundo exato da foto de abertura | — |
| `--c-hero-moldura` | `#3a2320` | moldura cacau da abertura do hero | — |
| `--c-foto-noite` | `#0a0909` | cúpula do hero + Manifesto = fundo de estúdio da foto "Autocuidado" (amostrado) | — |
| `--c-foto-estudio` | `#0a1015` | sobras laterais da foto da Experiência (amostrado) | — |
| `--c-espresso` | `#2b211c` | texto | 14,1:1 no ivory |
| `--c-clay` | `#96573f` | acento / botão | 5,06:1 no ivory |
| `--c-ink` | `#171411` | seções escuras (definido pela cliente) | — |
| `--c-champagne` | `#c4ae94` | texto de apoio no escuro; "BELEZA" na Experiência | 8,6:1 no ink |

Sobre o nude `#DEC4B1` o texto secundário e o acento **escurecem**
(`#574a42` 5,13:1 e `#74402e` 5,02:1) — os valores padrão reprovavam.

**Foto com fundo de estúdio:** a regra do site é pintar a seção (ou as sobras)
com a cor **amostrada** do fundo da foto e dissolver as bordas com
`mask-image`. Assim a foto "vai de ponta a ponta" sem retângulo colado.
Usado no Manifesto, no Sobre e na Experiência.

**Fontes:** Libre Bodoni (títulos) + Public Sans (texto) + **Mrs Saint
Delafield** (script). O script foi escolhido comparando seis fontes lado a
lado com o script dos posts dela. **Uma palavra por vez, nunca texto corrido.**
Playfair + Inter foi recusado de propósito: é o par mais reconhecível de
página gerada por IA.

**Container — uma regra só:** distância até a borda =
`max(--gutter, (100% − 1320px) / 2)`. `.site-container` e `.u-edge-*` usam
a mesma conta. **Nunca `100vw`** — inclui a barra de rolagem do Windows.

---

## 3. Referências de animação

### era-residence.com (sistema do site inteiro)

O Matheus pediu as animações **idênticas** a essa referência. A primeira
tentativa falhou porque só o código foi lido; **ele disse que mudou pouca
coisa**. A segunda filmou o site quadro a quadro (`ferramentas/ref.mjs`) e
aí apareceu a estrutura real: 24 telas de altura, hero de 5,8 telas preso à
rolagem, cúpulas, palavras gigantes. **Referência se estuda em movimento.**

Stack dela: Webflow + GSAP 3.15 (ScrollTrigger, SplitText, CustomEase) +
Lenis + Barba + Lottie. Código das animações num módulo Slater.

| Valor copiado | |
|---|---|
| Duração das revelações | 1,2s |
| Intervalo entre itens | 0,1s (letras 0,05s) |
| Atraso base | 0,3s |
| Disparo | `clamp(top bottom)` |
| Cortina de imagem | foto começa em `scale 1.5`, `xPercent 25` |
| Bloco | sobe `3.333rem` |
| Curvas | `saida` 0.25,1,0.5,1 · `travessia` 0.75,0,0.25,1 · `entrada` 0.5,0,0.75,0 · `escrita` 0.333,0,0.667,1 |

**Deixado de fora de propósito:** snap de seção (puxa a rolagem sozinho; o
briefing proíbe scroll hijacking — pendente, seção 10); preloader e Barba
(site de uma página só).

### 21st.dev (componentes pedidos pelo Matheus)

Os prompts do 21st.dev pedem shadcn + Tailwind + TypeScript (+ framer-motion).
**Nada disso é instalado:** o efeito é lido e refeito com GSAP e os tokens.
Instalar traria um segundo sistema de animação disputando a rolagem com a
GSAP e peso sem ganho. Sempre explicar isso a ele na resposta.

| Componente 21st.dev | Onde virou | Correções feitas no original |
|---|---|---|
| Image Comparison Slider | `Results.jsx` (`Compare`) | "antes" à esquerda (o original invertia); pointer events com captura; teclado e leitor de tela |
| Smooth Scroll Hero | Experiência (`montarExperiencia`) | progresso da SEÇÃO (o original lia o scroll da página e só funcionava no topo); janela no formato da foto; foto inteira no fim |

---

## 4. Sistema de movimento

Cada elemento declara o efeito por atributo; `motion.js` faz o resto.

| Atributo | Efeito |
|---|---|
| `data-anim="linhas"` | cada linha sobe por máscara (frases, parágrafos) |
| `data-anim="letras"` | cada letra se desdobra (só título **curto**; nunca dentro de carrossel — seção 7) |
| `data-anim="cortina"` | cortina diagonal + foto desinfla |
| `data-anim="bloco"` | sobe com fade |
| `data-fio` | o traço fino se desenha (`::before` lendo `--fio`) |
| `data-anim-grupo` | filhos disparam juntos, em cascata |
| `data-parallax="img"` / `"sobe"` | foto flutua na moldura / bloco sobe mais rápido (**todas as larguras**) |
| `data-tema="claro\|escuro"` | cor do header sob a seção |
| `data-trilho="Nome"` | nome da seção na régua lateral |

**Garantias — não quebrar:**
1. **Sem JS, sem movimento ou em aba oculta, tudo nasce legível.** O
   esconderijo só existe sob `<html data-motion="on">`, marcado num
   `useLayoutEffect` (antes da primeira pintura). Uma animação CSS de 0s com
   atraso de 5s devolve a visibilidade se o JS morrer no meio.
2. Só `transform`, `opacity`, `clip-path`.
3. **Depois de revelado, o SplitText é desfeito** (`revert`). Exceção: as
   linhas das frases do hero e da Experiência, porque aquelas timelines são
   reversíveis (presas à rolagem).
4. Gatilho de revelação se desliga no próprio disparo (`self.kill()`).
5. Rede de segurança: a abertura do hero é concluída à força por
   `setTimeout` se o `rAF` estiver estrangulado.
6. `prefers-reduced-motion`: sem Lenis, sem divisão de texto, hero e
   Experiência estáticos, carrossel não gira sozinho. A troca de cor do
   header por seção (`temasPorSecao`) roda **também** nesse modo.
7. **Cor do header/régua sobre algo animado com `scrub` segue o QUADRO
   desenhado** (no `onUpdate` do tween), não a posição da rolagem — com
   `scrub: 1` a animação chega até 1s depois.

### Celular = mesmas animações (21/09/2026)

Pedido do Matheus: o layout do celular pode ser diferente, mas **toda
animação do desktop roda no celular**. O que foi ligado:

- **Parallax** (`data-parallax` img/sobe) em qualquer largura (antes ≥861px).
- **Régua lateral** compacta dentro da margem de 20px (antes ≥1000px).
- **Hero**: "Praia"/"Grande" acima e abaixo do nome (dos lados não cabe) e
  saem deslizando igual; a legenda "Jade Romero / Tratamentos faciais
  personalizados" corre na vertical pela margem DIREITA (a esquerda é da régua).
- **Hover → toque**: cada efeito de hover tem o equivalente em `:active` sob
  `@media (hover: none)`; `main.jsx` escuta `touchstart` (senão o iOS ignora `:active`).
- **Rolagem por toque continua nativa** (Lenis só suaviza a roda do mouse).
  `syncTouch` deixa o dedo "atrasado" no iPhone; as animações presas à rolagem
  funcionam igual com a rolagem nativa — conferido com `cdp.mjs toque`.
- **Sobreposições** foto-sobre-palavra (Tratamentos) só a partir de 700px: no
  celular a palavra é pequena e a foto escondia metade dela.
- **Celular baixo** (≤700px de altura, iPhone SE/8): o parágrafo de apoio do
  hero sai (a mão levantada da Jade encostava no "Agendar horário"); ≤600px a
  foto do hero também encolhe (62→56svh).
- **Régua no celular** centrada na margem (`left` calculado pelo `--gutter`),
  `line-height: 1` e número de 7px: antes ficava a 3px do texto ("06antes").

**Revisão completa no celular (22/09/2026):** 320×568, 360×780, 375×667,
390×844 e 430×932 — revelações, rolagem lateral, movimento reduzido, cliques e
menu, os dois comparadores com dedo, topo que some/volta, carrossel (trocas e
automático), rolagem com o dedo pela página inteira (arco, cúpula, janela da
Experiência, régua nas 11 seções, cor do header), contraste do CTA. Na
abertura o celular baixa só 2 imagens (hero 20 KB + capa do vídeo 44 KB).

---

## 5. O hero

Seção de **380svh** com palco `sticky`. Uma timeline presa à rolagem
(`scrub: 1`), progresso de 0 a 1:

| Progresso | O que acontece |
|---|---|
| carregamento | arco abre de baixo; "JADE ROMERO" letra a letra; "Estética e Beleza" é **escrito** (clip-path na curva `escrita`) |
| 0 – 0,34 | arco cresce até a tela inteira; a cena desliza do rosto-no-centro para a composição final; "Praia"/"Grande" saem pelos lados |
| 0,30 – 0,46 | frase dela sobe por linhas; botões entram |
| 0,50 – 0,72 | pausa |
| 0,72 – 1 | cúpula `--c-foto-noite` sobe com "Corpo · Mente · Emoção" curvado e **abre a foto do Manifesto** (mesma cor). Régua fica clara a 0,855, header a 0,9 (geometria do círculo) |

Header fica escuro (texto claro) nos primeiros **22%** — medido: a 28% o arco
já cobria o canto do header.

**Geometria da foto** (`hero-jade.webp`, 1136×1385), medida pixel a pixel:
- 28% de cima é campo vazio; ela ocupa 92% da largura
- mão levantada começa em **7,57%** da largura; topo da cabeça em **28,16%**
  da altura; centro do rosto em **(0,77 ; 0,45)**
- **o corpo toca a borda direita do arquivo de 60% a 100% da altura** → ela
  **sempre sangra pela direita**, nunca recua (recuar mostra um corte reto na manga)
- altura final = menor entre a restrição da mão (a ~72px do texto) e a do
  rosto (108px abaixo do topo, afundando pela base até 12%)

Celular: foto embaixo, frase em cima, botão de agendar dentro da 1ª tela.
Estático (sem movimento): hero de uma tela, composição final; no desktop o h1
vira `sr-only` para não brigar com o selo do header.

---

## 6. As outras seções

| Seção | Estado |
|---|---|
| **Header** | sem barra; selo circular gira com a rolagem; links empilhados à direita. **Selo e links somem ao rolar para baixo e voltam no primeiro gesto para cima** (links 21/09, selo 22/09/2026 — passavam por cima do conteúdo). Perto do topo, com menu aberto ou com foco de teclado, ficam visíveis. Menu fechado = `visibility: hidden` + `inert` (seção 7) |
| **Régua lateral** | número + nome da seção + fio de progresso; tema próprio (segue o **meio** da tela); compacta no celular |
| **Manifesto** | foto `jade/autocuidado.webp` (frase "Autocuidado não deveria…" gravada nela) ocupando o bloco; fundo `--c-foto-noite`, bordas dissolvidas; assinatura "Jade Romero ── Estética e Beleza". Sem parallax (o recorte de 124% cortava o cabelo) |
| **Sobre** | seção nude; retrato **inteiro** (proporção do arquivo, sem parallax — cortava a cabeça), bordas dissolvidas. Título = "Jade Romero" + "Esteticista · Tratamentos faciais personalizados"; texto centrado no posicionamento dela, sem "sobrancelhas e micropigmentação". A frase "Catorze anos olhando…" saiu (21/09/2026) |
| **Tratamentos** | carrossel "Real-Life Location": nome gigante, foto por cortina, ‹ 01 — 04 › ‖. Fotos `images/tratamentos/` em **4:5** (3 das 4 são retratos; a de micropigmentação foi recortada da horizontal em volta do rosto). **Troca sozinha a cada 5,5s**: pausa com mouse em cima, foco de teclado dentro, fora da tela e com a aba escondida; botão ‖ (WCAG 2.2.2); linha de tempo sob a foto; não gira com movimento reduzido; `aria-live` desligado enquanto gira |
| **Destaque** | Micropigmentação, fundo escuro; foto `jade/micropigmentacao.webp` sangrando à direita, com parallax |
| **Resultados** | título + **dois cards** do mesmo tamanho, alinhados pelo topo; título, cards e aviso nas mesmas bordas (`.results__bloco`). Caso sem arquivo vira "em breve" sozinho (`onError`). Comparador: arrastar em qualquer ponto da foto, alça que cresce no arraste, rótulos Antes/Depois que somem no lado estreito, vaivém de apresentação uma vez; `<input type="range">` invisível para teclado/leitor. **Caso 01**: "Protocolo personalizado para cicatriz de acne" (texto dela na foto). **Caso 02** (`antes3`/`depois3`, foto de cima, rosto de ponta-cabeça como ela postou): a ANTES foi ampliada 1,29× e deslocada para olhos/sobrancelhas/nariz coincidirem — só escala e posição; título "Protocolo personalizado para hidratação e luminosidade" + `descricao` enviada pelo Matheus. Novo caso = nova entrada em `results` no `site.js` |
| **Experiência** | Smooth Scroll Hero: trilho de 260svh, palco sticky; a foto (`jade/experiencia.webp`, Jade cercada de mãos com instrumentos) abre de uma janela vertical logo abaixo de "AUTOCUIDADO" até a tela cheia (`clip-path: inset()`), zoom 1,7→1 partindo do rosto, que começa centrado na janela e desliza até o lugar. No fim a foto aparece **inteira** (`contain` — cover cortava, o Matheus pediu inteira), deslocada para a direita no desktop (72%), sobras em `--c-foto-estudio`. Véu escuro e a frase `sintonia` sobem no escuro da esquerda. Header/régua trocam pelo quadro desenhado, num trigger até a base do trilho passar pelo header. Depois, os 4 pontos em rolagem normal |
| **Números / Avaliações** | 14+, 4,9, 265+; os dois depoimentos reais; depoimentos pares com parallax "sobe" |
| **CTA** | "Seu momento de cuidado começa aqui." + botão + botão circular com texto girando. **Fundo em vídeo** `public/video/cuidado.mp4` (22/09/2026): vídeo novo do Matheus, 1280×720, 24fps, editado com títulos dos procedimentos ("Limpeza de pele", "Fototerapia para acne", "Radiofrequência Microagulhada"); cortado em 7,88s, antes do card final estático "Tem corretivo que não craquela" (virava 2s de foto parada no loop); sem áudio, CRF 26, **0,69 MB**; original em `J/video-site-original.mp4`. Carrega só perto da tela, pausa fora; movimento reduzido = só a capa. Véu `--cta-veu` 58%. **Contraste medido** (`ferramentas/contraste.py`, 7 quadros, pior caso): título 5,4:1 desktop / 5,1:1 celular; telefone passou de champanhe (2,8:1, reprovava) para marfim (6,6 / 5,3:1) |
| **Localização** | mapa do **perfil da empresa dela no Google** (alfinete com o nome, 4,9 ★ e 265 avaliações no cartão), embed sem chave de API montado em `mapa` no `site.js` a partir do link de compartilhar (22/09/2026); filtro quente (`grayscale + sepia`) para caber na paleta; `loading="lazy"`. O próprio mapa traz "Abrir no Maps" — não pôr botão nosso por cima. "Como chegar" abre a rota pelo endereço |

**Frases dela** (`frasesJade` em `site.js`, chaves pelo CONTEÚDO). Nenhuma se
repete na página:

| Chave | Onde |
|---|---|
| `reconhecer` "Não é sobre mudar quem você é…" | hero |
| `autocuidado` "Autocuidado não deveria acontecer…" | gravada na foto do Manifesto (vai no alt e no título escondido) |
| `sintonia` "Quando corpo, mente e emoção estão em sintonia, a **BELEZA**…" | frase final da Experiência; "BELEZA" em caixa alta e champanhe, como ela escreveu |
| `areaDosOlhos` | guardada, sem lugar |

A peça do **New York Post** foi deixada de fora: é citação de jornal, não fala dela.

---

## 7. Armadilhas do site

| Armadilha | O que acontece | Solução |
|---|---|---|
| **`gsap.from` com StrictMode** | 2ª execução lê `opacity 0` como destino; hero some | Sempre `fromTo` |
| **CSS `translateX(-50%)` + GSAP `xPercent`** | GSAP lê o CSS como `x` e soma; elemento meia largura fora | `gsap.set(el, { x: 0, xPercent: -50 })` |
| **`aspect-ratio` inline do `Figure`** | Vence qualquer CSS; breakpoint não consegue trocar | `ratio={null}` e proporção no CSS |
| **`aspect-ratio` + `max-height`** | Largura é derivada da altura; foto encolheu para 221px | Largura 100% + altura fixa + `object-fit` |
| **`once: true` do ScrollTrigger** | Só desliga quando o elemento sai por cima; no fim da página nunca | `self.kill()` dentro do `onEnter` |
| **Gatilho no fim da página** | Mede a posição já com o deslocamento da animação; cai além do fim da rolagem e nunca dispara | `start: 'clamp(top bottom)'` |
| **`hidden` + `display: flex`** | O CSS anula o `hidden`; o menu fechado (opacidade 0) ficou por cima do site inteiro e bloqueava todo clique/arraste — auditoria visual não pega | Fechado = `visibility: hidden` + `pointer-events: none` + `inert`. Conferir com `cdp.mjs cliques` |
| **Teste com evento sintético** | `dispatchEvent` direto no elemento "funciona" mesmo com algo invisível por cima — foi assim que o bug acima passou | Testar interação com `Input.dispatch*` do CDP (mouse/dedo reais) |
| **SplitText `revert()` no fim da troca do carrossel** | O nome do 1º slide tinha revelação `letras` própria; o fim dela desfazia o "esconder" da troca e FACIAIS ficava parado por cima dos outros | Revelação no bloco (`.treatments__nomes` = `bloco`), estado final reafirmado depois do revert e, a cada troca, todo slide fora do par é escondido. Conferir com `cdp.mjs slides` |
| **Cor do header com `scrub`** | Decidida pela rolagem, trocava antes de a foto chegar (atraso de 1s) e voltava quando a animação terminava com a foto ainda na tela | Decidir no `onUpdate` do tween, num trigger separado que vai até a base do trilho passar pelo header |
| **Parallax 124% em retrato** | O zoom corta a cabeça ou o cabelo | Tirar o parallax dessa foto (Sobre, Manifesto) |
| **Header com movimento reduzido** | A troca de cor por seção só rodava com animação; header escuro sumia sobre seções escuras | `temasPorSecao()` roda nos dois modos |
| **Foto com fundo preto sobre fundo "quase igual"** | O retângulo da imagem aparece | Amostrar a cor do fundo da foto para a seção + `mask-image` nas 4 bordas |
| **Texto gravado em vídeo do Instagram** | Nome da música, @ e ícone aparecem no fundo | `ffmpeg delogo` só no intervalo em que cada um aparece (medir quadro a quadro); cortar a tela preta final |
| **Clique medido durante animação** | O teste de menu mediu o botão enquanto o header ainda voltava (0,6s) e clicou no lugar errado — "menu não abre" falso | Esperar a transição antes de medir coordenadas (`cliques` já espera 1s) |
| **Controles com espaço fixo a 320px** | Botão de pausa novo empurrou a fileira 7px além da tela | Espaços e barra proporcionais (`clamp` com `vw`) |
| **Caixa `absolute` com `left: 50%`** | Só tem metade da largura; "ROMERO" quebrou em "ROME / RO" | `width: max-content` |
| **Palavra gigante com `nowrap`** | "MICROPIGMENTAÇÃO" vazou 40px no celular | Medir a largura em `em` (10,73em) e derivar o `vw` |
| **Cena deslocada dentro do arco** | Borda da cena descobre a moldura escura | `::before` com `inset: -60vmax` estendendo o campo |
| **Sentinela no rodapé do hero** | Hero mais alto que a tela → header nascia no estado errado | Observar o hero inteiro com `IntersectionObserver` |
| **Lenis + menu aberto** | Travar o `body` não para a roda do mouse | `pararRolagem()` / `retomarRolagem()`; retomar **antes** do clique em âncora |
| **Chrome headless `--virtual-time-budget`** | Não entrega quadros de `rAF` no ritmo real: 51 elementos "presos" que não existiam | Auditar por CDP com relógio real (`ferramentas/cdp.mjs`) |
| **`synthesizeScrollGesture` com `touch` no headless** | Não rola nem uma página em branco — parece bug do site | `Input.dispatchTouchEvent` (é o padrão do modo `toque`) |
| **Chrome headless `--timeout` + `--dump-dom`** | Não espera: despeja a página em 2,5s | Idem |
| **Painel de navegador do app oculto** | `innerWidth 0`, `IntersectionObserver` não entrega, `rAF` e transições param, print em branco | Não confiar no painel; usar as ferramentas headless |
| **Comentário JSX antes do elemento raiz** | Quebra o build | Comentário JS acima do `return` |
| **Heredoc no bash com crase ou caracteres como ‹ › ──** | Bash tentou interpretar / "unexpected EOF" | Script Python em arquivo (scratchpad), rodado com `python arquivo.py` |

---

## 8. Verificação

Com o servidor rodando, de dentro de `site/`:

```bash
node ferramentas/cdp.mjs auditar 1920x1080 1440x900 375x812 320x640   # elemento preso + rolagem lateral
REDUZIDO=1 node ferramentas/cdp.mjs auditar 1440x900 375x812
node ferramentas/cdp.mjs vaza 375x812 320x640
node ferramentas/cdp.mjs cliques 1440x900 375x812   # algo invisível roubando clique? + menu abre/fecha
node ferramentas/cdp.mjs arrastar 1440x900 375x812  # comparador com mouse/dedo reais (CARD=1 = 2º card)
node ferramentas/cdp.mjs topo 1440x900 375x812      # selo e links do header somem/voltam
node ferramentas/cdp.mjs slides 1440x900 375x812    # só o par da troca aparece no carrossel
node ferramentas/cdp.mjs autoplay 1440x900 375x812  # troca sozinha, para com mouse e com o botão
PASSOS=34 node ferramentas/cdp.mjs toque 375x812   # rola com o DEDO e lê hero/cúpula/janela/tema
python ferramentas/contraste.py 0.5 1 2.5 5 7.5     # contraste do CTA sobre o vídeo (ver cabeçalho do script)
node ferramentas/cdp.mjs foto '1440x900:.experience__trilho@0.8:1600'  # '@n' = n telas depois do topo do bloco
W=375 H=812 node ferramentas/ref.mjs http://localhost:5183/ rolar 0,0.5,1,1.5,2
```

Variáveis do modo `foto`: `VIDEO_T=6` congela os vídeos nesse segundo;
`ESCONDER=.seletor` some com um elemento (para medir o fundo atrás do texto);
`AVALIAR='expressão'` imprime um valor da página no momento da foto;
`OUT=pasta` muda a saída.

**Última auditoria (22/09/2026):** zero elemento preso e zero rolagem lateral
em 1920, 1440, 390, 375, 360 e 320; movimento reduzido limpo; 24 links e
botões clicáveis; todos os testes de interação acima passando no computador e
no celular. "Restos de split" = 7 é esperado (linhas das frases presas à
rolagem).

---

## 9. Como o Matheus trabalha

- Prompts longos em português, com briefing detalhado. **O briefing vence o
  dataset** do ui-ux-pro-max (que devolveu rosa e lavanda para "beauty").
- Quando manda referência, quer **fidelidade**, não "inspirado em". Filmar
  antes de implementar.
- Pede para mexer **só no bloco** do pedido — não alterar os outros.
- Pede "profissional e sofisticado": na prática, alinhamento de bordas entre
  título/cards/aviso, fotos inteiras, cores amostradas, nada colado.
- Decide o hero ele mesmo; quer ver opções concretas, não descrição.
- Aceita recomendação quando vem com o porquê (ex.: topo que some e volta em
  vez de sumir de vez).
- `public/images/Procedimentos/` guarda os originais do antes/depois; o site
  usa as cópias recortadas em `images/resultados/`.
- Skill global `criar-site` (ui-ux-pro-max → frontend-design → emil-design-eng
  → framer-motion). Dizer ao final quais skills foram aplicadas.

---

## 10. Pendências e decisões abertas

**Esperando o Matheus:**
- **Vídeo do CTA** trocado em 22/09/2026 pelo que ele gravou. Os títulos
  gravados no vídeo aparecem atrás da frase do CTA (legível, medido); se
  incomodar, pedir uma versão sem títulos.
- **Caso 01 do antes/depois possivelmente trocado:** o arquivo DEPOIS mostra
  mais manchas que o ANTES (e o ANTES tem o título do post). Confirmar com a
  Jade; trocar é inverter `before`/`after` em `results` no `site.js`.
- **Caso 02:** manter de ponta-cabeça (como ela postou) ou girar 180°?
- **Caso 01:** não tem `descricao` como o caso 02; ele pode mandar uma frase.
- Snap de seção da referência: ativar ou não?
- A frase e o botão do hero só aparecem depois da primeira rolagem. OK para conversão?
- **"MICROPIGMENTAÇÃO" em destaque gigante** (carrossel e seção Destaque)
  contraria o posicionamento dela ("tratamentos faciais personalizados").
- Anos de experiência: o site diz **14+**; o post dela diz "mais de 10".

**Fotos:**
- Tratamentos: faciais e micropigmentação **parecem banco de imagem/IA**, não
  atendimento dela; sobrancelhas tem uma lista longa de texto que fica miúda no
  card. Versões reais e sem texto deixariam o carrossel mais forte.
- Faltam da cliente: foto do espaço, `og.jpg` 1200×630; **autorização escrita
  das duas clientes do antes/depois**.
- Mapa do Google grava cookies do Google em quem visita. Se ela quiser mais
  cuidado com a LGPD: trocar por uma "fachada" (imagem + botão "Ver mapa") que só
  carrega o iframe no toque.

**Depois de publicar:**
- Card "MEU SITE" da bio ainda está com `https://TROCAR-PELO-ENDERECO-DO-SITE`:
  trocar por `https://jaderomero.vercel.app` (a bio é da outra sessão).
- `og:image` (imagem de compartilhamento 1200×630) e domínio próprio, se ela quiser.
- Autorização das clientes do antes/depois: o Matheus confirmou que existe (22/09/2026).

**Ainda da referência:** rolagem horizontal, linha de mapa se desenhando,
flores sobrepondo seções (precisa das florais em line art dela, sem fundo).

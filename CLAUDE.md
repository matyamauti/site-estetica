# Projeto Jade Romero

Freelance do Matheus para **Jade Romero**, esteticista em Praia Grande/SP.
Duas entregas: a **bio** (link da bio do Instagram) e o **site**.
O site tem o próprio guia: **`site/CLAUDE.md`**.

Última atualização: 18/09/2026.

---

## 1. Regras invioláveis

1. **Medir, não estimar.** Toda afirmação sobre layout, cor ou contraste sai de
   medição no navegador ou de amostragem de pixel. Nunca de "parece que".
2. **Nunca chumbar valor.** Cor, raio e espaçamento vêm de token (`:root` no
   HTML, coleção `Tokens` no Figma). Se precisou de um hex solto, virou dívida.
3. **Testar o caminho de falha.** Toda integração externa precisa ter sido
   testada com a fonte fora do ar, com dado sujo e com entrada maliciosa.
4. **Português em tudo que o cliente vê** — arquivos de `entrega/`, comentários
   no código, manual, nomes de coluna.
5. **Dizer o que quebrou.** Erro, limite de plano e suposição errada são
   reportados na hora, com a evidência. Nunca maquiar.

---

## 2. A marca

**Paleta de marca: fundo nude `#DEC4B1`.** Medido por amostragem em quatro
peças publicadas por ela. Não é estimativa.

Sistema gráfico dela: nude de fundo, texto marrom quase preto, muita caixa alta
com tracking largo, palavra de destaque em script creme, acento terracota
(~`#9C6B52`), florais em line art.

**Assinatura:** `JADE ROMERO | ESTÉTICA E BELEZA` — com "e", nunca "&".

**Como ela quer ser descrita:** "tratamentos faciais personalizados" (definido
por ela em 18/09/2026). Não usar "sobrancelhas e micropigmentação" — é o
histórico dela, não o posicionamento atual.

**A voz é dela e é melhor que qualquer copy inventada:**

- "Autocuidado não deveria acontecer só quando você está exausta."
- "Não é sobre mudar quem você é, mas sobre se reconhecer em quem você sempre foi..."
- "Quando corpo, mente e emoção estão em sintonia, a BELEZA se torna um estado de espírito."

### Divergência aberta entre bio e site

| | Fundo | Acento |
|---|---|---|
| Bio | `#0A0908` quase preto | `#B08D5E` ouro |
| Site | `#f7f2ee` marfim | `#96573f` clay |

A bio escura foi escolha de projeto, para casar com uma foto de fundo preto —
funciona como peça, mas **o site é que está alinhado com a marca real**.
Como as duas serão entregues juntas, isso precisa ser resolvido. Caminho mais
barato: mesma tipografia (Fraunces) e mesmo dourado nas duas, e a bio passa a
ler como "versão noturna" da mesma marca.

---

## 3. A bio (`bio/`)

**No ar:** https://jaderomero-estetica.netlify.app
**Site:** https://jaderomero.vercel.app (Vercel, publicado em 22/09/2026)
**Stack:** HTML único, sem build, sem framework. ~20KB.

React foi descartado de propósito: para uma lista de links, ele custaria ~150KB e a página
roda no navegador embutido do Instagram, que é limitado. Isso contraria o
padrão do pacote `criar-site` — a decisão é consciente e está documentada aqui.

### Arquitetura dos links

Os links vêm de uma **planilha do Google publicada em CSV**, para a Jade editar
sozinha. Os mesmos links estão **escritos no HTML como reserva**.

```
planilha responde  →  usa a planilha
planilha falha     →  usa os links do HTML
linha sem título ou sem link  →  pula só aquela linha
URL que não for http/https    →  bloqueada
```

A página **nunca fica sem links**. Isso foi testado com 404, com planilha vazia,
com cabeçalho apagado e com `javascript:alert(1)` numa célula.

Colunas: `destaque` (sim/nao) · `icone` · `titulo` · `descricao` · `link`
Ícones: `agenda` `grupo` `ebook` `estrela` `local` `presente` `coracao` `site` `link`

### Estrutura dos cards (decidida em 18/09/2026)

São **4 cards**, com **MEU SITE como principal**:

```
MEU SITE            ← dourado. O agendamento vive DENTRO do site.
GRUPO VIP
E-BOOK AGENDA CHEIA
AVALIE NO GOOGLE
```

**Consequência para o site:** ele passou a carregar a responsabilidade do
agendamento. O site PRECISA ter um botão de agendar visível e de fácil acesso,
levando ao WhatsApp. Sem isso, a bio não tem caminho para marcar horário.

Decisão do Matheus, com o custo conhecido e aceito: agendar passou de 2 toques
(bio → WhatsApp) para 3 toques mais um carregamento (bio → site → WhatsApp). Em
troca, quem chega ao WhatsApp já leu o site e vem mais decidido. A descrição do
card diz "Tratamentos e agendamento" justamente para quem só quer marcar saber
que o caminho é por ali.

### Dimensionamento

O alvo **não é** a altura da tela do celular. É a altura útil dentro do
navegador do Instagram, que é menor por causa da barra do app.

Medições com 4 cards, a 375px de largura:

| Altura útil | Rolagem | Cards inteiros |
|---|---|---|
| 700 (celular pequeno no Instagram) | **0** | 4 |
| 812 (tela cheia) | 0 | 4 |

Existe uma regra `@media (max-height:740px)` que encolhe o herói e a frase só
em tela baixa. É o que faz a página inteira caber no aperto sem penalizar celular
grande.

**O card principal termina em 379px.** Esse número é o que importa: ele
precisa estar visível sem rolagem em qualquer aparelho.

---

## 4. Armadilhas já descobertas

Cada uma destas custou tentativas. Não redescobrir.

| Armadilha | O que acontece | Solução |
|---|---|---|
| **Altura do card** | `min-height` não manda nada; quem define é o slot do ícone (40px) + respiro | Para encolher o card, encolher o slot e o padding juntos |
| **Chrome no Windows** | Ignora `--window-size` abaixo de ~500px; o layout acontece a 500 e o recorte corta a direita | Renderizar um `_mock.html` com `<iframe>` de 375px e recortar o canto superior esquerdo |
| **Cache do Google Sheets** | Servidor e navegador recebem versões diferentes da mesma planilha; `no-store` não resolve porque o cache é do lado do Google | Esperar alguns minutos. Avisar antes de demonstrar ao vivo |
| **`target="_blank"`** | Dentro de navegador embutido pode bloquear a abertura e o link de app não dispara | Navegar na mesma tela; a página é trampolim |
| **`wa.me/qr/...`** | Link de QR code expira quando o QR é regerado | Usar `wa.me/55DDD...?text=` com o número |
| **`share.google/...`** | Cai numa **busca** do Google, não no formulário de avaliação | Pegar o link direto de avaliação |
| **Figma `INSTANCE_SWAP`** | `addComponentProperty` exige o **ID do nó** (`"7:8"`), não a `key` — ao contrário da documentação | Testar formatos num componente descartável antes de chutar |
| **`figma.createAutoLayout()`** | Cria frame com **preenchimento branco** por padrão | `fills = []` em todo contêiner |
| **`textAutoResize`** | `resize()` depois de `"HEIGHT"` trava a altura | Largura primeiro, auto-height por último |
| **SVG com cor literal** | Cor gravada no SVG não segue token e sobrevive a troca de paleta | Vincular os strokes a variável depois de importar |
| **Arrastar pasta no Netlify** | O Explorer do Windows entrega cópia em cache; duas tentativas seguidas publicaram versão antiga com o arquivo local já correto | Gerar `.zip` e arrastar o zip. Conferir sempre comparando o HTML publicado com o local, nunca confiar no "Published" |
| **Screenshot de site animado** | Painel e Chrome headless congelam o relógio de animação; texto em máscara de revelação e scroll com Lenis aparecem em branco mesmo com o DOM correto | Não concluir pelo print. Conferir o DOM (`elementFromPoint`, opacidade, transform) e confirmar num celular de verdade. **Confirmado em 22/09/2026:** três renders em branco, celular real rodando normal |
| **Planilha local x planilha do Google** | O modelo `.csv` virou `.xlsx` no computador e foi editado no lugar da planilha real; o site não mudou | A única planilha ligada ao site é a do Google, aberta no navegador. Qualquer arquivo local é cópia |
| **Backtick no bash** | Crase dentro de string Python em `bash -c` vira substituição de comando | Usar heredoc `<<'PYEOF'` |

---

## 5. Convenções

- **Entregáveis para o cliente:** pasta `entrega/`
- **Mockup de celular:** receita do iframe (seção 4), saída 1125×2436
- **Servidor local:** `python -m http.server 8781 --bind 0.0.0.0` dentro de `bio/`
  (caminho relativo de imagem não resolve em `file://`)
- **Publicar:** gerar um `.zip` da pasta `bio` e arrastar **o zip** na aba
  **Deploys** do projeto. Arrastar a pasta direto não é confiável (ver armadilhas).
  Nunca usar o Drop de novo, senão cria site novo com outro endereço.
  Depois de publicar, **conferir** comparando o HTML publicado com o local.
- **Conta Figma:** plano Starter, seat View. Não cria arquivo pelo MCP e a cota
  acaba em ~28 chamadas, **não é diária**. Dimensionar antes de propor Figma.

---

## 6. Estado e pendências

| Item | |
|---|---|
| Bio construída, hospedada, HTTPS | ✅ |
| Planilha publicada e conectada | ✅ |
| Imagem de compartilhamento (1200×630) | ✅ |
| Reestruturação (4 cards, MEU SITE principal) | ✅ **no ar** desde 22/09/2026 |
| Links na mesma tela | ✅ no ar |
| Site | ✅ **no ar** em https://jaderomero.vercel.app (Vercel, 22/09/2026) — ver `site/CLAUDE.md` |
| Figma | ~90%, travado na cota |

**Bloqueadores:**

- Card "MEU SITE" está com `https://TROCAR-PELO-ENDERECO-DO-SITE` → trocar por `https://jaderomero.vercel.app`
- Falta dela: link novo do e-book, link de avaliação do Google, horário e
  endereço. O **WhatsApp já foi encontrado no site: `wa.me/5513988345368`**
  (link com número, não expira)

**Três dos quatro links da bio dela estão quebrados hoje**, inclusive o de
agendamento. Diagnóstico completo em `entrega/AGENDA.md`.

O plano de entrega está em `entrega/AGENDA.md`, em 5 fases.

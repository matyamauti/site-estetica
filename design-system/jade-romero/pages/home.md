# Página: Home — Override do MASTER

> Este arquivo **sobrepõe** o `MASTER.md` para a home, conforme a regra de
> recuperação hierárquica da skill `ui-ux-pro-max`.
> Gerado em 2026-09-17 a partir do briefing da cliente.

## Por que existe este override

O `MASTER.md` foi gerado por busca na base da skill com a consulta
`beauty skincare aesthetics studio premium`. O resultado devolveu a linha
"Beauty/Spa/Wellness Service" da `colors.csv`, que é **rosa e lavanda**
(`#EC4899`, `#8B5CF6`, fundo `#FDF2F8`), estilo *Soft UI Evolution* e padrão
*Hero + Testimonials + CTA* com carrossel.

O briefing da cliente fixou uma direção diferente e explícita: off-white,
bege, marrom, terracota, nude, champagne, com áreas escuras em `#171411` e
`#201B18`. A regra da skill `frontend-design` é clara — quando o briefing
fixa a direção visual, o briefing vence. Os itens abaixo, portanto,
substituem os do MASTER.

---

## Cor (substitui a tabela do MASTER)

| Papel | Hex | Token | Verificação |
|---|---|---|---|
| Base clara | `#F7F2EE` | `--c-ivory` | — |
| Fundo secundário | `#EFE7DF` | `--c-linen` | — |
| Areia | `#E3D5C8` | `--c-sand` | — |
| Nude | `#D8C3B4` | `--c-nude` | — |
| Acento (terracota) | `#96573F` | `--c-clay` | 5.06:1 sobre ivory ✔ |
| Texto | `#2B211C` | `--c-espresso` | 14.1:1 sobre ivory ✔ |
| Texto secundário | `#6B5A50` | `--c-espresso-soft` | 5.9:1 sobre ivory ✔ |
| Escuro | `#171411` | `--c-ink` | definido pela cliente |
| Escuro alternativo | `#201B18` | `--c-ink-2` | definido pela cliente |
| Apoio no escuro | `#C4AE94` | `--c-champagne` | 8.6:1 sobre ink ✔ |

O terracota foi escurecido de propósito até passar 4.5:1. O tom claro que a
paleta pedia originalmente reprovava no contraste de texto.

## Tipografia (substitui a do MASTER)

O MASTER indicou **Playfair Display + Inter** (linha "Classic Elegant" da
`typography.csv`). Esse par é o padrão mais reconhecível de página gerada
por IA, e a `frontend-design` manda não gastar um eixo livre num default.

Adotado no lugar, também vindo da base da skill (linha "Magazine Style"):

- **Títulos:** Libre Bodoni — didone de alto contraste, a classe tipográfica
  das capas de revista de moda.
- **Texto:** Public Sans — grotesca neutra derivada da Franklin, que é o par
  histórico do didone na diagramação impressa.

Duas famílias, nunca mais que isso.

## Padrão de página (substitui o do MASTER)

O MASTER indicou *Hero + Testimonials + CTA* com carrossel de depoimentos.
Descartado: há dois depoimentos reais, e um carrossel esconderia conteúdo
que cabe na tela.

Ordem real, definida no briefing:

Header → Hero → Manifesto → Sobre → Tratamentos → Destaque → Resultados →
Experiência → Números → Avaliações → Galeria → CTA → Localização → Footer

**Ritmo de valor** (o que impede a página de virar um rolo só):
claro → claro → claro → areia → **escuro** → claro → claro → areia →
claro → areia → **escuro** → claro → **escuro**.

## Composição

Cada seção tem uma composição própria. Nenhuma se repete:

| Seção | Composição |
|---|---|
| Hero | Capa de revista: foto sangrada, título sobre a imagem, trilho vertical |
| Manifesto | Só tipografia, segunda frase recuada, muito ar |
| Sobre | Retrato sangrando à esquerda, texto em 5/7 |
| Tratamentos | Índice numerado com preview lateral — não grade de cards |
| Destaque | Faixa escura, foto sangrando à direita |
| Resultados | Comparador antes/depois com `clip-path` |
| Experiência | Faixa larga com título sobreposto + quatro colunas em escadinha |
| Números | Três valores grandes separados por fio |
| Avaliações | Duas citações desalinhadas verticalmente |
| Galeria | Grade 6 colunas com spans irregulares |
| CTA | Centralizado — o único ponto centralizado da página |
| Localização | Endereço em 5/7 com espaço reservado para o mapa |

## Motion

Mantido o tier **Subtle** do MASTER (deslocamento de 12–16px, `power1.out`),
com duas adições:

- uma entrada orquestrada **apenas no hero**, feita com `fromTo` (nunca
  `from`, que grava o destino no instante da criação do tween e quebra em
  remontagem);
- `clip-path: inset()` como revelação de imagem, em três pontos da página.

Parallax só acima de 861px e só com `prefers-reduced-motion: no-preference`.

## Container

Uma única regra estrutural, em `src/styles/layout.css`:

```
distância até a borda = max(--gutter, (largura disponível - 1320px) / 2)
```

`.site-container` e os utilitários `.u-edge-*` usam a mesma conta, então uma
foto sangrada e um parágrafo continuam no mesmo eixo. A conta usa `100%`
(largura útil) e nunca `100vw`, que inclui a barra de rolagem.

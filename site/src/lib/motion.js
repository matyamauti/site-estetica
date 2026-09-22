import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

/* =============================================================
   MOTION

   Sistema de revelação ao rolar inspirado em era-residence.com.
   Tiramos de lá o SISTEMA — curvas, durações e o critério de qual
   efeito vai em qual tipo de elemento —, não o código.

   Curvas: mesmos pontos de controle do CustomEase da referência.
     saida      0.25, 1, 0.5, 1   → tudo que entra
     travessia  0.75, 0, 0.25, 1  → cortinas de imagem

   Tipos (atributo data-anim):
     linhas   frase/parágrafo: cada linha sobe por dentro de uma máscara
     letras   título CURTO: cada letra se desdobra no eixo Y
     bloco    botão, número, item: sobe 3rem com fade
     cortina  imagem: cortina diagonal + a foto desinfla por dentro
   Extras:
     data-fio               o traço fino se desenha da esquerda
     data-anim-grupo        itens dentro disparam juntos, em cascata
     data-parallax="img"    a foto flutua dentro da moldura
     data-parallax="sobe"   o bloco inteiro sobe mais rápido

   O que NÃO veio da referência, de propósito:
     - snap de seção (puxa a rolagem sozinho — o briefing proíbe
       scroll hijacking);
     - preloader e transição de página (site de uma página só).

   Regras que continuam valendo:
     1. Sem JS, sem movimento ou em aba oculta, o conteúdo nasce
        legível. O esconderijo inicial só existe sob
        <html data-motion="on">, e o CSS ainda revela tudo sozinho
        depois de 5s caso o JS morra no meio do caminho.
     2. Só transform, opacity e clip-path.
     3. Depois de revelado, o texto dividido é desfeito (revert):
        o DOM volta a ser o texto original, que refaz a quebra de
        linha no resize e é lido limpo por leitor de tela.
   ============================================================= */

/* Só em desenvolvimento: acesso ao ScrollTrigger pelo console. */
if (import.meta.env.DEV) window.__jrMotion = { gsap, ScrollTrigger };

CustomEase.create('saida', '0.25,1,0.5,1');
CustomEase.create('travessia', '0.75,0,0.25,1');
CustomEase.create('escrita', '0.333,0,0.667,1');
CustomEase.create('entrada', '0.5,0,0.75,0'); /* "In" da referência: o que sai */

const DUR = 1.2;
const INTERVALO = 0.1;
const INTERVALO_LETRA = 0.05;
const ATRASO_BASE = 0.3;
/* clamp(): o ponto de disparo nunca passa do máximo que a página
   consegue rolar. Sem ele, o que mora no fim da página (o rodapé)
   nunca disparava — medido: o gatilho lê a posição já com os 3rem
   de deslocamento da animação e caía além do fim da rolagem. */
const INICIO = 'clamp(top bottom)';

let lenis = null;

/* O menu mobile trava a rolagem do fundo; com Lenis ativo, travar o
   body não basta — a roda do mouse continuaria rolando a página. */
export function pararRolagem() {
  lenis?.stop();
}

export function retomarRolagem() {
  lenis?.start();
}

function iniciarLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true, // no toque a rolagem continua nativa
    anchors: { offset: -96 }, // mesmo respiro do scroll-padding do header
  });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis?.destroy();
    lenis = null;
  };
}

/* Cada tipo prepara o estado inicial e devolve a função que revela.
   A função de revelar devolve os tweens, para a rede de segurança do
   hero conseguir concluí-los à força. */
const TIPOS = {
  linhas(el) {
    const split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'jr-linha',
    });
    gsap.set(split.lines, { yPercent: 110 });
    return (atraso) => [
      gsap.to(split.lines, {
        yPercent: 0,
        duration: DUR,
        ease: 'saida',
        stagger: INTERVALO,
        delay: atraso,
        onComplete: () => split.revert(),
      }),
    ];
  },

  letras(el) {
    const split = SplitText.create(el, {
      type: 'words,chars',
      charsClass: 'jr-letra',
    });
    gsap.set(split.chars, { opacity: 0, yPercent: 50, rotateY: 90 });
    return (atraso) => [
      gsap.to(split.chars, {
        opacity: 1,
        yPercent: 0,
        rotateY: 0,
        duration: DUR,
        ease: 'saida',
        stagger: INTERVALO_LETRA,
        delay: atraso,
        onComplete: () => split.revert(),
      }),
    ];
  },

  bloco(el) {
    gsap.set(el, { opacity: 0, y: '3.333rem' });
    return (atraso) => [
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: DUR,
        ease: 'saida',
        delay: atraso,
        clearProps: 'opacity,transform',
      }),
    ];
  },

  cortina(el) {
    const imgs = el.querySelectorAll('img');
    gsap.set(el, { clipPath: 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)' });
    gsap.set(imgs, { scale: 1.5, xPercent: 25 });
    return (atraso) => [
      gsap.to(el, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: DUR,
        ease: 'travessia',
        delay: atraso,
        clearProps: 'clipPath',
      }),
      gsap.to(imgs, {
        scale: 1,
        xPercent: 0,
        duration: DUR,
        ease: 'travessia',
        delay: atraso,
      }),
    ];
  },

  /* O fio fino: é o motivo gráfico da marca, vem do fio a fio da
     micropigmentação. Aqui ele se desenha da esquerda. A linha é um
     ::before que lê a variável --fio (ver base.css). */
  fio(el) {
    gsap.set(el, { '--fio': 0 });
    return (atraso) => [
      gsap.to(el, { '--fio': 1, duration: DUR, ease: 'saida', delay: atraso }),
    ];
  },
};

function preparar(el) {
  const reveladores = [];
  if (el.dataset.anim && TIPOS[el.dataset.anim]) reveladores.push(TIPOS[el.dataset.anim](el));
  if (el.hasAttribute('data-fio')) reveladores.push(TIPOS.fio(el));
  gsap.set(el, { visibility: 'visible' });
  return (atraso) => reveladores.flatMap((r) => r(atraso));
}

/* -- hero: coreografia presa à rolagem ------------------------- */

/* Medidas do arquivo da foto de abertura (1136×1385), usadas para
   enquadrar o ROSTO dela no centro do arco na abertura. */
const FOTO = { proporcao: 1136 / 1385, rostoX: 0.77, rostoY: 0.45 };

function montarHero({ desktop, comAbertura }) {
  const palco = document.querySelector('[data-hero-palco]');
  if (!palco) return null;
  const hero = palco.parentElement;
  const q = (s) => palco.querySelector(s);
  const arco = q('[data-hero-arco]');
  const abertura = q('[data-hero-abertura]');
  const cena = q('[data-hero-cena]');
  const fig = q('.hero__figure');
  const marca = q('[data-hero-marca]');
  const script = q('[data-hero-script]');
  const lados = palco.querySelectorAll('[data-hero-lado]');
  const deixa = q('[data-hero-deixa]');
  const fundo = q('[data-hero-fundo]');
  const conteudo = q('[data-hero-conteudo]');
  const acoes = q('[data-hero-acoes]');
  const cupula = q('[data-hero-cupula]');

  /* Geometria do arco, em px, a partir do palco. */
  const geo = () => {
    const W = palco.clientWidth;
    const H = palco.clientHeight;
    const larg = desktop ? Math.min(W * 0.3, 480) : W * 0.62;
    const alt = desktop ? H * 0.54 : H * 0.5;
    return { W, H, larg, alt, lado: (W - larg) / 2, topo: H - alt };
  };
  const arcoInicial = () => {
    const g = geo();
    const r = g.larg / 2;
    return `inset(${g.topo}px ${g.lado}px 0px ${g.lado}px round ${r}px ${r}px 0px 0px)`;
  };
  const ARCO_FINAL = 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)';

  /* Onde fica o rosto dela na composição final. offset* ignora
     transform de ancestral, então a conta não é afetada pela própria
     animação da cena. O retângulo real da imagem sai do object-fit. */
  const rosto = () => {
    const w = fig.offsetWidth;
    const h = fig.offsetHeight;
    let iw = w;
    let ih = w / FOTO.proporcao;
    if (w / h > FOTO.proporcao) {
      ih = h;
      iw = h * FOTO.proporcao;
    }
    const x0 = fig.offsetLeft + (w - iw) * (desktop ? 1 : 0.5);
    const y0 = fig.offsetTop + (h - ih);
    return { x: x0 + iw * FOTO.rostoX, y: y0 + ih * FOTO.rostoY };
  };
  /* Na abertura a cena é deslocada para o rosto cair no centro do
     arco; ao abrir, ela volta a 0 — a Jade "desliza para o lado". */
  const desloc = () => {
    const g = geo();
    const r = rosto();
    return { x: g.W / 2 - r.x, y: g.topo + g.alt * 0.52 - r.y };
  };

  /* A frase entra por linhas mascaradas. Aqui o split NÃO é desfeito:
     a timeline é reversível (rolar para cima esconde de novo). */
  const splits = [...palco.querySelectorAll('[data-hero-linhas]')].map((el) =>
    SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'jr-linha' }),
  );
  const linhas = splits.flatMap((sp) => sp.lines);

  /* x: 0 zera o que o GSAP leu do translateX(-50%) do CSS; sem isso
     ele somava os dois e a marca ficava meia largura à esquerda. */
  gsap.set(marca, { x: 0, xPercent: -50 });
  gsap.set(arco, { clipPath: arcoInicial() });
  gsap.set(linhas, { yPercent: 110 });
  gsap.set(acoes, { opacity: 0, y: 40 });
  gsap.set(conteudo, { visibility: 'visible' });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  tl
    /* 1–2. o arco abre e a Jade desliza para o lugar dela */
    .fromTo(arco, { clipPath: arcoInicial }, { clipPath: ARCO_FINAL, duration: 0.34, ease: 'power2.inOut' }, 0)
    .fromTo(
      cena,
      { x: () => desloc().x, y: () => desloc().y, scale: 1.06 },
      { x: 0, y: 0, scale: 1, duration: 0.34, ease: 'power2.inOut' },
      0,
    )
    .fromTo(marca, { yPercent: 0, opacity: 1 }, { yPercent: -140, opacity: 0, duration: 0.2, ease: 'power1.in', immediateRender: false }, 0.03)
    .fromTo(lados[0], { x: 0, opacity: 1 }, { x: '-14vw', opacity: 0, duration: 0.18, immediateRender: false }, 0.02)
    .fromTo(lados[1], { x: 0, opacity: 1 }, { x: '14vw', opacity: 0, duration: 0.18, immediateRender: false }, 0.02)
    .fromTo(deixa, { opacity: 1 }, { opacity: 0, duration: 0.1, immediateRender: false }, 0)
    .fromTo(fundo, { opacity: 0.06 }, { opacity: 0, duration: 0.2, immediateRender: false }, 0)
    /* 3. a frase sobe no espaço que abriu */
    .to(linhas, { yPercent: 0, stagger: 0.025, duration: 0.12, ease: 'power2.out' }, 0.3)
    .to(acoes, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.42)
    /* 4. pausa — nada anima entre 0,5 e 0,72 */
    /* 5. a cúpula sobe e vira o fundo do manifesto */
    .fromTo(
      cupula,
      { y: () => geo().H * 1.02 },
      { y: () => geo().H / 2 - cupula.offsetWidth / 2, duration: 0.28, ease: 'power1.inOut' },
      0.72,
    )
    .to(conteudo, { y: () => -geo().H * 0.12, duration: 0.24, ease: 'power1.in' }, 0.74);

  /* Abertura no carregamento (não depende de rolagem). */
  let rede = null;
  if (comAbertura) {
    const nomes = SplitText.create(palco.querySelectorAll('.hero__nome-1, .hero__nome-2'), {
      type: 'chars',
      charsClass: 'jr-letra',
    });
    gsap.set([marca, deixa, abertura], { visibility: 'visible' });

    const a = gsap.timeline({ delay: 0.15, onComplete: () => nomes.revert() });
    a.fromTo(abertura, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'travessia' }, 0)
      .fromTo(fig.querySelector('img'), { scale: 1.35 }, { scale: 1, duration: 2.2, ease: 'saida' }, 0)
      .fromTo(fundo, { opacity: 0 }, { opacity: 0.06, duration: 2.4, ease: 'saida' }, 0.2)
      .fromTo(
        nomes.chars,
        { opacity: 0, yPercent: 50, rotateY: 90 },
        { opacity: 1, yPercent: 0, rotateY: 0, duration: DUR, stagger: INTERVALO_LETRA, ease: 'saida' },
        0.45,
      )
      /* o script é ESCRITO: a máscara corre da esquerda para a direita
         na curva "Write" da referência (linear nas pontas) */
      .fromTo(script, { clipPath: 'inset(-30% 100% -30% -5%)' }, { clipPath: 'inset(-30% -5% -30% -5%)', duration: 1.7, ease: 'escrita' }, 1.05)
      .fromTo(lados, { opacity: 0, letterSpacing: '1.1em' }, { opacity: 1, letterSpacing: '0.5em', duration: 1.4, ease: 'saida' }, 1.1)
      .fromTo(deixa.firstElementChild, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: 'saida' }, 1.3)
      .fromTo([...deixa.children].slice(1), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'saida' }, 1.45);

    /* Rede de segurança: a abertura leva ~3s. Se em 5s não acabou, o
       rAF está estrangulado — o relógio conclui à força. */
    rede = setTimeout(() => a.progress() < 1 && a.progress(1), 5000);
  } else {
    gsap.set([marca, deixa, abertura], { visibility: 'visible' });
  }

  return () => {
    clearTimeout(rede);
    splits.forEach((sp) => sp.revert());
  };
}

/* -- header e régua trocam de cor conforme o fundo ------------- */
/* Como o initThemeChange da referência: o que decide é a seção que
   está sob a linha do header. O hero é escuro enquanto a moldura
   cacau ainda aparece nas bordas (primeiros ~28% da rolagem dele). */
/* A troca por seção não é animação: roda também com movimento
   reduzido, senão o header escuro some sobre as seções escuras. */
function temasPorSecao() {
  const html = document.documentElement;
  document.querySelectorAll('[data-tema]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 48px',
      end: 'bottom 48px',
      onToggle: (st) => st.isActive && html.setAttribute('data-tema', sec.dataset.tema),
    });
  });
}

function montarTemas() {
  const html = document.documentElement;
  const definir = (t) => html.setAttribute('data-tema', t);
  const hero = document.querySelector('.hero');

  temasPorSecao();

  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      /* 22%: medido nas fotos, a 28% o arco já cobria o canto do
         header e o texto claro ficava sobre o nude. */
      end: () => `+=${(hero.offsetHeight - window.innerHeight) * 0.22}`,
      onToggle: (st) => {
        definir(st.isActive ? 'escuro' : 'claro');
        html.dataset.temaTrilho = st.isActive ? 'escuro' : 'claro';
      },
    });
    /* No fim, a cúpula escura cobre a tela e header e régua voltam a
       ser claros. Cada um troca quando a borda da cúpula passa por ele
       (calculado pela geometria do círculo; igual a 1366, 1440 e 1920):
       régua no meio da altura a 0,84–0,87 da rolagem → 0,855;
       header no topo a 0,89–0,905 → 0,9. */
    const aoCobrir = (fracao, aplicar) =>
      ScrollTrigger.create({
        trigger: hero,
        start: () => `top+=${(hero.offsetHeight - window.innerHeight) * fracao} top`,
        end: 'bottom 48px',
        invalidateOnRefresh: true,
        onToggle: (st) => {
          /* saindo pelo fim, quem assume é o data-tema do manifesto */
          if (!st.isActive && st.direction > 0) return;
          aplicar(st.isActive ? 'escuro' : 'claro');
        },
      });
    aoCobrir(0.855, (t) => {
      html.dataset.temaTrilho = t;
    });
    aoCobrir(0.9, definir);
    if (window.scrollY < 40) {
      definir('escuro');
      html.dataset.temaTrilho = 'escuro';
    }
  }
}

/* Régua lateral: número e nome da seção atual + fio de progresso. */
function montarTrilho() {
  const num = document.querySelector('[data-trilho-num]');
  const nome = document.querySelector('[data-trilho-nome]');
  const fill = document.querySelector('[data-trilho-fill]');
  if (!num) return;
  gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  document.querySelectorAll('[data-trilho]').forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (st) => {
        if (!st.isActive) return;
        num.textContent = String(i + 1).padStart(2, '0');
        nome.textContent = sec.dataset.trilho;
        /* a régua fica no MEIO da tela: a cor dela segue a seção que
           está ali, não a que está sob o header */
        if (sec.dataset.tema) document.documentElement.dataset.temaTrilho = sec.dataset.tema;
      },
    });
  });
}

/* O selo do header gira conforme a página rola, como o da referência. */
function girarSelo() {
  const anel = document.querySelector('[data-selo-anel]');
  if (!anel) return;
  gsap.to(anel, {
    rotation: 540,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.6 },
  });
}

/* -- EXPERIÊNCIA: a foto abre da janela até a tela cheia ------- */
/* "Smooth Scroll Hero" do 21st.dev refeito aqui. O palco é sticky no
   CSS; esta timeline só conduz, pela rolagem da própria seção:
   janela (clip-path inset) de estreita a tela cheia + zoom 1,7 → 1,
   depois véu e frase. Header e régua trocam de cor quando a foto
   passa por baixo deles. */
function montarExperiencia(desktop) {
  const trilho = document.querySelector('[data-exp-trilho]');
  if (!trilho) return;
  const q = (s) => trilho.querySelector(s);
  const palco = q('[data-exp-palco]');
  const janela = q('[data-exp-janela]');
  const foto = q('[data-exp-foto]');
  const veu = q('[data-exp-veu]');
  const palavra = q('[data-exp-palavra]');
  const html = document.documentElement;

  /* Janela inicial: vertical, no formato da foto, logo abaixo da
     palavra e até perto da base. Medida em px a partir do palco. */
  const PROPORCAO = 1154 / 1351;
  const inicial = () => {
    const W = palco.clientWidth;
    const H = palco.clientHeight;
    const topo = palavra.offsetTop + palavra.offsetHeight + H * 0.035;
    const base = H * 0.06;
    const alt = H - topo - base;
    const larg = Math.min(alt * PROPORCAO * 0.92, W * (desktop ? 0.4 : 0.8));
    const lado = (W - larg) / 2;
    return { t: topo, r: lado, b: base, l: lado };
  };
  /* Onde o rosto (58% da largura da foto) cai com a foto inteira na
     tela: larga (desktop) = altura manda e a foto fica a 72% (CSS);
     estreita (celular) = largura manda, centrada. */
  const rostoAoCentro = () => {
    const W = palco.clientWidth;
    const H = palco.clientHeight;
    const larga = W / H > PROPORCAO;
    const larg = larga ? H * PROPORCAO : W;
    const ini = larga ? (W - larg) * 0.72 : 0;
    return W / 2 - (ini + larg * 0.58);
  };
  /* mesmo, na vertical: o rosto (38% da altura da foto) vai para o
     meio da janela inicial */
  const rostoAoMeio = () => {
    const W = palco.clientWidth;
    const H = palco.clientHeight;
    const larga = W / H > PROPORCAO;
    const alt = larga ? H : W / PROPORCAO;
    const topoFoto = (H - alt) / 2;
    const j = inicial();
    return (j.t + (H - j.b)) / 2 - (topoFoto + alt * 0.38);
  };

  const clip = { t: 0, r: 0, b: 0, l: 0 };
  let faixa = null;
  /* A cor segue o QUADRO desenhado, não a posição da rolagem: com o
     scrub de 1s a animação chega depois, e decidir pela rolagem deixava
     o header escuro sobre a foto escura. Fora do trecho, não mexe. */
  const aplicar = () => {
    janela.style.clipPath = `inset(${clip.t}px ${clip.r}px ${clip.b}px ${clip.l}px)`;
    if (faixa?.isActive) cores();
  };

  const splits = [...trilho.querySelectorAll('[data-exp-linha]')].map((el) =>
    SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'jr-linha' }),
  );
  const linhas = splits.flatMap((sp) => sp.lines);
  gsap.set(linhas, { yPercent: 110 });

  /* cor do header (topo) e da régua (esquerda, meia altura) */
  let temaAtual = null;
  let trilhoAtual = null;
  const cores = () => {
    const H = palco.clientHeight;
    /* depois do fim da animação o palco sobe com a foto ainda na tela:
       a régua (meia altura) só fica livre quando a base do trilho
       passa de ~65% da tela */
    const base = trilho.getBoundingClientRect().bottom;
    const tema = clip.t < 48 ? 'escuro' : 'claro';
    const regua = clip.l < 44 && clip.t < H * 0.35 && base > H * 0.65 ? 'escuro' : 'claro';
    if (tema !== temaAtual) html.setAttribute('data-tema', (temaAtual = tema));
    if (regua !== trilhoAtual) html.dataset.temaTrilho = trilhoAtual = regua;
  };
  const soltar = () => {
    temaAtual = trilhoAtual = null;
    html.setAttribute('data-tema', 'claro');
    html.dataset.temaTrilho = 'claro';
  };

  /* Trecho em que a foto pode estar sob o header: do topo do trilho
     até a base dele passar pela linha do header (o palco sticky sobe
     com a foto ainda cobrindo o topo depois que a animação acaba). */
  faixa = ScrollTrigger.create({
    trigger: trilho,
    start: 'top top',
    end: 'bottom 48px',
    onUpdate: cores,
    onLeave: soltar,
    onLeaveBack: soltar,
  });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: trilho,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(
    clip,
    { t: () => inicial().t, r: () => inicial().r, b: () => inicial().b, l: () => inicial().l },
    { t: 0, r: 0, b: 0, l: 0, duration: 0.72, ease: 'power2.inOut', onUpdate: aplicar },
    0,
  )
    /* começa com o rosto no centro da janela e desliza até o lugar
       final (no desktop a foto inteira fica deslocada para a direita) */
    .fromTo(
      foto,
      { scale: 1.7, x: () => rostoAoCentro(), y: () => rostoAoMeio() },
      { scale: 1, x: 0, y: 0, duration: 0.8, ease: 'power1.out' },
      0,
    )
    .fromTo(palavra, { yPercent: 0 }, { yPercent: -35, duration: 0.6, ease: 'power1.in' }, 0)
    .fromTo(veu, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.6)
    .to(linhas, { yPercent: 0, stagger: 0.04, duration: 0.16, ease: 'power2.out' }, 0.7)
    /* pausa: a composição final fica parada um trecho para ser lida */
    .to({}, { duration: 0.14 });

  aplicar();
}

/* -- revelação ao rolar ---------------------------------------- */
function montarRevelacoes() {
  const itens = gsap.utils
    .toArray('[data-anim], [data-fio]')
    .filter((el) => !el.closest('[data-hero]'));

  const grupos = new Map();
  itens.forEach((el) => {
    const gatilho = el.closest('[data-anim-grupo]') || el;
    if (!grupos.has(gatilho)) grupos.set(gatilho, []);
    grupos.get(gatilho).push(el);
  });

  grupos.forEach((els, gatilho) => {
    const reveladores = els.map(preparar);
    ScrollTrigger.create({
      trigger: gatilho,
      start: INICIO,
      /* `once` sozinho só desliga o gatilho quando o elemento SAI por
         cima da tela — no fim da página isso nunca acontece e o gatilho
         ficava vivo, pronto para revelar de novo. Desligamos no disparo. */
      onEnter: (self) => {
        self.kill();
        reveladores.forEach((revelar, i) => revelar(ATRASO_BASE + i * INTERVALO));
      },
    });
  });
}

/* -- parallax (todas as larguras desde 21/09/2026: no celular as
   animações precisam ser as mesmas do desktop) ------------------- */
function montarParallax() {
  gsap.utils.toArray('[data-parallax="img"]').forEach((moldura) => {
    const img = moldura.querySelector('img');
    if (!img) return;
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: moldura, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      },
    );
  });

  gsap.utils.toArray('[data-parallax="sobe"]').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: 8 },
      {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 125%', end: 'bottom -25%', scrub: 0.5 },
      },
    );
  });
}

export function initMotion() {
  /* Aba oculta: nada é escondido. Quando ela aparecer, o setup roda. */
  if (document.visibilityState !== 'visible') {
    let cancelado = false;
    let limpar = () => {};
    const quandoAparecer = () => {
      if (cancelado || document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', quandoAparecer);
      limpar = initMotion();
    };
    document.addEventListener('visibilitychange', quandoAparecer);
    return () => {
      cancelado = true;
      document.removeEventListener('visibilitychange', quandoAparecer);
      limpar();
    };
  }

  const mm = gsap.matchMedia();

  mm.add(
    {
      motionOk: '(prefers-reduced-motion: no-preference)',
      isDesktop: '(min-width: 861px)',
      heroDesktop: '(min-width: 900px)',
    },
    (ctx) => {
      const { motionOk, isDesktop, heroDesktop } = ctx.conditions;
      if (!motionOk) {
        document.documentElement.setAttribute('data-tema', 'claro');
        temasPorSecao();
        return;
      }

      /* Marcado aqui, de forma síncrona, antes da primeira pintura
         (App chama isto num useLayoutEffect): o CSS já esconde os
         elementos animáveis e não há piscada de conteúdo. */
      document.documentElement.setAttribute('data-motion', 'on');

      const pararLenis = iniciarLenis();
      let vivo = true;
      let rede;

      /* SplitText mede linhas: precisa da fonte final carregada, senão
         quebra as linhas pela fonte de fallback. Os tweens criados
         dentro deste método entram no contexto e são desfeitos juntos
         no revert. */
      let desfazerHero = null;
      let ctxHero = null;
      let larguraHero = window.innerWidth;

      /* O hero tem contexto próprio: se a largura da tela mudar, as
         linhas da frase quebram em outro lugar e o split precisa ser
         refeito — sem repetir a abertura nem mexer no resto da página. */
      const construirHero = (comAbertura) => {
        desfazerHero?.();
        ctxHero?.revert();
        ctxHero = gsap.context(() => {
          desfazerHero = montarHero({ desktop: heroDesktop, comAbertura });
        });
      };

      ctx.add('montar', () => {
        if (!vivo) return;
        construirHero(true);
        montarRevelacoes();
        montarTemas();
        montarTrilho();
        montarExperiencia(isDesktop);
        girarSelo();
        montarParallax();
        ScrollTrigger.refresh();
      });

      (document.fonts?.ready ?? Promise.resolve()).then(() => ctx.montar());

      let espera;
      const aoRedimensionar = () => {
        clearTimeout(espera);
        espera = setTimeout(() => {
          if (!vivo || Math.abs(window.innerWidth - larguraHero) < 60) return;
          larguraHero = window.innerWidth;
          construirHero(false);
          ScrollTrigger.refresh();
        }, 250);
      };
      window.addEventListener('resize', aoRedimensionar);

      return () => {
        vivo = false;
        clearTimeout(rede);
        clearTimeout(espera);
        window.removeEventListener('resize', aoRedimensionar);
        desfazerHero?.();
        ctxHero?.revert();
        document.documentElement.setAttribute('data-tema', 'claro');
        pararLenis();
        document.documentElement.setAttribute('data-motion', 'off');
      };
    },
  );

  return () => mm.revert();
}

/* Contagem dos números de autoridade. Roda uma vez, ao entrar na
   tela. Com motion reduzido o valor final aparece direto. */
export function countUp(el, target, { decimals = 0, suffix = '' } = {}) {
  const format = (n) =>
    n.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + suffix;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    el.textContent = format(target);
    return () => {};
  }

  const state = { n: 0 };
  el.textContent = format(0);

  const tween = gsap.to(state, {
    n: target,
    duration: 1.6,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = format(state.n);
    },
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  });

  return () => tween.scrollTrigger?.kill();
}

export { ScrollTrigger };

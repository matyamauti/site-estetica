import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { treatments } from '../lib/site';
import Figure from './Figure';
import './Treatments.css';

const DUR = 1.2;
/* tempo de cada slide na troca automática (a transição leva 1,2s) */
const INTERVALO = 5500;

/* Troca de slide no sistema da referência (animateSlide + textos):
   a foto que sai é varrida e infla; a que entra vem por uma cortina
   diagonal e desinfla. As letras do nome saem girando e as do novo
   nome entram girando; a nota troca linha a linha. */
function transicao({ sai, entra, direcao, raiz }) {
  const el = (tipo, i) => raiz.querySelector(`[data-slide-${tipo}="${i}"]`);
  const fotoSai = el('foto', sai);
  const fotoEntra = el('foto', entra);
  const nomeSai = el('nome', sai);
  const nomeEntra = el('nome', entra);
  const notaSai = el('nota', sai);
  const notaEntra = el('nota', entra);
  const sinal = direcao >= 0 ? 1 : -1;
  const tl = gsap.timeline();

  /* fotos */
  gsap.set(fotoEntra, { zIndex: 2, visibility: 'visible' });
  gsap.set(fotoSai, { zIndex: 1 });
  tl.fromTo(
    fotoEntra,
    {
      clipPath:
        sinal > 0
          ? 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)'
          : 'polygon(0% 0%, 0% 0%, -25% 100%, -1% 100%)',
    },
    { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: DUR, ease: 'travessia' },
    0,
  )
    .fromTo(
      fotoEntra.querySelector('img'),
      { scale: 1.5, xPercent: 25 * sinal },
      { scale: 1, xPercent: 0, duration: DUR, ease: 'travessia' },
      0,
    )
    .to(fotoSai.querySelector('img'), { scale: 1.5, xPercent: -25 * sinal, duration: DUR, ease: 'travessia' }, 0)
    .set(fotoSai, { visibility: 'hidden' });

  /* nome gigante */
  const sSai = SplitText.create(nomeSai, { type: 'chars', charsClass: 'jr-letra' });
  const sEntra = SplitText.create(nomeEntra, { type: 'chars', charsClass: 'jr-letra' });
  gsap.set(sEntra.chars, { opacity: 0 });
  gsap.set(nomeEntra, { visibility: 'visible' });
  tl.to(sSai.chars, { opacity: 0, yPercent: -50, rotateY: -90, duration: 0.4, stagger: 0.025, ease: 'entrada' }, 0)
    .set(nomeSai, { visibility: 'hidden' })
    .fromTo(
      sEntra.chars,
      { opacity: 0, yPercent: 50, rotateY: 90 },
      { opacity: 1, yPercent: 0, rotateY: 0, duration: DUR, stagger: 0.05, ease: 'saida' },
      0.3,
    )
    .add(() => {
      sSai.revert();
      sEntra.revert();
      /* O revert do SplitText devolve o HTML original; o estado final
         é reafirmado depois dele, senão o nome que saiu pode voltar. */
      gsap.set(nomeSai, { visibility: 'hidden', opacity: 1 });
      gsap.set(nomeEntra, { visibility: 'visible', opacity: 1 });
    });

  /* nota */
  const lSai = SplitText.create(notaSai, { type: 'lines', mask: 'lines', linesClass: 'jr-linha' });
  const lEntra = SplitText.create(notaEntra, { type: 'lines', mask: 'lines', linesClass: 'jr-linha' });
  gsap.set(lEntra.lines, { yPercent: 110 });
  gsap.set(notaEntra, { visibility: 'visible' });
  tl.to(lSai.lines, { yPercent: -110, duration: 0.4, stagger: 0.05, ease: 'entrada' }, 0)
    .set(notaSai, { visibility: 'hidden' })
    /* 0,5s: só depois de a nota antiga sair — antes disso as duas
       ficavam sobrepostas por um instante (visto na captura). */
    .to(lEntra.lines, { yPercent: 0, duration: DUR, stagger: 0.1, ease: 'saida' }, 0.5)
    .add(() => {
      lSai.revert();
      lEntra.revert();
      gsap.set(notaSai, { visibility: 'hidden' });
      gsap.set(notaEntra, { visibility: 'visible' });
    });

  return tl;
}

/**
 * TRATAMENTOS — no formato do "Real-Life Location" da referência:
 * nome gigante da categoria, foto pequena ao centro, numeração e barra
 * de progresso embaixo. Setas trocam; ← → também, com o foco no
 * carrossel.
 *
 * Troca sozinha a cada 5,5s (pedido do Matheus, 21/09/2026). Para
 * ser legível e acessível, a rotação PAUSA com o mouse em cima, com
 * foco de teclado dentro, fora da tela e com a aba escondida; tem
 * botão de pausar (WCAG 2.2.2); e não roda com movimento reduzido.
 * Um clique nas setas recomeça a contagem.
 */
export default function Treatments() {
  const [ativo, setAtivo] = useState(0);
  const [rodando, setRodando] = useState(true); /* escolha de quem lê */
  const [sobre, setSobre] = useState(false); /* mouse ou foco dentro */
  const [naTela, setNaTela] = useState(false);
  const [podeRodar, setPodeRodar] = useState(false); /* movimento ok */
  const anterior = useRef(0);
  const direcao = useRef(1);
  const raiz = useRef(null);
  const emCurso = useRef(null);
  const total = treatments.length;
  const girando = rodando && podeRodar && naTela && !sobre;

  const ir = (passo) => {
    direcao.current = passo;
    setAtivo((a) => (a + passo + total) % total);
  };

  useLayoutEffect(() => {
    const sai = anterior.current;
    anterior.current = ativo;
    if (sai === ativo || !raiz.current) return;

    /* uma troca em curso é concluída antes da próxima começar */
    emCurso.current?.progress(1);

    /* Só os dois slides da troca podem estar à mostra. Qualquer
       outro que tenha ficado visível (clique rápido, revelação de
       entrada terminando no meio) é escondido já. */
    ['foto', 'nome', 'nota'].forEach((tipo) =>
      raiz.current.querySelectorAll(`[data-slide-${tipo}]`).forEach((el, i) => {
        if (i !== sai && i !== ativo) gsap.set(el, { visibility: 'hidden' });
      }),
    );

    const semMovimento = document.documentElement.dataset.motion !== 'on';
    if (semMovimento) {
      ['foto', 'nome', 'nota'].forEach((tipo) =>
        raiz.current.querySelectorAll(`[data-slide-${tipo}]`).forEach((el, i) => {
          el.style.visibility = i === ativo ? 'visible' : 'hidden';
        }),
      );
      return;
    }
    emCurso.current = transicao({ sai, entra: ativo, direcao: direcao.current, raiz: raiz.current });
  }, [ativo]);

  /* Fora da tela, ou com a aba escondida, não conta tempo. */
  useEffect(() => {
    const el = raiz.current;
    if (!el) return undefined;
    setPodeRodar(document.documentElement.dataset.motion === 'on');
    let visivel = false;
    const obs = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        setNaTela(visivel && !document.hidden);
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    const aba = () => setNaTela(visivel && !document.hidden);
    document.addEventListener('visibilitychange', aba);
    return () => {
      obs.disconnect();
      document.removeEventListener('visibilitychange', aba);
    };
  }, []);

  /* A contagem recomeça a cada troca (automática ou pelas setas) e
     a cada retomada. */
  useEffect(() => {
    if (!girando) return undefined;
    const id = setTimeout(() => ir(1), INTERVALO);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [girando, ativo]);

  const t = treatments[ativo];

  return (
    <section
      className="section section--alt treatments"
      id="tratamentos"
      aria-labelledby="tratamentos-titulo"
      data-tema="claro"
      data-trilho="Tratamentos"
    >
      <div className="site-container treatments__inner" ref={raiz}>
        <h2 className="label treatments__rotulo" id="tratamentos-titulo" data-anim="letras">
          Índice de tratamentos
        </h2>

        <div
          className="treatments__carrossel"
          role="group"
          aria-roledescription="carrossel"
          aria-label="Tratamentos"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') ir(1);
            if (e.key === 'ArrowLeft') ir(-1);
          }}
          onMouseEnter={() => setSobre(true)}
          onMouseLeave={() => setSobre(false)}
          onFocus={(e) => e.target.matches(':focus-visible') && setSobre(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setSobre(false)}
        >
          {/* Nomes gigantes empilhados na mesma célula: só o ativo aparece */}
          {/* A entrada é do bloco inteiro. Antes era letra a letra no
              nome do 1º slide, e o fim dessa animação desfazia o
              "esconder" da troca: FACIAIS voltava e ficava parado por
              cima dos outros nomes. */}
          <div className="treatments__nomes" data-anim="bloco">
            {treatments.map((item, i) => (
              <p
                key={item.id}
                className="treatments__nome"
                data-slide-nome={i}
                style={i === 0 ? undefined : { visibility: 'hidden' }}
                aria-hidden="true"
              >
                {item.curto}
              </p>
            ))}
          </div>

          <div className="treatments__palco" data-anim="cortina">
            {treatments.map((item, i) => (
              <div
                key={item.id}
                className="treatments__foto"
                data-slide-foto={i}
                style={i === 0 ? undefined : { visibility: 'hidden' }}
                aria-hidden={i !== ativo}
              >
                <Figure
                  src={`${item.image}-960.webp`}
                  srcSet={`${item.image}-640.webp 640w, ${item.image}-960.webp 960w`}
                  sizes="(min-width: 900px) 20rem, 60vw"
                  alt={item.alt || item.name}
                  note={item.placeholder}
                  ratio="4 / 5"
                />
              </div>
            ))}
          </div>

          {/* linha de tempo até a próxima troca; recomeça a cada slide */}
          <span className="treatments__tempo" aria-hidden="true" data-girando={girando}>
            <span key={ativo} className="treatments__tempo-fill" style={{ animationDuration: `${INTERVALO}ms` }} />
          </span>

          <div className="treatments__controles" data-anim="bloco">
            <button type="button" className="treatments__seta" onClick={() => ir(-1)} aria-label="Tratamento anterior">
              <span aria-hidden="true">‹</span>
            </button>
            <span className="treatments__num num">{t.id}</span>
            <span className="treatments__barra" aria-hidden="true">
              <span className="treatments__barra-fill" style={{ transform: `scaleX(${(ativo + 1) / total})` }} />
            </span>
            <span className="treatments__num num">{String(total).padStart(2, '0')}</span>
            <button type="button" className="treatments__seta" onClick={() => ir(1)} aria-label="Próximo tratamento">
              <span aria-hidden="true">›</span>
            </button>
            {podeRodar && (
              <button
                type="button"
                className="treatments__pausa"
                onClick={() => setRodando((r) => !r)}
                aria-label={rodando ? 'Pausar a troca automática' : 'Retomar a troca automática'}
                aria-pressed={!rodando}
              >
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                  {rodando ? (
                    <path d="M4 3h2.5v10H4zM9.5 3H12v10H9.5z" fill="currentColor" />
                  ) : (
                    <path d="M5 3l8 5-8 5z" fill="currentColor" />
                  )}
                </svg>
              </button>
            )}
          </div>

          <div className="treatments__notas" data-anim="bloco">
            {treatments.map((item, i) => (
              <div
                key={item.id}
                className="treatments__nota"
                data-slide-nota={i}
                style={i === 0 ? undefined : { visibility: 'hidden' }}
                aria-hidden={i !== ativo}
              >
                <h3 className="label treatments__nota-nome">{item.name}</h3>
                <p className="treatments__nota-texto">{item.note}</p>
              </div>
            ))}
          </div>

          {/* rodando sozinho, o leitor de tela não é interrompido a cada
              5s; parado, a troca pelas setas é anunciada */}
          <p className="sr-only" aria-live={girando ? 'off' : 'polite'}>
            {`Tratamento ${ativo + 1} de ${total}: ${t.name}. ${t.note}`}
          </p>
        </div>
      </div>
    </section>
  );
}

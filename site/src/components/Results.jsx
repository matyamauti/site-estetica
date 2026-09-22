import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { results } from '../lib/site';
import './Results.css';

const src = (base) => ({
  src: `${base}.webp`,
  srcSet: `${base}-720.webp 720w, ${base}.webp 1080w`,
  sizes: '(min-width: 800px) 40vw, 100vw',
});

/**
 * Comparador antes/depois — o "Image Comparison Slider" do 21st.dev,
 * reconstruído sem Tailwind, com os tokens do site.
 *
 * Do componente original ficaram: a camada de cima recortada por
 * clip-path, arrastar em qualquer ponto da foto, a alça redonda com
 * setas que cresce enquanto se arrasta. O que mudou, e por quê:
 *   - ANTES à esquerda, DEPOIS à direita (no original era o inverso,
 *     contra a leitura natural);
 *   - pointer events com captura, em vez de mouse + touch separados:
 *     o arraste não se perde quando o dedo sai da foto;
 *   - um <input type="range"> invisível dá teclado e leitor de tela;
 *   - ao entrar na tela, a alça faz um vaivém curto para mostrar que
 *     a foto é interativa — uma vez, e nunca se a pessoa já mexeu.
 */
function Compare({ item }) {
  const [pos, setPos] = useState(50);
  const [arrastando, setArrastando] = useState(false);
  /* foto ausente (caso ainda sem arquivos): vira espaço reservado */
  const [faltando, setFaltando] = useState(false);
  const moldura = useRef(null);
  const mexeu = useRef(false);
  const dica = useRef(null);

  const posDoPonteiro = (clientX) => {
    const r = moldura.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
  };

  const assumir = () => {
    mexeu.current = true;
    dica.current?.kill();
  };

  const aoApertar = (e) => {
    if (faltando) return;
    if (e.button !== undefined && e.button !== 0) return;
    assumir();
    moldura.current.setPointerCapture(e.pointerId);
    setArrastando(true);
    setPos(posDoPonteiro(e.clientX));
  };
  const aoMover = (e) => {
    if (arrastando) setPos(posDoPonteiro(e.clientX));
  };
  const aoSoltar = () => setArrastando(false);

  /* Vaivém de apresentação, depois da cortina de entrada (1,2s). */
  useEffect(() => {
    const el = moldura.current;
    if (!el || faltando || document.documentElement.dataset.motion !== 'on') return undefined;
    const estado = { p: 50 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      onEnter: (self) => {
        self.kill();
        if (mexeu.current) return;
        dica.current = gsap
          .timeline({ delay: 1.3, onUpdate: () => setPos(estado.p) })
          .to(estado, { p: 68, duration: 0.7, ease: 'power2.inOut' })
          .to(estado, { p: 34, duration: 0.9, ease: 'power2.inOut' })
          .to(estado, { p: 50, duration: 0.6, ease: 'power2.inOut' });
      },
    });
    return () => {
      st.kill();
      dica.current?.kill();
    };
  }, [faltando]);

  const nome = item.note ? `${item.label}, ${item.note}` : item.label;

  return (
    <figure className="compare" data-anim-grupo>
      <div
        ref={moldura}
        className={`compare__frame${arrastando ? ' is-arrastando' : ''}${faltando ? ' is-pendente' : ''}`}
        style={{ '--pos': `${pos}%`, '--pos-n': pos }}
        data-anim="cortina"
        onPointerDown={aoApertar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
      >
        {faltando ? (
          <p className="compare__pendente">
            <b>{item.label}</b>
            <span>Fotos de antes e depois em breve</span>
          </p>
        ) : (
          <>
            <img
              className="compare__img"
              {...src(item.before)}
              alt={`${nome}: antes`}
              draggable="false"
              loading="lazy"
              decoding="async"
              onError={() => setFaltando(true)}
            />
            <img
              className="compare__img compare__img--depois"
              {...src(item.after)}
              alt={`${nome}: depois`}
              draggable="false"
              loading="lazy"
              decoding="async"
              onError={() => setFaltando(true)}
            />

            <span className="compare__tag compare__tag--antes" aria-hidden="true">
              Antes
            </span>
            <span className="compare__tag compare__tag--depois" aria-hidden="true">
              Depois
            </span>

            <span className="compare__linha" aria-hidden="true">
              <span className="compare__alca">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
                </svg>
              </span>
            </span>

            <input
              className="compare__range"
              type="range"
              min="0"
              max="100"
              step="1"
              value={Math.round(pos)}
              onChange={(e) => {
                assumir();
                setPos(Number(e.target.value));
              }}
              aria-label={`${nome}: comparar antes e depois`}
              aria-valuetext={`${Math.round(pos)}% antes, ${100 - Math.round(pos)}% depois`}
            />
          </>
        )}
      </div>

      <figcaption className="compare__legenda" data-anim="bloco">
        <span className="label">{item.label}</span>
        {item.note && <span className="compare__nota">{item.note}</span>}
        {item.descricao && <span className="compare__descricao">{item.descricao}</span>}
      </figcaption>
    </figure>
  );
}

export default function Results() {
  return (
    <section className="section results" data-tema="claro" data-trilho="Resultados" id="resultados" aria-labelledby="resultados-titulo">
      <div className="site-container results__bloco">
        <header className="results__head" data-anim-grupo>
          <h2 className="results__title" id="resultados-titulo" data-anim="letras">
            Resultados.
          </h2>
          <p className="results__instrucao" data-anim="linhas">
            Arraste sobre a foto para comparar antes e depois.
          </p>
        </header>

        <div className="results__casos">
          {results.map((item) => (
            <Compare key={item.label} item={item} />
          ))}
        </div>

        <p className="results__disclaimer" data-anim="linhas" data-fio>
          Cada pele responde de um jeito; o resultado varia de pessoa para
          pessoa.
        </p>
      </div>
    </section>
  );
}

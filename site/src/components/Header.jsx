import { useEffect, useRef, useState } from 'react';
import { brand, contact, nav } from '../lib/site';
import { pararRolagem, retomarRolagem } from '../lib/motion';
import './Header.css';

/**
 * HEADER — no sistema de era-residence.com: sem barra, sem fundo.
 *
 *   esquerda  selo circular com "JADE ROMERO · ESTÉTICA E BELEZA"
 *             girando em volta de um J; gira conforme a página rola
 *   direita   links empilhados: agendar em destaque, tratamentos e o
 *             botão do menu
 *
 * A cor não é fixa: o motion.js marca <html data-tema="claro|escuro">
 * conforme a seção que está sob o header, e o CSS inverte.
 *
 * O selo e os links da direita SOMEM ao rolar para baixo (passavam por
 * cima do conteúdo) e VOLTAM ao primeiro gesto para cima — "Agendar
 * horário" fica sempre a um gesto de distância. A bio manda para o
 * site, e o agendamento mora aqui.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [oculto, setOculto] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  /* Some ao descer, volta ao subir. Limiares evitam piscar com o
     tremor do trackpad; perto do topo fica sempre visível. */
  useEffect(() => {
    let ultimo = window.scrollY;
    let pedido = 0;
    const ler = () => {
      pedido = 0;
      const y = window.scrollY;
      const delta = y - ultimo;
      if (y < 120) setOculto(false);
      else if (delta > 8) setOculto(true);
      else if (delta < -8) setOculto(false);
      if (Math.abs(delta) > 8 || y < 120) ultimo = y;
    };
    const aoRolar = () => {
      if (!pedido) pedido = requestAnimationFrame(ler);
    };
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => {
      window.removeEventListener('scroll', aoRolar);
      cancelAnimationFrame(pedido);
    };
  }, []);

  /* Menu aberto: trava a rolagem do fundo, fecha no Esc e devolve
     o foco ao botão que abriu. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    /* Com a rolagem suave ativa, travar o body não basta: a roda do
       mouse continuaria rolando a página atrás do menu. */
    pararRolagem();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    panelRef.current?.querySelector('a')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      retomarRolagem();
      document.removeEventListener('keydown', onKeyDown);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header className={`header${open ? ' is-menu-open' : ''}${oculto && !open ? ' is-oculto' : ''}`}>
        <div className="header__inner">
          <a className="header__selo" href="#topo" aria-label={`${brand.name}, ${brand.tagline} — início`}>
            <svg className="header__selo-anel" viewBox="0 0 100 100" aria-hidden="true" data-selo-anel>
              <defs>
                <path id="selo-circulo" d="M 50 50 m -39 0 a 39 39 0 1 1 78 0 a 39 39 0 1 1 -78 0" />
              </defs>
              <text>
                <textPath href="#selo-circulo" textLength="243" lengthAdjust="spacing">
                  Jade Romero · Estética e Beleza ·
                </textPath>
              </text>
            </svg>
            <span className="header__selo-j" aria-hidden="true">
              J
            </span>
          </a>

          <div className="header__pilha">
            <a
              className="header__agendar"
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar
              <br />
              horário
            </a>
            <a className="header__link" href="#tratamentos">
              Tratamentos
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="header__link header__toggle"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Fechar' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      {/* Menu: painel inteiro em tipografia grande, na mesma
          linguagem editorial do site — não uma lista empilhada. */}
      <div
        id="menu-mobile"
        ref={panelRef}
        className={`menu ${open ? 'is-open' : ''}`}
        inert={!open}
      >
        <nav className="menu__nav site-container" aria-label="Navegação">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => {
                /* retoma ANTES: o link âncora é tratado pela rolagem
                   suave no mesmo clique, e rolagem parada ignora. */
                retomarRolagem();
                setOpen(false);
              }}
              style={{ '--i': i }}
            >
              <span className="menu__index num">0{i + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="menu__foot site-container">
          <a
            className="btn btn--solid"
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Agendar pelo WhatsApp
          </a>
          <p className="menu__contact">
            <span>{contact.phoneDisplay}</span>
            <span>{contact.instagramHandle}</span>
          </p>
        </div>
      </div>
    </>
  );
}

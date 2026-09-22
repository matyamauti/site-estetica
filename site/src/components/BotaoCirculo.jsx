import './BotaoCirculo.css';

/**
 * Botão redondo com texto girando em volta — o "VIEW AVAILABLE
 * APARTMENTS" da referência. O texto do anel é decorativo; o nome
 * acessível do link é o `rotulo`.
 */
export default function BotaoCirculo({ href, rotulo, anel, externo = true }) {
  return (
    <a
      className="circulo"
      href={href}
      aria-label={rotulo}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <svg className="circulo__anel" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id={`circ-${rotulo.length}`} d="M 50 50 m -40 0 a 40 40 0 1 1 80 0 a 40 40 0 1 1 -80 0" />
        </defs>
        <text>
          <textPath href={`#circ-${rotulo.length}`} textLength="249" lengthAdjust="spacing">
            {anel}
          </textPath>
        </text>
      </svg>
      <span className="circulo__seta" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

import { useEffect, useRef } from 'react';
import { stats } from '../lib/site';
import { countUp } from '../lib/motion';

/**
 * AUTORIDADE
 * Três números reais, grandes, separados por fio. Nada de caixa em
 * volta. A contagem roda uma vez; com motion reduzido o valor final
 * já aparece escrito.
 */
export default function Stats() {
  const refs = useRef([]);

  useEffect(() => {
    const cleanups = refs.current.map((el, i) => {
      if (!el) return () => {};
      const { value, decimals = 0, suffix = '' } = stats[i];
      return countUp(el, value, { decimals, suffix });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section className="section section--tight stats" data-tema="claro" data-trilho="Números" aria-labelledby="numeros-titulo">
      <h2 className="sr-only" id="numeros-titulo">
        Números
      </h2>
      <div className="site-container stats__row" data-anim-grupo>
        {stats.map((stat, i) => (
          <div className="stats__item" key={stat.label} data-anim="bloco" data-fio>
            <span
              className="stats__value num"
              ref={(el) => {
                refs.current[i] = el;
              }}
            >
              {stat.decimals
                ? stat.value.toLocaleString('pt-BR', {
                    minimumFractionDigits: stat.decimals,
                  })
                : stat.value}
              {stat.suffix || ''}
            </span>
            <span className="label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

import { testimonials } from '../lib/site';

/**
 * AVALIAÇÕES
 * Dois depoimentos reais, compostos como citação de revista. Sem
 * carrossel: com duas falas, bolinha e seta seriam controle para
 * esconder conteúdo que cabe na tela.
 */
export default function Testimonials() {
  return (
    <section
      className="section testimonials" data-tema="claro" data-trilho="Avaliações"
      id="avaliacoes"
      aria-labelledby="avaliacoes-titulo"
    >
      <div className="site-container">
        <header className="testimonials__head" data-anim-grupo>
          <h2 className="testimonials__title" id="avaliacoes-titulo" data-anim="linhas">
            O que dizem sobre a experiência.
          </h2>
          <p className="testimonials__rating" data-anim="bloco">
            <span className="testimonials__score num">4,9</span>
            <span className="label">265 avaliações no Google</span>
          </p>
        </header>

        <div className="testimonials__grid">
          {testimonials.map((item, i) => (
            <figure
              className="quote"
              key={item.author}
              data-anim-grupo
              data-parallax={i % 2 === 1 ? 'sobe' : undefined}
            >
              <blockquote className="quote__text" data-anim="linhas">{item.quote}</blockquote>
              <figcaption className="quote__author" data-anim="bloco" data-fio>{item.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

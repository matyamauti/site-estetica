import { contact } from '../lib/site';
import Figure from './Figure';

/**
 * DESTAQUE — quebra de ritmo.
 *
 * É a primeira faixa escura da página e a primeira vez que uma foto
 * ocupa metade da tela sangrando à direita. Depois de quatro seções
 * claras, o corte é o que impede a leitura de virar um rolo só.
 */
export default function FeaturedTreatment() {
  return (
    <section
      className="section featured is-dark" data-tema="escuro" data-trilho="Destaque"
      aria-labelledby="destaque-titulo"
    >
      <div className="featured__grid u-edge-start">
        <div className="featured__body" data-anim-grupo>
          <p className="featured__index num" data-anim="letras">
            03
          </p>
          <h2 className="featured__title" id="destaque-titulo" data-anim="letras">
            Micropigmentação
          </h2>
          <p className="featured__text" data-anim="linhas">
            Um resultado pensado para harmonizar com o seu rosto, respeitando
            suas características e sua identidade.
          </p>
          <div data-anim="bloco">
            <a
              className="btn btn--solid"
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar sobre esse procedimento
            </a>
          </div>
        </div>

        <div className="featured__media">
          <Figure
            src="/images/jade/micropigmentacao.webp"
            srcSet="/images/jade/micropigmentacao-720.webp 720w, /images/jade/micropigmentacao.webp 1127w"
            sizes="(min-width: 900px) 50vw, 100vw"
            alt="Jade Romero sorrindo, com o aparelho de micropigmentação na mão, sobre fundo nude com rosa em line art"
            note="Jade com o aparelho de micropigmentação"
            ratio="3 / 4"
            className="featured__foto"
            data-anim="cortina"
            data-parallax="img"
          />
        </div>
      </div>
    </section>
  );
}

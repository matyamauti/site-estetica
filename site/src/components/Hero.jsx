import { brand, contact, frasesJade } from '../lib/site';
import Figure from './Figure';
import './Hero.css';

/**
 * HERO — coreografia de rolagem, no sistema de era-residence.com.
 *
 * O palco fica preso na tela (sticky) enquanto a seção rola por
 * ~3 telas. A rolagem conduz, em ordem:
 *
 *   1. ABERTURA  moldura cor de cacau com uma janela em ARCO; lá dentro,
 *                a Jade. "JADE ROMERO" entra letra a letra e "Estética e
 *                Beleza" é escrito em script por cima.
 *   2. ARCO      a janela cresce até ocupar a tela; a Jade desliza do
 *                centro do arco para a direita e abre espaço.
 *   3. FRASE     a frase dela sobe linha a linha no espaço que ficou.
 *   4. PAUSA     a composição fica parada um trecho, para ser lida.
 *   5. CÚPULA    uma cúpula cor de estúdio sobe da base, com "Corpo · Mente ·
 *                Emoção" curvado no arco, e vira o fundo do manifesto
 *                — a foto "Autocuidado", no mesmo preto de estúdio.
 *
 * Sem movimento (prefers-reduced-motion) ou sem JS, nada disso roda:
 * o hero é uma tela só, já na composição final, legível.
 */
export default function Hero() {
  const { reconhecer } = frasesJade;
  const [cidade1, ...cidade2] = brand.city.split(' ');

  return (
    <section className="hero" id="topo" data-trilho="Início">
      <div className="hero__palco" data-hero-palco>
        <div className="hero__moldura" aria-hidden="true">
          <span className="hero__fundo-script" data-hero-fundo>
            Jade
          </span>
        </div>

        <div className="hero__arco" data-hero-arco>
          <div className="hero__abertura" data-hero-abertura>
            <div className="hero__cena" data-hero-cena>
              <Figure
                src="/images/jade/hero-jade.webp"
                srcSet="/images/jade/hero-jade-720.webp 720w, /images/jade/hero-jade.webp 1136w"
                sizes="(min-width: 900px) 60vw, 100vw"
                alt="Jade Romero, esteticista, apresentando com as mãos"
                note="Retrato de abertura"
                ratio={null}
                priority
                className="hero__figure"
              />
            </div>
          </div>
        </div>

        <div className="hero__marca" data-hero-marca>
          <span className="hero__lado" data-hero-lado>
            {cidade1}
          </span>
          <h1 className="hero__nome">
            <span className="hero__nome-caixa" data-hero-nome>
              <span className="hero__nome-1">Jade</span>
              <span className="hero__nome-2">Romero</span>
            </span>
            <span className="hero__nome-script" data-hero-script>
              Estética e Beleza
            </span>
          </h1>
          <span className="hero__lado" data-hero-lado>
            {cidade2.join(' ')}
          </span>
        </div>

        <div className="hero__deixa" data-hero-deixa aria-hidden="true">
          <span className="hero__deixa-linha" />
          <span>Jade Romero</span>
          <span>Tratamentos faciais personalizados</span>
        </div>

        <div className="hero__conteudo" data-hero-conteudo>
          {/* Frase da Jade, publicada por ela: uma oração de duas
              metades — a primeira nega, a segunda afirma. */}
          <h2 className="hero__titulo">
            <span className="hero__titulo-a" data-hero-linhas>
              {reconhecer.linha1}
            </span>
            <span className="hero__titulo-b" data-hero-linhas>
              {reconhecer.linha2}
            </span>
          </h2>

          <p className="hero__lead" data-hero-linhas>
            Tratamentos faciais personalizados, estética e cuidado construídos a
            partir da individualidade de cada pessoa.
          </p>

          <div className="hero__acoes" data-hero-acoes>
            <a
              className="btn btn--solid"
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar horário
            </a>
            <a className="link-rule hero__secundario" href="#tratamentos">
              Conhecer os tratamentos
            </a>
          </div>
        </div>

        <div className="hero__cupula" data-hero-cupula aria-hidden="true">
          <svg className="hero__cupula-arco" viewBox="0 0 1000 500">
            <defs>
              <path id="hero-arco-texto" d="M 80 500 A 420 420 0 0 1 920 500" />
            </defs>
            <text>
              <textPath href="#hero-arco-texto" startOffset="50%" textAnchor="middle">
                Corpo · Mente · Emoção
              </textPath>
            </text>
          </svg>
          <span className="hero__cupula-monograma">J</span>
          <span className="hero__cupula-linha" />
        </div>
      </div>
    </section>
  );
}

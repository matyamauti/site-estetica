import { experiencePoints, frasesJade } from '../lib/site';

/**
 * EXPERIÊNCIA — "Smooth Scroll Hero" do 21st.dev, refeito com GSAP.
 *
 * O palco fica preso na tela enquanto a seção rola ~1,6 tela:
 *   1. "AUTOCUIDADO" gigante no alto; abaixo, a foto dela numa janela
 *      estreita, vertical, ampliada por dentro;
 *   2. a janela abre até ocupar a tela inteira (clip-path) e a foto
 *      desamplia ao mesmo tempo — cobre a palavra;
 *   3. um véu escuro entra pela esquerda e a frase dela (sintonia) sobe.
 * Depois o palco solta e os quatro pontos vêm na rolagem normal.
 *
 * Do original ficaram: palco sticky, janela por clip-path que abre do
 * centro para as bordas, zoom de ~1,7× para 1× junto. Mudou: o
 * progresso é o da SEÇÃO (o original lia o scroll da página inteira e
 * só funcionava no topo), a janela começa no formato da foto (vertical)
 * e há texto sobre o final.
 *
 * Sem movimento: nada disso roda — palavra, foto e frase empilhadas.
 * A coreografia mora em motion.js (montarExperiencia).
 */
export default function Experience() {
  const { sintonia } = frasesJade;
  const [antes, depois] = sintonia.linha2.split(sintonia.destaque);

  return (
    <section className="section experience" data-tema="claro" data-trilho="Experiência" aria-labelledby="experiencia-titulo">
      <div className="experience__trilho" data-exp-trilho>
        <div className="experience__palco" data-exp-palco>
          <p className="experience__gigante" aria-hidden="true" data-exp-palavra>
            Autocuidado
          </p>

          <div className="experience__janela" data-exp-janela>
            <img
              className="experience__foto"
              src="/images/jade/experiencia.webp"
              srcSet="/images/jade/experiencia-720.webp 720w, /images/jade/experiencia.webp 1154w"
              sizes="100vw"
              alt="Jade Romero de perfil, de blazer branco, cercada por mãos que seguram sérum, rolo facial, paquímetro, pinça e gloss"
              loading="lazy"
              decoding="async"
              data-exp-foto
            />
            <span className="experience__veu" aria-hidden="true" data-exp-veu />
          </div>

          {/* Frase da Jade. A palavra que ela escreveu em caixa alta
              ganha o destaque (cor champanhe), como nos posts dela. */}
          <h2 className="experience__title" id="experiencia-titulo">
            <span data-exp-linha>{sintonia.linha1}</span>{' '}
            <span data-exp-linha>
              {antes}
              <em className="experience__destaque">{sintonia.destaque}</em>
              {depois}
            </span>
          </h2>
        </div>
      </div>

      <div className="site-container">
        <div className="experience__points" data-anim-grupo>
          {experiencePoints.map((point) => (
            <div className="experience__point" key={point.title} data-anim="bloco" data-fio>
              <h3 className="experience__point-title">{point.title}</h3>
              <p>{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

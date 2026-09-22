import Figure from './Figure';

/**
 * SOBRE JADE
 * Retrato sangrando até a borda esquerda da tela, texto ancorado no
 * eixo do container. Composição em 5/7 — nunca meio a meio, que é o
 * que faz uma seção parecer template.
 *
 * Só fatos informados pela cliente: catorze anos de atuação,
 * mentoria e o posicionamento que ela definiu ("tratamentos faciais
 * personalizados"). Nenhuma formação inventada. O título é o nome
 * dela — a frase de efeito antiga saiu a pedido do Matheus.
 */
export default function About() {
  /* A seção é pintada com a cor de marca dela (--c-nude-brand). O
     retrato de estúdio tem exatamente esse fundo, então a foto não
     entra como retângulo colado: ela funde na seção. */
  return (
    <section
      className="section about is-nude" data-tema="claro" data-trilho="Sobre"
      id="sobre"
      aria-labelledby="sobre-titulo"
    >
      <div className="about__grid u-edge-end">
        <div className="about__media">
          <Figure
            src="/images/jade/jade-retrato.webp"
            srcSet="/images/jade/jade-retrato-640.webp 640w, /images/jade/jade-retrato.webp 1136w"
            sizes="(min-width: 900px) 38vw, 100vw"
            alt="Jade Romero, esteticista, em retrato de estúdio"
            ratio="1136 / 1384"
            className="about__foto"
            data-anim="cortina"
          />
        </div>

        <div className="about__body" data-anim-grupo>
          <p className="label" data-anim="letras">
            Sobre
          </p>

          <h2 className="about__title" id="sobre-titulo" data-anim="linhas">
            Jade Romero
          </h2>
          <p className="about__cargo" data-anim="linhas">
            Esteticista · Tratamentos faciais personalizados
          </p>

          <div className="prose about__prose">
            <p data-anim="linhas">
              Há cerca de catorze anos, Jade Romero trabalha com estética e
              beleza. Hoje, o foco dela são os tratamentos faciais
              personalizados: cada protocolo começa por uma avaliação
              individual da pele e é construído para a pessoa que está ali.
            </p>
            <p data-anim="linhas">
              Além do atendimento, Jade é mentora de outras profissionais da
              área e compartilha o próprio método com quem quer trabalhar com
              o mesmo cuidado.
            </p>
          </div>

          <p className="about__marker" data-anim="bloco" data-fio>
            <span className="about__marker-value num">14+</span>
            <span className="label">Anos de experiência</span>
          </p>
        </div>
      </div>
    </section>
  );
}

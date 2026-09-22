import { brand, frasesJade } from '../lib/site';
import Figure from './Figure';

/**
 * MANIFESTO — a foto "Autocuidado" da Jade, com a frase dela já
 * gravada na imagem. Ocupa o bloco inteiro: o fundo da seção tem a cor
 * do estúdio da foto e as bordas da imagem se dissolvem nele, então a
 * foto parece ir de ponta a ponta.
 *
 * A cúpula que sobe no fim do hero tem essa mesma cor — ela "abre" a
 * foto em vez de encerrar o hero.
 *
 * A frase está na imagem; para leitor de tela ela vai no alt e no
 * título escondido.
 */
export default function Manifesto() {
  const { autocuidado } = frasesJade;
  const frase = `${autocuidado.linha1} ${autocuidado.linha2}`;

  return (
    <section
      className="manifesto is-dark"
      data-tema="escuro"
      data-trilho="Autocuidado"
      aria-labelledby="manifesto-titulo"
    >
      <h2 className="sr-only" id="manifesto-titulo">
        {frase}
      </h2>

      <div className="manifesto__palco">
        <Figure
          src="/images/jade/autocuidado.webp"
          srcSet="/images/jade/autocuidado-720.webp 720w, /images/jade/autocuidado.webp 1086w"
          sizes="(min-width: 900px) 56vw, 100vw"
          alt={`Jade Romero sorrindo, de colete bege, com a frase: ${frase}`}
          note="Autocuidado"
          ratio={null}
          className="manifesto__foto"
          data-anim="cortina"
        />

        <p className="manifesto__rodape" aria-hidden="true" data-anim="bloco">
          <span>{brand.name}</span>
          <span className="manifesto__rodape-fio" />
          <span>Estética e Beleza</span>
        </p>
      </div>
    </section>
  );
}

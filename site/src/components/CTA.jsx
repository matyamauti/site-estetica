import { useEffect, useRef } from 'react';
import { contact } from '../lib/site';
import BotaoCirculo from './BotaoCirculo';

/**
 * CTA FINAL
 * Segunda e última faixa escura. Uma frase, um botão. Aqui o texto
 * pode centralizar, porque é o único ponto da página em que ele
 * centraliza — vira clímax em vez de padrão.
 *
 * Fundo: vídeo dos atendimentos dela, mudo e em loop, sob uma camada
 * escura que garante a leitura. Só baixa quando a seção chega perto
 * da tela (são ~2 MB) e pausa quando sai. Com movimento reduzido, fica
 * só a imagem de capa, parada.
 */
function useVideoDeFundo() {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
    let carregou = false;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (reduzido.matches) return;
        if (e.isIntersecting) {
          if (!carregou) {
            video.preload = 'auto';
            video.load();
            carregou = true;
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '300px 0px' },
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, []);

  return ref;
}

export default function CTA() {
  const video = useVideoDeFundo();

  return (
    <section className="section cta is-dark" data-tema="escuro" data-trilho="Agendar" aria-labelledby="cta-titulo">
      <div className="cta__fundo" aria-hidden="true">
        <video
          ref={video}
          className="cta__video"
          muted
          loop
          playsInline
          preload="none"
          poster="/video/cuidado-capa.jpg"
          disablePictureInPicture
          tabIndex={-1}
        >
          <source src="/video/cuidado.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="site-container cta__inner" data-anim-grupo>
        <h2 className="cta__title" id="cta-titulo" data-anim="linhas">
          Seu momento de cuidado
          <br />
          começa aqui.
        </h2>

        <div className="cta__actions" data-anim="bloco">
          <a
            className="btn btn--solid"
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar pelo WhatsApp
          </a>
          <BotaoCirculo
            href={contact.whatsapp}
            rotulo="Agendar pelo WhatsApp"
            anel="Agendar · pelo · WhatsApp · Agendar · pelo · WhatsApp ·"
          />
          <a className="cta__phone" href={`tel:+5513988345368`}>
            {contact.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

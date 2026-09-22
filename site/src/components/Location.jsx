import { contact, mapa, mapsDirections } from '../lib/site';

/**
 * LOCALIZAÇÃO
 * Endereço à esquerda, mapa à direita. O mapa é o perfil da empresa
 * dela no Google (alfinete com o nome, avaliações e horário ao tocar),
 * embutido sem chave de API. Carrega só quando a seção chega perto
 * (loading="lazy") e ganha um filtro quente para não brigar com a
 * paleta nude — o colorido padrão do Google destoava. O próprio mapa
 * já traz "Abrir no Maps" e a rota; um botão nosso por cima repetia.
 */
export default function Location() {
  const { address } = contact;

  return (
    <section className="section location" data-tema="claro" data-trilho="Contato" id="contato" aria-labelledby="contato-titulo">
      <div className="site-container location__grid">
        <div className="location__info" data-anim-grupo>
          <p className="label" data-anim="letras">
            Onde estamos
          </p>

          <h2 className="location__title" id="contato-titulo" data-anim="linhas">
            {address.district},
            <br />
            {address.city}.
          </h2>

          <address className="location__address" data-anim="bloco">
            <span>Jade Romero | Estética e Beleza</span>
            <span>{address.street}</span>
            <span>
              {address.district} — {address.city}/{address.state}
            </span>
            <span className="num">{address.zip}</span>
            <a className="location__phone" href="tel:+5513988345368">
              {contact.phoneDisplay}
            </a>
          </address>

          <div className="location__actions" data-anim="bloco">
            <a
              className="btn btn--outline"
              href={mapsDirections}
              target="_blank"
              rel="noopener noreferrer"
            >
              Como chegar
            </a>
            <a
              className="btn btn--solid"
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar horário
            </a>
          </div>
        </div>

        <div className="location__map" data-anim="cortina">
          <iframe
            className="location__map-frame"
            src={mapa.embed}
            title="Mapa: Jade Romero | Estética e Beleza, R. Mário Tamashiro, 47, Canto do Forte, Praia Grande"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

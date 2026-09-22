import { brand, contact, nav } from '../lib/site';

/**
 * FOOTER
 * Fecha a página no mesmo escuro em que ela abriu. Poucos links:
 * os mesmos do topo, mais os dois canais de contato.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer is-dark" data-tema="escuro">
      <div className="site-container footer__inner" data-anim-grupo>
        <div className="footer__brand" data-anim="bloco">
          <p className="footer__name">{brand.name}</p>
          <p className="label">{brand.tagline}</p>
          <p className="footer__city">
            {brand.city} — {brand.state}
          </p>
        </div>

        <nav className="footer__nav" aria-label="Navegação do rodapé" data-anim="bloco">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </nav>

        <div className="footer__contact" data-anim="bloco">
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
            {contact.phoneDisplay}
          </a>
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
            {contact.instagramHandle}
          </a>
        </div>
      </div>

      <div className="site-container footer__legal" data-anim="bloco" data-fio>
        <p>
          © {year} {brand.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

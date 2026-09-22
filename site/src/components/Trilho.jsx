import './Trilho.css';

/**
 * RÉGUA DE PROGRESSO — a linha vertical na margem esquerda da
 * referência: número e nome da seção atual, e um fio que se preenche
 * conforme a página rola. Desktop e celular (compacta); o motion.js
 * alimenta.
 */
export default function Trilho() {
  return (
    <div className="trilho" aria-hidden="true">
      <span className="trilho__num num" data-trilho-num>
        01
      </span>
      <span className="trilho__linha">
        <span className="trilho__preenche" data-trilho-fill />
      </span>
      <span className="trilho__nome" data-trilho-nome>
        Início
      </span>
    </div>
  );
}

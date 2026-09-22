import { useState } from 'react';

/**
 * Figura com marcador de ausência.
 *
 * Enquanto o arquivo indicado em `src` não existir em public/images,
 * o bloco se desenha como placeholder identificado. No dia em que a
 * foto real for salva com aquele nome, ela aparece sozinha — nenhum
 * componente precisa ser editado.
 *
 * `ratio` reserva a altura antes do carregamento, então a página não
 * pula quando a imagem chega (CLS). Ele vira estilo inline, que vence
 * qualquer folha de estilo — então passe `ratio={null}` quando a
 * proporção precisar mudar por breakpoint, e defina no CSS.
 *
 * `srcSet` + `sizes` deixam o navegador baixar a versão certa para a
 * tela: no celular ele pega o arquivo de 640px em vez do de 1136px.
 * Sem `sizes` o navegador assume a largura total da janela e escolhe
 * grande demais, então os dois andam sempre juntos.
 *
 * `fit="contain"` é para recorte de pessoa sobre cor chapada: a
 * figura aparece inteira em vez de ser cortada pela moldura.
 */
export default function Figure({
  src,
  srcSet,
  sizes,
  alt = '',
  note,
  ratio = '3 / 4',
  fit = 'cover',
  priority = false,
  className = '',
  style,
  ...rest
}) {
  const [missing, setMissing] = useState(false);

  return (
    <figure
      className={`figure ${fit === 'contain' ? 'figure--contain' : ''} ${className}`}
      data-state={missing ? 'placeholder' : 'image'}
      style={{ ...(ratio ? { aspectRatio: ratio } : null), ...style }}
      {...rest}
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setMissing(true)}
      />
      <figcaption className="figure__note">
        <b>Foto pendente</b>
        <span>
          {note || alt}
          <br />
          {src}
        </span>
      </figcaption>
    </figure>
  );
}

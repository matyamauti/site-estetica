/* =============================================================
   CONTEÚDO DO SITE
   Único lugar com dados da marca. Nada aqui é inventado: telefone,
   endereço, nota do Google e depoimentos vieram da cliente.
   Para editar o site, comece por este arquivo.
   ============================================================= */

export const brand = {
  name: 'Jade Romero',
  tagline: 'Estética e Beleza',
  city: 'Praia Grande',
  state: 'SP',
};

export const contact = {
  phoneDisplay: '(13) 98834-5368',
  whatsapp: 'https://wa.me/5513988345368',
  instagramHandle: '@jaderomero.est',
  instagram: 'https://www.instagram.com/jaderomero.est/',
  address: {
    street: 'R. Mário Tamashiro, 47',
    district: 'Canto do Forte',
    city: 'Praia Grande',
    state: 'SP',
    zip: '11700-180',
  },
};

export const addressOneLine =
  `${contact.address.street} — ${contact.address.district}, ` +
  `${contact.address.city}/${contact.address.state}`;

export const mapsDirections =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(
    `${contact.address.street}, ${contact.address.district}, ${contact.address.city} - ${contact.address.state}, ${contact.address.zip}`,
  );

/* Mapa: perfil da empresa dela no Google ("Jade Romero | Estética e
   Beleza"), resolvido do link de compartilhar que o Matheus mandou em
   22/09/2026 (https://maps.app.goo.gl/a9wK75xVX2GoSNKt8). Coordenadas
   do alfinete do perfil: -24.0069226, -46.4072251. O embed usa o NOME
   do perfil + as coordenadas, sem chave de API. */
export const mapa = {
  perfil: 'https://maps.app.goo.gl/a9wK75xVX2GoSNKt8',
  embed:
    'https://maps.google.com/maps?q=' +
    encodeURIComponent('Jade Romero | Estética e Beleza') +
    '&ll=-24.0069226,-46.4072251&z=17&hl=pt-BR&output=embed',
};

export const nav = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Tratamentos', href: '#tratamentos' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Avaliações', href: '#avaliacoes' },
  { label: 'Contato', href: '#contato' },
];

/* Categorias estruturais. Sem preço, sem duração, sem promessa
   clínica — nada disso foi informado e nada disso se inventa.
   `image` é a base do arquivo em images/tratamentos: existem as
   versões -640 e -960, todas em 4:5 (recortadas dos originais em
   images/resultados em 21/09/2026). */
export const treatments = [
  {
    id: '01',
    name: 'Tratamentos Faciais',
    curto: 'Faciais',
    note: 'Protocolos definidos a partir da avaliação da sua pele.',
    image: '/images/tratamentos/faciais',
    placeholder: 'Detalhe de procedimento facial',
    alt: 'Limpeza de pele: profissional de luvas trabalhando no rosto de uma cliente de olhos fechados',
  },
  {
    id: '02',
    name: 'Sobrancelhas',
    curto: 'Sobrancelhas',
    note: 'Desenho construído sobre as proporções do seu rosto.',
    image: '/images/tratamentos/sobrancelhas',
    placeholder: 'Close de sobrancelha finalizada',
    alt: 'Close de rosto com escovinha de sobrancelha e a lista de cuidados com as sobrancelhas',
  },
  {
    id: '03',
    name: 'Micropigmentação',
    curto: 'Micropigmentação',
    note: 'Técnica aplicada fio a fio, respeitando o traço natural.',
    image: '/images/tratamentos/micropigmentacao',
    placeholder: 'Procedimento de micropigmentação em andamento',
    alt: 'Micropigmentação de sobrancelha em andamento, com o aparelho junto ao traço',
  },
  {
    id: '04',
    name: 'Cuidados Personalizados',
    curto: 'Personalizados',
    note: 'Combinações pensadas para a sua rotina e o seu tempo.',
    image: '/images/tratamentos/personalizados',
    placeholder: 'Ambiente de atendimento individual',
    alt: 'Jade Romero sentada no espaço de atendimento, com a frase: pele bonita não é pele ressecada de ácido',
  },
];

export const stats = [
  { value: 14, suffix: '+', label: 'Anos de experiência' },
  { value: 4.9, decimals: 1, label: 'Avaliação no Google' },
  { value: 265, suffix: '+', label: 'Avaliações recebidas' },
];

/* Depoimentos reais recebidos. Não acrescentar nenhum que não
   tenha sido enviado pela cliente. */
export const testimonials = [
  {
    quote:
      'Quando me mudei para Praia Grande pesquisei muito por profissionais, pois minha sobrancelha não é muito fácil de fazer. A Jade foi muito paciente, ouviu a forma que eu gosto e acertou demais. Ela é uma profissional maravilhosa e uma pessoa incrível também.',
    author: 'Taynara Serra',
  },
  {
    quote:
      'Conheço o trabalho da Jade há quase 10 anos e posso afirmar que ela arrasa! Recentemente conheci o espaço e fiz outros procedimentos e as meninas que realizam os atendimentos também são maravilhosas. Tudo muito impecável!',
    author: 'Letícia Carvalho',
  },
];

/* =============================================================
   FRASES DA JADE
   Escritas e publicadas por ela no Instagram. Não são copy de
   agência: são a voz da marca. Preferir sempre estas a qualquer
   frase nova inventada para o site.
   Origem: site/originais/frases/
   ============================================================= */
/* As chaves nomeiam o CONTEÚDO da frase, não a seção onde ela está.
   Assim uma frase pode mudar de lugar na página sem que o nome
   dela vire mentira. */
export const frasesJade = {
  /* Hero */
  reconhecer: {
    linha1: 'Não é sobre mudar quem você é,',
    linha2: 'mas sobre se reconhecer em quem você sempre foi.',
  },
  /* Experiência (desde 21/09/2026). "BELEZA" em caixa alta como ela
     escreveu; o componente destaca a palavra. */
  sintonia: {
    linha1: 'Quando corpo, mente e emoção estão em sintonia,',
    linha2: 'a BELEZA se torna um estado de espírito.',
    destaque: 'BELEZA',
  },
  /* Manifesto (gravada na foto; aqui vai para alt e leitor de tela) */
  autocuidado: {
    linha1: 'Autocuidado não deveria acontecer',
    linha2: 'só quando você está exausta.',
  },

  /* Ainda sem lugar na página. É o texto mais técnico que ela tem e
     serve inteiro para uma futura página de olheiras / área dos
     olhos — ou para substituir o destaque de micropigmentação, se
     essa for a decisão. Não usar picotado. */
  areaDosOlhos: {
    titulo: 'E nem toda olheira é igual.',
    texto:
      'A área dos olhos costuma ser a primeira a demonstrar cansaço, porque a pele ali é muito mais fina, delicada e sensível.',
  },
};

export const experiencePoints = [
  {
    title: 'Avaliação individual',
    text: 'A conversa vem antes do procedimento. O que a sua pele pede não é o que a pele da outra pessoa pede.',
  },
  {
    title: 'Atendimento pessoal',
    text: 'Horário reservado, sem fila e sem pressa. Você é a única pessoa em atendimento naquele momento.',
  },
  {
    title: 'Ambiente acolhedor',
    text: 'Um espaço pensado para que a hora do cuidado seja também a hora de desacelerar.',
  },
  {
    title: 'Cuidado em cada detalhe',
    text: 'Materiais, assepsia e acabamento tratados com o mesmo rigor do resultado final.',
  },
];

/* Casos de antes e depois. Os arquivos saem de originais/Procedimentos
   (originais) recortados no mesmo tamanho, 1080×1296, sem a assinatura
   do rodapé — senão ela "pula" ao arrastar. O `note` é o texto que a
   própria Jade escreveu na foto.
   ATENÇÃO: publicar só com autorização escrita da cliente. */
export const results = [
  {
    before: '/images/resultados/caso-01-antes',
    after: '/images/resultados/caso-01-depois',
    label: 'Caso 01',
    note: 'Protocolo personalizado para cicatriz de acne',
  },
  /* Fotos tiradas de cima (rosto de ponta-cabeça), como ela postou.
     A ANTES foi ampliada 1,29× e deslocada para os olhos, sobrancelhas
     e nariz caírem no mesmo lugar da DEPOIS — só escala e posição,
     nada deformado. `descricao` é o texto enviado pelo Matheus em
     21/09/2026; o `note` segue o padrão do caso 01. */
  {
    before: '/images/resultados/caso-02-antes',
    after: '/images/resultados/caso-02-depois',
    label: 'Caso 02',
    note: 'Protocolo personalizado para hidratação e luminosidade',
    descricao:
      'Pele com mais hidratação, textura mais uniforme, luminosidade e manchas visivelmente suavizadas após um protocolo personalizado.',
  },
];

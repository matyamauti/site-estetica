/**
 * Formata a planilha de links da bio da Jade Romero.
 * Cole em Extensões > Apps Script, salve e execute "formatar".
 * Pode rodar quantas vezes quiser — ele sempre deixa no mesmo estado.
 */

function formatar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheets()[0];
  sh.setName('Links');

  var ULT = 30;                       // linhas úteis
  var ICONES = ['agenda', 'grupo', 'ebook', 'estrela', 'local', 'presente', 'coracao', 'link'];

  // ── enxugar a grade ────────────────────────────────────────
  if (sh.getMaxRows() > ULT) sh.deleteRows(ULT + 1, sh.getMaxRows() - ULT);
  if (sh.getMaxColumns() > 5) sh.deleteColumns(6, sh.getMaxColumns() - 5);
  sh.setHiddenGridlines(true);

  // ── cabeçalho na cor da marca ──────────────────────────────
  var cab = sh.getRange('A1:E1');
  cab.setBackground('#0A0908')
     .setFontColor('#B08D5E')
     .setFontWeight('bold')
     .setFontSize(11)
     .setFontFamily('Inter')
     .setVerticalAlignment('middle')
     .setHorizontalAlignment('left');
  sh.setRowHeight(1, 42);
  sh.setFrozenRows(1);

  // ── corpo ──────────────────────────────────────────────────
  var corpo = sh.getRange(2, 1, ULT - 1, 5);
  corpo.setFontFamily('Inter')
       .setFontSize(10)
       .setVerticalAlignment('middle')
       .setWrap(false)
       .setBorder(true, true, true, true, true, true,
                  '#E4DED8', SpreadsheetApp.BorderStyle.SOLID);
  for (var r = 2; r <= ULT; r++) sh.setRowHeight(r, 32);

  sh.setColumnWidth(1, 95);    // destaque
  sh.setColumnWidth(2, 115);   // icone
  sh.setColumnWidth(3, 230);   // titulo
  sh.setColumnWidth(4, 310);   // descricao
  sh.setColumnWidth(5, 280);   // link

  // ── menus suspensos: acabam com o erro de digitação ────────
  sh.getRange(2, 1, ULT - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['sim', 'nao'], true)
      .setAllowInvalid(false)
      .setHelpText('Use "sim" em um botão só — o principal.')
      .build()
  );

  sh.getRange(2, 2, ULT - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(ICONES, true)
      .setAllowInvalid(false)
      .setHelpText('Escolha o desenho que aparece ao lado do botão.')
      .build()
  );

  // ── a linha do botão principal fica dourada ────────────────
  var regra = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$A2="sim"')
    .setBackground('#F7EAD6')
    .setBold(true)
    .setRanges([sh.getRange(2, 1, ULT - 1, 5)])
    .build();
  sh.setConditionalFormatRules([regra]);

  // ── avisar antes de mexer no cabeçalho ─────────────────────
  var jaProtegido = false;
  var protecoes = sh.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  for (var i = 0; i < protecoes.length; i++) {
    if (protecoes[i].getDescription() === 'cabecalho') jaProtegido = true;
  }
  if (!jaProtegido) {
    sh.getRange('A1:E1').protect()
      .setDescription('cabecalho')
      .setWarningOnly(true);
  }

  criarAbaInstrucoes(ss);
  sh.getRange('C2').activate();
  SpreadsheetApp.getUi().alert('Pronto! Planilha formatada.');
}


function criarAbaInstrucoes(ss) {
  var nome = 'Como usar';
  var aba = ss.getSheetByName(nome);
  if (aba) ss.deleteSheet(aba);
  aba = ss.insertSheet(nome);

  var linhas = [
    ['COMO EDITAR OS LINKS DA SUA BIO'],
    [''],
    ['Cada LINHA da aba "Links" é um botão da sua página,'],
    ['na mesma ordem em que aparecem lá.'],
    [''],
    ['AS COLUNAS'],
    [''],
    ['destaque    "sim" no botão principal, o que você mais quer que'],
    ['            cliquem. Ele fica dourado e maior. Use "sim" em um só.'],
    [''],
    ['icone       O desenho do lado esquerdo. Clique na célula e escolha'],
    ['            na lista. Não precisa digitar.'],
    [''],
    ['titulo      O nome do botão. Curto.'],
    [''],
    ['descricao   A frase pequena embaixo. Curta, para caber numa linha.'],
    [''],
    ['link        O endereço completo, começando com https://'],
    [''],
    ['NO DIA A DIA'],
    [''],
    ['Esconder um botão    apague a linha inteira'],
    ['Adicionar um botão   escreva numa linha nova embaixo'],
    ['Mudar a ordem        arraste a linha para cima ou para baixo'],
    [''],
    ['O ideal são 4 ou 5 botões. Muito botão faz a pessoa não escolher'],
    ['nenhum.'],
    [''],
    ['Não apague a primeira linha da aba "Links" — é ela que a página'],
    ['usa para se orientar.'],
    [''],
    ['As mudanças aparecem em alguns minutos.'],
    [''],
    ['SE ALGO DER ERRADO'],
    [''],
    ['A página nunca fica sem links. Se a planilha sair do ar ou ficar'],
    ['vazia, ela volta sozinha a mostrar os links originais. Linha com'],
    ['título ou link em branco é simplesmente pulada.']
  ];

  aba.getRange(1, 1, linhas.length, 1).setValues(linhas);
  aba.getRange('A1').setFontSize(14).setFontWeight('bold').setFontColor('#0A0908');
  aba.getRange('A6').setFontWeight('bold').setFontColor('#8F7550');
  aba.getRange('A20').setFontWeight('bold').setFontColor('#8F7550');
  aba.getRange('A34').setFontWeight('bold').setFontColor('#8F7550');
  aba.getRange(1, 1, linhas.length, 1).setFontFamily('Inter');
  aba.setColumnWidth(1, 620);
  aba.setHiddenGridlines(true);
  if (aba.getMaxColumns() > 2) aba.deleteColumns(3, aba.getMaxColumns() - 2);
}

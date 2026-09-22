// AUDITORIA DO SITE — controla o Chrome headless pelo protocolo de
// depuração, com relógio REAL (não use --virtual-time-budget: ele não
// entrega os quadros de animação no ritmo normal e dá falso alarme).
//
// Precisa do servidor rodando (npm run dev, porta 5183). Rode de site/:
//   node ferramentas/cdp.mjs auditar 1440x900 1366x768 375x812
//        rola a página inteira e confere cada elemento animado: preso
//        invisível, cortina presa, fio incompleto, rolagem lateral
//   REDUZIDO=1 node ferramentas/cdp.mjs auditar 1440x900
//        mesmo teste com prefers-reduced-motion
//   node ferramentas/cdp.mjs foto 1440x900:.about:520
//        para a seção no seletor e fotografa N ms depois (meio da animação)
//   node ferramentas/cdp.mjs vaza 375x812
//        lista elementos passando da largura da tela
//   node ferramentas/cdp.mjs arrastar 1440x900 375x812
//        arrasta o comparador antes/depois com mouse/dedo reais (CARD=1 para o 2º)
//   node ferramentas/cdp.mjs cliques 1440x900 375x812
//        confere se algo invisível rouba o clique de links/botões; abre e fecha o menu
//   node ferramentas/cdp.mjs topo 1440x900 375x812
//        selo e links do header somem ao descer e voltam ao subir
//   node ferramentas/cdp.mjs slides 1440x900
//        passa os 4 slides dos Tratamentos e diz quais nomes aparecem em cada troca
//   node ferramentas/cdp.mjs autoplay 1440x900
//        troca automática dos Tratamentos: anda sozinha, para com mouse e com o botão
//   node ferramentas/cdp.mjs toque 375x812
//        rola com gesto de dedo e lê o estado das animações presas à rolagem
//   node ferramentas/cdp.mjs carrossel 1440x900
//        fotografa uma troca de slide dos Tratamentos em 4 momentos
// Fotos vão para ferramentas/saida/ (ignorada pelo git).
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORTA = 9333;
const SITE = process.env.SITE || 'http://localhost:5183/';
const OUT = process.env.OUT || 'ferramentas/saida';
mkdirSync(OUT, { recursive: true });
const [modo, ...alvos] = process.argv.slice(2);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const perfil = `${process.env.TEMP}/claude/cdp-${Date.now()}`;
mkdirSync(perfil, { recursive: true });
const chrome = spawn(CHROME, [
  '--headless=new', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${PORTA}`,
  `--user-data-dir=${perfil}`, '--window-size=1920,1200', 'about:blank',
], { stdio: 'ignore' });

let alvo;
for (let i = 0; i < 50 && !alvo; i++) {
  await espera(200);
  try { alvo = (await (await fetch(`http://127.0.0.1:${PORTA}/json/list`)).json()).find((t) => t.type === 'page'); } catch {}
}
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0; const pend = new Map(); const eventos = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else if (d.method) eventos.push(d);
});
const cdp = (method, params = {}) => new Promise((r) => { const id = ++seq; pend.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await cdp('Page.enable'); await cdp('Runtime.enable');
if (process.env.REDUZIDO) await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

const avaliar = async (fn, arg) => {
  const r = await cdp('Runtime.evaluate', { expression: `(${fn})(${JSON.stringify(arg)})`, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) return { erro: r.result.exceptionDetails.text + ' ' + (r.result.exceptionDetails.exception?.description || '') };
  return r.result?.result?.value;
};

async function abrir(w, h) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
  eventos.length = 0;
  await cdp('Page.navigate', { url: SITE });
  for (let i = 0; i < 60 && !eventos.some((e) => e.method === 'Page.loadEventFired'); i++) await espera(100);
  await espera(2500);
}

// ---- roda DENTRO da página do site ------------------------------------
const AUDITAR = async () => {
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const H = innerHeight, total = () => document.documentElement.scrollHeight - H;
  const html = document.documentElement;
  const inicio = { motion: html.dataset.motion, lenis: html.classList.contains('lenis'), fonte: document.fonts.status };
  let overflowMax = 0;
  for (let y = 0; y <= total(); y += Math.round(H * 0.45)) {
    window.scrollTo(0, y); await espera(300);
    overflowMax = Math.max(overflowMax, html.scrollWidth - html.clientWidth);
  }
  window.scrollTo(0, total()); await espera(3200);
  const cs = (el) => getComputedStyle(el), problemas = [];
  const itens = [...document.querySelectorAll('[data-anim], [data-hero], [data-fio]')];
  itens.forEach((el) => {
    const c = cs(el), nome = (el.className && String(el.className).split(' ')[0]) || el.tagName;
    if (c.visibility !== 'visible') problemas.push(nome + ': visibility ' + c.visibility);
    if (parseFloat(c.opacity) < 0.99) problemas.push(nome + ': opacity ' + c.opacity);
    if (el.dataset.anim === 'cortina' && c.clipPath !== 'none') problemas.push(nome + ': cortina presa');
    if (el.hasAttribute('data-fio') && (el.style.getPropertyValue('--fio') || '1').trim() !== '1') problemas.push(nome + ': fio ' + el.style.getPropertyValue('--fio'));
  });
  const ST = window.__jrMotion?.ScrollTrigger;
  return {
    tela: [innerWidth, H], inicio, alturaPagina: html.scrollHeight, animados: itens.length,
    totalProblemas: problemas.length, problemas: problemas.slice(0, 10),
    restosDeSplit: document.querySelectorAll('.jr-linha, .jr-letra').length,
    triggersVivos: ST ? ST.getAll().filter((t) => !t.animation && !t.vars.scrub).length : '?',
    quaisVivos: ST ? ST.getAll().filter((t) => !t.animation && !t.vars.scrub).map((t) => {
      const el = t.trigger; const nome = el && ((el.className && String(el.className).split(' ')[0]) || el.tagName);
      return nome + (t.animation ? ' (tween)' : ' (revelação)') + ' prog=' + t.progress.toFixed(2);
    }) : [],
    overflowX: overflowMax,
  };
};

const PARAR = async ([fracao, ms]) => {
  const espera = (x) => new Promise((r) => setTimeout(r, x));
  // '.seletor' para 12% acima do topo; '.seletor@0.8' rola o topo dele até o topo da tela + 0,8 tela
  const [sel, extra] = String(fracao).split('@');
  const alvo = isNaN(Number(fracao)) ? Math.round(document.querySelector(sel).getBoundingClientRect().top + scrollY + (extra === undefined ? -innerHeight * 0.12 : innerHeight * Number(extra))) : Math.round((document.documentElement.scrollHeight - innerHeight) * fracao);
  for (let y = 0; y < alvo; y += Math.round(innerHeight * 0.5)) { window.scrollTo(0, y); await espera(60); }
  window.scrollTo(0, alvo); await espera(ms); return alvo;
};

const VAZA = async () => {
  const W = document.documentElement.clientWidth, out = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > W + 1 && !el.closest('.hero__palco') && getComputedStyle(el).position !== 'fixed') {
      out.push((el.className && String(el.className).split(' ')[0] || el.tagName) + ' dir=' + Math.round(r.right) + ' larg=' + Math.round(r.width));
    }
  });
  return { W, scrollW: document.documentElement.scrollWidth, vazam: [...new Set(out)].slice(0, 12) };
}; // MODO_VAZA
const resultados = []; let passos_topo;
for (const a of alvos) {
  const [tam, fr, ms] = a.split(':'); const [w, h] = tam.split('x').map(Number);
  await abrir(w, h);
  if (modo === 'carrossel') {
    await avaliar(PARAR.toString(), ['.treatments', 2200]);
    for (const [ms, nome] of [[0, 'antes'], [350, 'meio1'], [750, 'meio2'], [1700, 'depois']]) {
      if (nome === 'meio1') await avaliar(`(async()=>{document.querySelector('[aria-label="Próximo tratamento"]').click();await new Promise(r=>setTimeout(r,${ms}));})()`);
      else if (ms) await espera(ms - (nome === 'meio2' ? 350 : 750));
      const shot = await cdp('Page.captureScreenshot', { format: 'png' });
      writeFileSync(`${OUT}/carrossel-${w}-${nome}.png`, Buffer.from(shot.result.data, 'base64'));
    }
    resultados.push({ carrossel: 'ok' });
  } else if (modo === 'arrastar') {
    // arraste REAL (Input.dispatch*), não evento sintético: mouse no
    // desktop, dedo no celular. Lê --pos do comparador a cada passo.
    await avaliar(PARAR.toString(), ['.compare', 4500]);
    const caixa = await avaliar(`()=>{const f=document.querySelectorAll('.compare__frame')[${process.env.CARD || 0}];f.scrollIntoView({block:'center'});const r=f.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}}`);
    await espera(600);
    passos_topo = await avaliar(`()=>{const f=document.querySelectorAll('.compare__frame')[${process.env.CARD || 0}];const r=f.getBoundingClientRect();const pts=[[.2,.5],[.5,.5],[.8,.3]];return pts.map(([a,b])=>{const e=document.elementFromPoint(r.left+r.width*a,r.top+r.height*b);return e?(e.tagName+'.'+String(e.className).split(' ')[0]+' em '+(e.closest('section')?.className||'')):'nada'})}`);
    const pos = () => avaliar(`()=>document.querySelectorAll('.compare__frame')[${process.env.CARD || 0}].style.getPropertyValue('--pos')`);
    const y = caixa.y + caixa.h * 0.5; const passos = [];
    const X = (f) => caixa.x + caixa.w * f;
    const toque = w < 600;
    const ir = (tipo, f) => toque
      ? cdp('Input.dispatchTouchEvent', { type: tipo === 'down' ? 'touchStart' : tipo === 'up' ? 'touchEnd' : 'touchMove', touchPoints: tipo === 'up' ? [] : [{ x: X(f), y }] })
      : cdp('Input.dispatchMouseEvent', { type: tipo === 'down' ? 'mousePressed' : tipo === 'up' ? 'mouseReleased' : 'mouseMoved', x: X(f), y, button: 'left', buttons: tipo === 'up' ? 0 : 1, clickCount: 1 });
    if (!toque) await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: X(0.5), y });
    passos.push(['inicio', await pos()]);
    await ir('down', 0.5); passos.push(['apertou 50%', await pos()]);
    for (const f of [0.6, 0.75, 0.9, 0.3, 0.1]) { await ir('move', f); await espera(40); passos.push([`moveu ${f * 100}%`, await pos()]); }
    const shot = await cdp('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${OUT}/arrastar-${w}.png`, Buffer.from(shot.result.data, 'base64'));
    await ir('up', 0.1); passos.push(['soltou', await pos()]);
    if (!toque) { await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: X(0.8), y, buttons: 0 }); passos.push(['moveu sem apertar 80%', await pos()]); }
    resultados.push({ tela: w, topo: passos_topo, passos });
  } else if (modo === 'cliques') {
    // todo link/botão da página precisa ser o elemento no topo do seu
    // próprio centro — senão algo invisível por cima está roubando o
    // clique. Depois abre e fecha o menu pelo botão, com clique real.
    resultados.push(await avaliar(`async()=>{const e=(m)=>new Promise(r=>setTimeout(r,m));const bloq=[];const els=[...document.querySelectorAll('main a, main button, footer a, header a, header button')];
      for(const el of els){el.scrollIntoView({block:'center'});await e(120);const r=el.getBoundingClientRect();if(!r.width)continue;const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);if(!t||!(t===el||el.contains(t)||t.contains(el)))bloq.push((el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,30)+' <- '+(t?t.tagName+'.'+String(t.className).split(' ')[0]:'nada'))}
      return {testados:els.length,bloqueados:bloq}}`));
    // mede DEPOIS de o header terminar de voltar (0,6s): antes disso o botão
    // ainda está entrando e o clique cai no lugar errado
    await avaliar(`()=>scrollTo(0,0)`); await espera(1000);
    const b = await avaliar(`()=>{const b=document.querySelector('[aria-controls=menu-mobile]');const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}}`);
    const clicar = async (x, y) => { await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 }); await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 }); };
    const estado = () => avaliar(`()=>{const m=document.getElementById('menu-mobile');const c=getComputedStyle(m);return c.visibility+'/'+c.opacity+'/'+c.pointerEvents+' foco:'+(document.activeElement?.textContent||'').trim().slice(0,15)}`);
    await clicar(b.x, b.y); await espera(600); const aberto = await estado();
    await clicar(b.x, b.y); await espera(600); const fechado = await estado();
    resultados.push({ menuAberto: aberto, menuFechado: fechado });
  } else if (modo === 'topo') {
    // links do header: somem ao descer, voltam ao subir (roda do mouse real)
    const est = () => avaliar(`()=>{const f=(s)=>{const c=getComputedStyle(document.querySelector(s));return c.visibility+' op='+(+c.opacity).toFixed(2)};return 'y='+Math.round(scrollY)+' | links '+f('.header__pilha')+' | selo '+f('.header__selo')}`);
    const roda = async (dy) => { await cdp('Input.dispatchMouseEvent', { type: 'mouseWheel', x: w / 2, y: h / 2, deltaX: 0, deltaY: dy }); await espera(900); };
    const passos = [['topo', await est()]];
    for (let i = 0; i < 4; i++) await roda(500);
    passos.push(['desceu', await est()]);
    await roda(-250); passos.push(['subiu um pouco', await est()]);
    await roda(400); passos.push(['desceu de novo', await est()]);
    resultados.push({ tela: w, passos });
  } else if (modo === 'slides') {
    // passa todos os slides dos Tratamentos com clique real na seta e,
    // no meio de cada troca, lista quais nomes gigantes estão visíveis
    await avaliar(PARAR.toString(), ['.treatments', 2200]);
    const seta = await avaliar(`()=>{const b=document.querySelector('[aria-label="Próximo tratamento"]');b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}}`);
    await espera(500);
    const nomes = () => avaliar(`()=>[...document.querySelectorAll('[data-slide-nome]')].map(n=>{const c=getComputedStyle(n);const letras=[...n.querySelectorAll('.jr-letra')];const op=letras.length?Math.max(...letras.map(l=>+getComputedStyle(l).opacity)):+c.opacity;return n.textContent.trim()+':'+(c.visibility==='visible'&&op>0.05?'VISIVEL':'-')}).join(' ')`);
    const passos = [['inicio', await nomes()]];
    for (let i = 1; i <= 4; i++) {
      await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: seta.x, y: seta.y, button: 'left', buttons: 1, clickCount: 1 });
      await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: seta.x, y: seta.y, button: 'left', buttons: 0, clickCount: 1 });
      await espera(250); passos.push([`troca ${i} +0.25s`, await nomes()]);
      await espera(700); passos.push([`troca ${i} +0.95s`, await nomes()]);
      const shot = await cdp('Page.captureScreenshot', { format: 'png' });
      writeFileSync(`${OUT}/slides-${w}-${i}.png`, Buffer.from(shot.result.data, 'base64'));
      await espera(1200); passos.push([`troca ${i} fim`, await nomes()]);
    }
    resultados.push({ tela: w, passos });
  } else if (modo === 'autoplay') {
    // troca automática dos Tratamentos: roda sozinha, para com o mouse
    // em cima, para com o botão de pausa. Lê o slide ativo pelo contador.
    await avaliar(PARAR.toString(), ['.treatments', 1500]);
    await avaliar(`()=>document.querySelector('.treatments__carrossel').scrollIntoView({block:'center'})`);
    const num = () => avaliar(`()=>document.querySelector('.treatments__num').textContent`);
    const passos = [['inicio', await num()]];
    await espera(6200); passos.push(['6,2s sozinho', await num()]);
    await espera(5600); passos.push(['11,8s sozinho', await num()]);
    const foto = await avaliar(`()=>{const r=document.querySelector('.treatments__palco').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}}`);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: foto.x, y: foto.y });
    const antes = await num(); await espera(7000); passos.push(['mouse em cima 7s (deve ficar)', antes + ' -> ' + await num()]);
    await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 });
    await espera(6200); passos.push(['mouse saiu 6,2s (deve andar)', await num()]);
    const b = await avaliar(`()=>{const e=document.querySelector('.treatments__pausa');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}}`);
    if (b) {
      await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: b.x, y: b.y, button: 'left', buttons: 1, clickCount: 1 });
      await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: b.x, y: b.y, button: 'left', buttons: 0, clickCount: 1 });
      await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 });
      const p0 = await num(); await espera(7000);
      passos.push(['pausado pelo botão 7s (deve ficar)', p0 + ' -> ' + await num() + ' | ' + await avaliar(`()=>document.querySelector('.treatments__pausa').getAttribute('aria-label')`)]);
    } else passos.push(['botão de pausa', 'NÃO EXISTE']);
    resultados.push({ tela: w, passos });
  } else if (modo === 'toque') {
    // rola a página com GESTO DE DEDO (synthesizeScrollGesture, toque) e
    // lê, em cada parada, o estado das animações presas à rolagem:
    // arco do hero, cúpula, janela da Experiência, tema do header.
    await cdp('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await cdp('Emulation.setEmitTouchEventsForMouse', { enabled: true, configuration: 'mobile' });
    // recarrega com o toque já ligado (a página decide o modo ao carregar)
    eventos.length = 0; await cdp('Page.reload', { ignoreCache: true });
    for (let i = 0; i < 60 && !eventos.some((e) => e.method === 'Page.loadEventFired'); i++) await espera(100);
    await espera(2500);
    const fonte = process.env.FONTE || 'dedo';
    const estado = () => avaliar(`()=>{const q=(s)=>document.querySelector(s);const arco=q('[data-hero-arco]');const cup=q('[data-hero-cupula]');const jan=q('[data-exp-janela]');const r=(e)=>e?Math.round(e.getBoundingClientRect().top):null;
      return {y:Math.round(scrollY), arco:arco?getComputedStyle(arco).clipPath.slice(0,28):'-', cupulaTopo:r(cup), janela:jan?jan.style.clipPath.slice(0,34):'-', tema:document.documentElement.dataset.tema, nome:q('[data-trilho-nome]')?.textContent}}`);
    const passos = [await estado()];
    if (process.env.DIAG) passos.push(await avaliar(`()=>{const e=document.elementFromPoint(innerWidth/2,innerHeight*0.75);return {titulo:document.title,texto:document.body.innerText.slice(0,160),rs:document.readyState,sh:document.documentElement.scrollHeight,ih:innerHeight,motion:document.documentElement.dataset.motion,ov:getComputedStyle(document.body).overflow+'/'+getComputedStyle(document.documentElement).overflow,alvo:e?e.tagName+'.'+String(e.className).slice(0,40):'-',ta:e?getComputedStyle(e).touchAction:'-',scripts:[...document.scripts].map(s=>s.src.slice(-40))}}`));
    for (let i = 0; i < Number(process.env.PASSOS || 16); i++) {
      if (fonte === 'dedo') {
        // dedo "de verdade": toque, arrasto em 12 passos e solta
        const x = Math.round(w / 2); const y0 = Math.round(h * 0.75); const d = Math.round(h * 0.55);
        await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] });
        for (let k = 1; k <= 12; k++) { await cdp('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 - (d * k) / 12 }] }); await espera(16); }
        await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else {
        await cdp('Input.synthesizeScrollGesture', { x: Math.round(w / 2), y: Math.round(h * 0.7), yDistance: -Math.round(h * 0.6), gestureSourceType: fonte, speed: 1400 });
      }
      await espera(1300);
      passos.push(await estado());
    }
    resultados.push({ tela: w, passos });
  } else if (modo === 'vaza') { resultados.push(await avaliar(VAZA.toString())); } else if (modo === 'auditar') {
    resultados.push(await avaliar(AUDITAR.toString()));
  } else {
    const y = await avaliar(PARAR.toString(), [fr, Number(ms)]);
    // VIDEO_T=6 congela os vídeos da página nesse segundo antes da foto
    if (process.env.VIDEO_T) { await avaliar(`async(t)=>{for(const v of document.querySelectorAll('video')){v.pause();v.preload='auto';if(v.readyState<2){v.load();await new Promise(r=>v.addEventListener('loadeddata',r,{once:true}))}v.currentTime=t;await new Promise(r=>v.addEventListener('seeked',r,{once:true}))}}`, Number(process.env.VIDEO_T)); await espera(300); }
    // ESCONDER=.seletor some com o elemento (para medir o fundo atrás do texto)
    if (process.env.ESCONDER) await avaliar(`(s)=>document.querySelectorAll(s).forEach(e=>e.style.setProperty('opacity','0','important'))`, process.env.ESCONDER);
    // AVALIAR='expressão' imprime o valor dela no momento da foto (depuração)
    if (process.env.AVALIAR) resultados.push({ avaliado: await avaliar(`()=>(${process.env.AVALIAR})`) });
    const shot = await cdp('Page.captureScreenshot', { format: 'png' });
    const nome = `${OUT}/anim-${w}x${h}-${fr.replace(/[^a-z0-9]/gi, '')}-${ms}.png`;
    writeFileSync(nome, Buffer.from(shot.result.data, 'base64'));
    resultados.push({ foto: nome, rolado: y });
  }
}
console.log(JSON.stringify(resultados, null, 1));
ws.close(); chrome.kill();
process.exit(0);

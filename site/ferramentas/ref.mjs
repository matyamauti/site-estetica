// ESTUDO DE REFERÊNCIA — filma um site em movimento. Foi assim que a
// era-residence.com foi estudada: ler o código não basta, é preciso VER
// a coreografia quadro a quadro. Serve também para filmar o nosso site.
// uso (de site/): node ferramentas/ref.mjs <url> <modo> [args]
//   W=375 H=812  muda o tamanho da tela;  PAUSA=1400  espera antes da foto
//   estrutura            lista as seções, alturas e atributos de animação
//   filme 0,300,800,...  fotos da abertura nesses milissegundos
//   secoes               rola até cada seção e fotografa 3 momentos
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const [URL, MODO, ARG] = process.argv.slice(2);
const W = +(process.env.W || 1440), H = +(process.env.H || 900);
const OUT = process.env.OUT || 'ferramentas/saida'; mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const PORTA = 9334;
const perfil = `${process.env.TEMP}/claude/ref-${Date.now()}`; mkdirSync(perfil, { recursive: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${PORTA}`, `--user-data-dir=${perfil}`, '--window-size=1920,1200', 'about:blank'], { stdio: 'ignore' });
let alvo; for (let i = 0; i < 50 && !alvo; i++) { await espera(200); try { alvo = (await (await fetch(`http://127.0.0.1:${PORTA}/json/list`)).json()).find((t) => t.type === 'page'); } catch {} }
const ws = new WebSocket(alvo.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0; const pend = new Map(); const ev = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else if (d.method) ev.push(d); });
const cdp = (method, params = {}) => new Promise((r) => { const id = ++seq; pend.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const foto = async (nome) => { const s = await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 70 }); writeFileSync(`${OUT}/${nome}.jpg`, Buffer.from(s.result.data, 'base64')); return nome; };

await cdp('Page.enable'); await cdp('Runtime.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 600 });
const t0 = Date.now();
await cdp('Page.navigate', { url: URL });

if (MODO === 'filme') {
  const tempos = ARG.split(',').map(Number); const saida = [];
  for (const t of tempos) { const falta = t - (Date.now() - t0); if (falta > 0) await espera(falta); saida.push(await foto(`filme-${String(t).padStart(5, '0')}`)); }
  console.log(saida.join('\n'));
} else {
  for (let i = 0; i < 80 && !ev.some((e) => e.method === 'Page.loadEventFired'); i++) await espera(100);
  await espera(7000); // deixa preloader e intro terminarem
  // aceita cookies se houver, para o banner não cobrir as fotos
  await js(`(()=>{const b=[...document.querySelectorAll('button,a')].find(e=>/accept|aceitar|agree|ok/i.test(e.textContent));b&&b.click();})()`);
  if (MODO === 'estrutura') {
    const r = await js(`(()=>{
      const out=[]; const H=innerHeight;
      document.querySelectorAll('main > *, body > .page-wrapper > *, [data-barba=container] > *, section').forEach(s=>{
        const r=s.getBoundingClientRect(); if(r.height<120) return;
        const attrs={}; s.querySelectorAll('*').forEach(e=>[...e.attributes].forEach(a=>{ if(/^data-(scroll|parallax|snap|anim|reveal|part|bg|pin|slider|carousel|horizontal|lottie|video|card|index|fit)/.test(a.name)) { const k=a.name+(a.value&&a.value.length<14?'='+a.value:''); attrs[k]=(attrs[k]||0)+1; } }));
        [...s.attributes].forEach(a=>{ if(a.name.startsWith('data-')) attrs['(raiz)'+a.name+'='+a.value]=1; });
        out.push({tag:s.tagName.toLowerCase(), cls:String(s.className).slice(0,50), topo:Math.round(r.top+scrollY), altura:Math.round(r.height), alturaEmTelas:+(r.height/H).toFixed(2), texto:s.innerText.replace(/\\s+/g,' ').slice(0,90), attrs});
      });
      return {alturaTotal:document.documentElement.scrollHeight, telas:+(document.documentElement.scrollHeight/H).toFixed(1), secoes:out};
    })()`);
    console.log(JSON.stringify(r, null, 1));
  } else if (MODO === 'rolar') {
    // ARG = lista de posições em "telas" (0.5 = meia tela). Rola em passos, espera, fotografa.
    const saida = [];
    for (const tel of ARG.split(',').map(Number)) {
      const alvoY = Math.round(tel * H);
      await js(`(async()=>{const e=ms=>new Promise(r=>setTimeout(r,ms));let y=scrollY;while(Math.abs(y-${alvoY})>4){y+=Math.sign(${alvoY}-y)*Math.min(120,Math.abs(${alvoY}-y));scrollTo(0,y);await e(30);}})()`);
      await espera(+(process.env.PAUSA || 1100));
      saida.push(await foto('rolar-' + String(tel.toFixed(2)).replace('.', '_')));
    }
    console.log(saida.join(' '));
  } else if (MODO === 'secoes') {
    const tops = await js(`[...new Set([...document.querySelectorAll('section, [data-snap], main > *')].map(s=>Math.round(s.getBoundingClientRect().top+scrollY)).filter(t=>t>40))].sort((a,b)=>a-b)`);
    const saida = [];
    let n = 0;
    for (const t of tops) {
      // rola em passos (como uma pessoa) até a seção
      await js(`(async()=>{const e=ms=>new Promise(r=>setTimeout(r,ms));let y=scrollY;const alvo=${t}-${Math.round(H * 0.15)};while(Math.abs(y-alvo)>5){y+=Math.sign(alvo-y)*Math.min(180,Math.abs(alvo-y));window.lenis?window.lenis.scrollTo(y,{immediate:true}):scrollTo(0,y);await e(40);}})()`);
      n++;
      for (const ms of [120, 600, 1600]) { await espera(ms - (ms === 120 ? 0 : ms === 600 ? 120 : 600)); saida.push(await foto(`sec${String(n).padStart(2, '0')}-${ms}`)); }
    }
    console.log(saida.length + ' fotos, ' + n + ' seções');
  }
}
ws.close(); chrome.kill(); process.exit(0);

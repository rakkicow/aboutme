// self destruct

const COUNTDOWN_SECONDS = 10;

const reduceMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** siren */
function startSiren(): () => void {
  let ctx: AudioContext;
  try {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return () => {};
  }

  const gain = ctx.createGain();
  gain.gain.value = 0.045; // quiet
  gain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.connect(gain);

  const now = ctx.currentTime;
  for (let t = 0; t < COUNTDOWN_SECONDS; t += 1) {
    osc.frequency.setValueAtTime(480, now + t);
    osc.frequency.linearRampToValueAtTime(720, now + t + 0.5);
    osc.frequency.linearRampToValueAtTime(480, now + t + 1);
  }
  osc.start(now);

  return () => {
    try {
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => ctx.close().catch(() => {}), 500);
    } catch {
      /* torn down */
    }
  };
}

/** dead site */
function renderDeadSite() {
  const page = document.createElement('div');
  page.id = 'rg-404';
  page.setAttribute('role', 'alertdialog');
  page.setAttribute('aria-label', 'Site deleted — easter egg');
  page.innerHTML = `
    <style>
      #rg-404 {
        position: fixed; inset: 0; z-index: 2147483647;
        background: #f5f5f5; color: #4a4a4a;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center; padding: 6vh 24px; overflow-y: auto;
        animation: rg404In 0.18s steps(2) both;
      }
      @keyframes rg404In { from { opacity: 0 } to { opacity: 1 } }
      #rg-404 .code {
        font-size: clamp(72px, 14vw, 132px); font-weight: 200;
        line-height: 1; letter-spacing: 0.02em; margin-bottom: 0.35em;
      }
      #rg-404 h2 { font-size: 17px; font-weight: 700; margin: 0 0 1.6em; }
      #rg-404 p { font-size: 17px; line-height: 1.6; margin: 0 0 1.2em; max-width: 62ch; }
      #rg-404 code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.92em; }
      /* sad face */
      #rg-404 .sad {
        font-size: clamp(56px, 10vw, 96px); font-weight: 200;
        line-height: 1; margin-bottom: 0.5em; color: inherit; opacity: 0.85;
      }

      /* reload */
      #rg-404 .refresh {
        margin-top: 2.4em; display: inline-flex; align-items: center; justify-content: center;
        width: 56px; height: 56px; padding: 0;
        color: #fff; background: #FF7A1E; border: 0; border-radius: 50%;
        cursor: pointer !important; box-shadow: 0 6px 18px rgba(255, 122, 30, 0.35);
        transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
      }
      #rg-404 .refresh:hover {
        background: #FF6A05; transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(255, 122, 30, 0.45);
      }
      #rg-404 .refresh:active { transform: translateY(0); }
      #rg-404 .refresh:focus-visible { outline: 3px solid #FF7A1E; outline-offset: 4px; }
      #rg-404 .refresh svg { width: 26px; height: 26px; }
      #rg-404 .refresh[disabled] { opacity: 0.6; cursor: default !important; transform: none; }
      #rg-404 .refresh[disabled] svg { animation: rgSpin 0.7s linear infinite; }
      @keyframes rgSpin { to { transform: rotate(360deg) } }

      /* cow */
      #rg-404 .says {
        margin-top: 3.2em; display: flex; align-items: center;
        justify-content: center; gap: 14px;
      }
      #rg-404 .bubble {
        position: relative; background: #e8e8e8; color: #3a3a3a;
        font-size: clamp(17px, 2.4vw, 22px); font-weight: 500;
        padding: 12px 20px; border-radius: 16px; white-space: nowrap;
      }
      /* tail */
      #rg-404 .bubble::after {
        content: ''; position: absolute; right: -9px; top: 50%;
        transform: translateY(-50%);
        border-top: 9px solid transparent; border-bottom: 9px solid transparent;
        border-left: 10px solid #e8e8e8;
      }
      #rg-404 .cow { font-size: clamp(46px, 8vw, 76px); line-height: 1; }

      /* cursor */
      #rg-404, #rg-404 * { cursor: auto !important; }
      #rg-404 .refresh { cursor: pointer !important; }
      html.rg-dead .cursor-fx { display: none !important; }
      @media (prefers-color-scheme: dark) {
        #rg-404 { background: #0d1117; color: #c9d1d9; }
        #rg-404 .bubble { background: #21262d; color: #e6edf3; }
        #rg-404 .bubble::after { border-left-color: #21262d; }
      }
    </style>
    <div class="sad" aria-hidden="true">:(</div>
    <div class="code">404</div>
    <h2>File not found</h2>
    <p>The site configured at this address does not contain the requested file.</p>
    <p>If this is your site, make sure that the filename case matches the URL as well as any file permissions.<br />
       For root URLs (like <code>http://example.com/</code>) you must provide an <code>index.html</code> file.</p>
    <button class="refresh" type="button" aria-label="Reload the site" title="Reload the site">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 3v6h-6" />
      </svg>
    </button>
    <div class="says">
      <div class="bubble">you did this</div>
      <div class="cow" aria-hidden="true">&#128004;</div>
    </div>
  `;

  const btn = page.querySelector<HTMLButtonElement>('.refresh')!;

  btn.addEventListener('click', () => {
    // reload
    btn.disabled = true;
    btn.setAttribute('aria-label', 'Reloading…');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.location.replace(window.location.pathname === '/terminal' ? '/terminal' : '/');
  });

  document.documentElement.style.overflow = 'hidden';
  document.documentElement.classList.add('rg-dead');
  document.body.appendChild(page);
  btn.focus();
}

/** run */
export function selfDestruct(onTick: (secondsLeft: number) => void) {
  const soft = reduceMotion();
  const stopSiren = startSiren();

  const stage = document.createElement('div');
  stage.id = 'rg-alarm';
  stage.setAttribute('role', 'alert');
  stage.setAttribute('aria-label', 'Self destruct in progress');
  stage.innerHTML = `
    <style>
      #rg-alarm {
        position: fixed; inset: 0; z-index: 2147483646; pointer-events: none;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
      }
      /* wash */
      #rg-alarm .wash {
        position: absolute; inset: 0;
        background: radial-gradient(circle at 50% 50%, rgba(255,0,0,0.10), rgba(255,0,0,0.45));
      }
      #rg-alarm.live .wash { animation: rgWash 1s ease-in-out infinite; }
      @keyframes rgWash { 0%, 100% { opacity: 0.35 } 50% { opacity: 1 } }

      #rg-alarm .siren {
        position: relative;
        font-size: clamp(72px, 18vw, 190px); line-height: 1;
        transform-origin: center center;
        filter: drop-shadow(0 0 34px rgba(255, 40, 40, 0.85));
      }
      /* wobble */
      #rg-alarm.live .siren { animation: rgShout 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite; }
      @keyframes rgShout {
        0%   { transform: scale(1); }
        8%   { transform: scale(1.8); }
        23%  { transform: scale(1.8) rotate(-4deg); }
        38%  { transform: scale(1.8) rotate(4deg); }
        53%  { transform: scale(1.8) rotate(-3deg); }
        68%  { transform: scale(1.8) rotate(3deg); }
        83%  { transform: scale(1.8) rotate(-2deg); }
        92%  { transform: scale(1.1); }
        100% { transform: scale(1); }
      }

      /* cursor */
      html.rg-alarming, html.rg-alarming body, html.rg-alarming body * { cursor: auto !important; }
      html.rg-alarming .cursor-fx { display: none !important; }

      #rg-alarm .count {
        position: relative; margin-top: 0.7em;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: clamp(30px, 7vw, 62px); font-weight: 700; letter-spacing: 0.06em;
        color: #fff; text-shadow: 0 0 22px rgba(255, 30, 30, 0.95);
      }
    </style>
    <div class="wash"></div>
    <div class="siren" aria-hidden="true">&#128680;</div>
    <div class="count">10</div>
  `;
  if (!soft) stage.classList.add('live');
  document.documentElement.classList.add('rg-alarming');
  document.body.appendChild(stage);

  const countEl = stage.querySelector<HTMLElement>('.count')!;

  let left = COUNTDOWN_SECONDS;
  onTick(left);

  const timer = setInterval(() => {
    left -= 1;
    if (left > 0) {
      countEl.textContent = String(left);
      onTick(left);
      return;
    }
    clearInterval(timer);
    stopSiren();
    stage.remove();
    document.documentElement.classList.remove('rg-alarming');
    renderDeadSite();
  }, 1000);
}

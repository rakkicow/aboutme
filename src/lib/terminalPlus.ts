export function initGame(
  termForm: HTMLFormElement,
  termInput: HTMLInputElement,
  interactiveOutput: HTMLElement,
  termBody: HTMLElement,
  termCaret: HTMLElement,
  onExit: () => void
) {
  let inGame = false;
  let destructing = false;

  // commands
  const COMMANDS = ['help', 'whatsong', 'weather', 'walloftext', 'hack', 'clear', 'exit'];

  // weather args
  const WEATHER_ARGS = [
    'help', 'sunny', 'clear', 'cloudy', 'rainy', 'drizzly', 'snowy', 'stormy', 'windy', 'foggy',
  ];

  // history
  const history: string[] = [];
  let histPos = 0;
  let draft = ''; // draft

  // tab menu
  let tabHits: string[] = [];
  let tabIdx = 0;
  const resetTabCycle = () => {
    tabHits = [];
    tabIdx = 0;
  };

  // escape
  const esc = (s: unknown) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  // safe url
  const safeUrl = (u: unknown) => {
    const raw = String(u ?? '').trim();
    if (!raw) return 'https://last.fm';
    try {
      const parsed = new URL(raw, window.location.origin);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return esc(parsed.href);
    } catch {
      /* malformed */
    }
    return 'https://last.fm';
  };

  const updateWhatsongView = (outContainer: HTMLElement) => {
    const track = (window as any)._currentTrack;
    if (!track || !track.name) {
      outContainer.innerHTML = `<span style="color:#FF5F57">Error: No track currently scrobbling. Try again later.</span>`;
      return;
    }
    
    // dedupe
    const trackKey = track.name + track.artUrl;
    if (outContainer.dataset.lastTrack === trackKey) return;
    if (outContainer.dataset.pendingTrack === trackKey) return;
    outContainer.dataset.pendingTrack = trackKey;

    outContainer.innerHTML = `<span style="color:#DC9BB5">Fetching audio data...</span>`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      delete outContainer.dataset.pendingTrack;
      outContainer.dataset.lastTrack = trackKey;
      // font size
      const rootSize = parseFloat(getComputedStyle(outContainer).fontSize) || 11;
      const charH = rootSize * 0.5; // char height
      const charW = rootSize * 0.425; // char width
      
      let w = 28;
      let h = 24;
      
      const termBody = outContainer.closest('.term-body') as HTMLElement;
      if (termBody) {
         const availH = termBody.clientHeight - (rootSize * 15); // buffer
         const availW = termBody.clientWidth - (rootSize * 4); // buffer
         
         if (availH > 50 && availW > 50) {
           const maxHChars = Math.floor(availH / charH);
           const maxWChars = Math.floor(availW / charW);
           
           h = Math.max(16, Math.min(80, maxHChars));
           w = Math.max(18, Math.min(94, Math.floor(h * (28/24))));
           
           if (w > maxWChars) {
              w = maxWChars;
              h = Math.floor(w * (24/28));
           }
         }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      
      // density
      const chars = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];
      
      let asciiHtml = '<div style="font-size:0.5em; line-height:1em; letter-spacing:0.25em; font-weight:900; font-family:monospace; margin-bottom:1.2em; margin-top:0.4em;">';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const r = data[i], g = data[i+1], b = data[i+2];
          // luminance
          const bright = (0.299 * r + 0.587 * g + 0.114 * b);
          const charIdx = Math.floor((bright / 255) * (chars.length - 1));
          const char = chars[charIdx];
          
          // boost
          asciiHtml += `<span style="color:rgb(${Math.min(255, r+20)},${Math.min(255, g+20)},${Math.min(255, b+20)})">${char === ' ' ? '&nbsp;' : char}</span>`;
        }
        asciiHtml += '<br/>';
      }
      asciiHtml += '</div>';
      
      const mainColor = track.colors?.[0] || '#7CE57C';
      const titleHtml = `
        <style>
          @keyframes lyricReveal {
            0% { opacity: 0; text-shadow: none; }
            30% { opacity: 1; text-shadow: 0 0 6px rgba(255,255,255,0.8); }
            100% { opacity: 1; }
          }
        </style>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom: 8px;">
          <div style="width:3px; height:24px; border-radius:2px; background:${mainColor};"></div>
          <div>
            <a href="${safeUrl(track.url)}" target="_blank" rel="noopener noreferrer" style="color:#FFFFFF; text-decoration:none; display:block;" class="hover:text-cow-300 transition-colors cursor-pointer">
              <div style="font-size:1.15em; font-weight:bold; letter-spacing:0.5px;">${esc(track.name)}</div>
            </a>
            <div style="color:#DC9BB5; font-size:0.95em; opacity:0.8;">${esc(track.artist)}</div>
          </div>
          <div style="flex:1"></div>
          <div aria-hidden="true" style="display:inline-flex; align-items:center; gap:2px; height:1.2em; padding-right:8px; flex-shrink:0;">
            ${[
              { name: 'np-eq1', duration: '1.7s' },
              { name: 'np-eq2', duration: '2.1s' },
              { name: 'np-eq3', duration: '1.45s' },
              { name: 'np-eq4', duration: '2.3s' },
              { name: 'np-eq5', duration: '1.5s' }
            ].map((anim, i) => {
              const col = track.colors?.length ? track.colors[i % track.colors.length] : '#39FF14';
              return `<span style="display:block; width:2px; border-radius:2px; background:${col}; box-shadow:0 0 6px ${col}; animation: ${anim.name} ${anim.duration} ease-in-out infinite;"></span>`;
            }).join('')}
          </div>
        </div>
        <div class="whatsong-lyrics" style="display:none; color:#FFFFFF; font-size:1.1em; font-style:italic; border-left:1px dashed ${mainColor}; margin-left:1px; padding-left:13px; margin-bottom:8px; white-space:pre-wrap; line-height:1.4;"></div>
      `;
      
      outContainer.innerHTML = asciiHtml + titleHtml;
      
      const lyricsDiv = outContainer.querySelector('.whatsong-lyrics') as HTMLElement;
      if (lyricsDiv) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(track.artist + ' ' + track.name)}`, { signal: controller.signal })
          .then(res => { clearTimeout(timeoutId); if (!res.ok) throw new Error(); return res.json(); })
          .then(data => {
            const firstResult = Array.isArray(data) ? data.find(d => d.plainLyrics) : data;
            if (firstResult && firstResult.plainLyrics) {
              const lines = firstResult.plainLyrics.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0 && !l.startsWith('['));
              if (lines.length > 0) {
                lyricsDiv.style.display = 'block';
                
                if ((outContainer as any)._lyricsTimer) clearTimeout((outContainer as any)._lyricsTimer);
                
                let currentIdx = 0;
                const showNext = () => {
                  if (!document.body.contains(outContainer)) return; // cleanup
                  
                  let count = 1;
                  const isNarrow = window.innerWidth <= 450;
                  
                  if (!isNarrow && currentIdx + 1 < lines.length) {
                     const l1 = lines[currentIdx];
                     const l2 = lines[currentIdx + 1];
                     // fit check
                     if (l1.length + l2.length < 80 && l1.length < 45 && l2.length < 45) {
                        count = 2;
                     }
                  }
                  
                  let snippet = lines.slice(currentIdx, currentIdx + count).join('\n');
                  
                  // timing
                  let duration = Math.max(3000, snippet.split(/\s+/).length * 400 + 1800);
                  
                  const fullSnippet = '"' + snippet + '"';
                  const animDuration = (duration * 0.9) / 1000;
                  const html = fullSnippet.split('').map((char, i) => {
                     const delay = (i / fullSnippet.length) * animDuration;
                     let c = char;
                     if (c === '<') c = '&lt;';
                     else if (c === '>') c = '&gt;';
                     else if (c === '&') c = '&amp;';
                     else if (c === '\n') return '<br>';
                     return `<span style="opacity:0; animation: lyricReveal 0.4s forwards ${delay.toFixed(3)}s">${c}</span>`;
                  }).join('');
                  
                  lyricsDiv.innerHTML = html;
                  
                  currentIdx += count;
                  if (currentIdx >= lines.length) currentIdx = 0; // loop
                  
                  (outContainer as any)._lyricsTimer = setTimeout(showNext, duration);
                };
                
                showNext();
                setTimeout(() => { termBody.scrollTop = termBody.scrollHeight; }, 10);
              }
            }
          })
          .catch(err => {
             // ignore
          });
      }
      
      setTimeout(() => { termBody.scrollTop = termBody.scrollHeight; }, 10);
    };
    img.onerror = () => {
      delete outContainer.dataset.pendingTrack;
      outContainer.innerHTML = `<span style="color:#FF5F57">Error: Cannot decode album art stream.</span>`;
    };
    if (track.artUrl) {
       img.src = track.artUrl;
    } else {
       delete outContainer.dataset.pendingTrack;
       outContainer.innerHTML = `<span style="color:#FF5F57">Error: No album art available.</span>`;
    }
  };

  window.addEventListener('trackupdate', () => {
    document.querySelectorAll('.whatsong-view').forEach(el => {
      updateWhatsongView(el as HTMLElement);
    });
  });

  const autoTyper = document.getElementById('auto-typer');
  termInput.addEventListener('input', () => {
    // mirror
    if (autoTyper) autoTyper.textContent = termInput.value;
  });

  // sync typer
  const setInput = (value: string) => {
    termInput.value = value;
    if (autoTyper) autoTyper.textContent = value;
    // caret end
    requestAnimationFrame(() => {
      termInput.setSelectionRange(value.length, value.length);
    });
  };

  termInput.addEventListener('keydown', (e) => {
    if (destructing) {
      e.preventDefault();
      return;
    }

    // history
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!history.length) return;
      e.preventDefault();

      if (e.key === 'ArrowUp') {
        if (histPos === history.length) draft = termInput.value; // stash
        histPos = Math.max(0, histPos - 1);
        setInput(history[histPos]);
      } else {
        histPos = Math.min(history.length, histPos + 1);
        setInput(histPos === history.length ? draft : history[histPos]);
      }
      return;
    }

    // tab
    if (e.key === 'Tab') {
      e.preventDefault();

      // cycle
      if (tabHits.length > 1 && termInput.value === tabHits[tabIdx]) {
        tabIdx = (tabIdx + 1) % tabHits.length;
        setInput(tabHits[tabIdx]);
        return;
      }

      const raw = termInput.value;
      const typed = raw.trim().toLowerCase();
      if (!typed) return;

      // weather arg
      const wx = /^weather\s+(.*)$/.exec(raw.toLowerCase());
      let hits: string[];
      if (wx || /^weather$/.test(typed)) {
        const partial = wx ? wx[1].trim() : '';
        hits = WEATHER_ARGS.filter((a) => a.startsWith(partial)).map((a) => `weather ${a}`);
      } else {
        hits = COMMANDS.filter((c) => c.startsWith(typed));
      }
      if (!hits.length) return;

      if (hits.length === 1) {
        resetTabCycle();
        setInput(hits[0]);
        return;
      }

      // list matches
      const listing = document.createElement('div');
      listing.className = 'mb-1 opacity-70';
      listing.style.color = '#7CE57C';
      // varying part
      listing.textContent = hits.map((h) => h.replace(/^weather /, '')).join('   ');
      interactiveOutput.appendChild(listing);
      termBody.scrollTop = termBody.scrollHeight;

      tabHits = hits;
      tabIdx = 0;
      setInput(hits[0]);
      return;
    }

    // reset
    resetTabCycle();
  });

  termForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (destructing) return; // dead

    const rawCmd = termInput.value;
    // normalize
    const cmd = rawCmd.trim().toLowerCase().replace(/\s+/g, ' ');
    termInput.value = '';
    if (autoTyper) autoTyper.textContent = '';

    // history
    if (cmd && history[history.length - 1] !== rawCmd.trim()) {
      history.push(rawCmd.trim());
    }
    histPos = history.length;
    draft = '';



    // echo
    const echo = document.createElement('div');
    echo.className = 'text-cow-300 mt-1';
    echo.innerHTML = `~/ <span class="text-cow-400">$</span> <span style="color:#39FF14;">${rawCmd}</span>`;
    interactiveOutput.appendChild(echo);

    // process
    const out = document.createElement('div');
    out.className = 'mb-1';
    out.style.color = '#7CE57C';

    // nuke
    const isNuke = /^sudo rm -(rf|fr) \/\*?$/.test(cmd);

    if (isNuke) {
      destructing = true;
      out.innerHTML =
        `<span style="color:#FF5F57; font-weight:bold;">rm: it is dangerous to operate recursively on '/'</span><br/>` +
        `<span style="color:#FF5F57;">rm: --no-preserve-root not specified... but you seem confident.</span><br/><br/>` +
        `<span style="color:#FEBC2E;">SELF DESTRUCT INITIATED.</span><br/>` +
        `<span style="color:#7CE57C;">Wiping / in <span class="rg-count" style="color:#FF5F57; font-weight:bold;">10</span>s...</span>`;

      const counter = () => out.querySelector<HTMLElement>('.rg-count');
      import('./selfDestruct')
        .then(({ selfDestruct }) => {
          selfDestruct((secondsLeft) => {
            const el = counter();
            if (el) el.textContent = String(secondsLeft);
            termBody.scrollTop = termBody.scrollHeight;
          });
        })
        .catch(() => {
          destructing = false;
          out.innerHTML += `<br/><span style="color:#FF5F57">...the payload failed to load. Lucky.</span>`;
        });
    } else if (inGame) {
      if (cmd === 'cow') {
        out.innerHTML = `<span style="color:#39FF14">ACCESS GRANTED.</span><br/>You found the secret! A special cow has been deployed.`;
        inGame = false;
        
        // moo sound
        const audio = new Audio('/assets/moo.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {}); // autoplay
        
        // invert overlay
        const invertOverlay = document.createElement('div');
        invertOverlay.style.cssText = [
          'position:fixed',
          'inset:0',
          'z-index:9999',
          'pointer-events:none',
          'backdrop-filter:invert(1) hue-rotate(180deg)',
          '-webkit-backdrop-filter:invert(1) hue-rotate(180deg)',
          'opacity:0',
          'transition:opacity 0.5s ease'
        ].join(';');
        document.body.appendChild(invertOverlay);
        requestAnimationFrame(() => { invertOverlay.style.opacity = '1'; });
        setTimeout(() => {
          invertOverlay.style.opacity = '0';
          setTimeout(() => invertOverlay.remove(), 500);
        }, 1500);
        
        // ascii cow
        const bigCow = document.createElement('pre');
        bigCow.className = 'mt-2 mb-2 leading-[1.1] font-bold';
        bigCow.style.color = '#FEBC2E';
        bigCow.textContent = `          ---------------------
          < YOU FOUND ME! MOO! >
          --------------------
                   //
  \\|/          (__)    
       \`\\------(oo)
         ||    (__)
         ||w--||     \\|/
     \\|/`;
        out.appendChild(bigCow);

      } else if (cmd === 'moo') {
        out.innerHTML = `<span style="color:#FEBC2E">Close, but I'm looking for the animal, not the sound!</span>`;
      } else if (cmd === 'clear') {
        interactiveOutput.innerHTML = '';
        out.innerHTML = '';
        inGame = false;
      } else if (cmd === 'exit' || cmd === 'neofetch') {
        inGame = false;
        out.textContent = '';
        onExit();
      } else {
        out.innerHTML = `<span style="color:#FF5F57">ACCESS DENIED. Incorrect password.</span>`;
      }
    } else if (cmd === 'rm -rf /' || cmd === 'rm -fr /') {
      out.innerHTML = `<span style="color:#FF5F57">rm: cannot remove '/': Permission denied</span><br/>Try again with <span style="color:#DC9BB5">sudo</span>. Or don't.`;
    } else if (cmd === 'moo') {
      out.innerHTML = `moo`;
    } else if (cmd === 'help') {
      out.innerHTML = `Commands:<br/>- <span style="color:#DC9BB5">whatsong</span>: view current track & album art<br/>- <span style="color:#DC9BB5">weather</span>: see the live sky of your city<br/>- <span style="color:#DC9BB5">walloftext</span>: visit my public text wall<br/>- <span style="color:#DC9BB5">hack</span>: launch mainframe override<br/>- <span style="color:#DC9BB5">clear</span>: clear terminal<br/>- <span style="color:#DC9BB5">exit</span>: return to auto mode<br/><br/><span style="opacity:0.6">↑/↓ for history · Tab to complete</span>`;
    } else if (cmd === 'walloftext') {
      out.innerHTML = `<span style="color:#DC9BB5">Redirecting via secure tunnel...</span>`;
      setTimeout(() => {
        window.location.href = '/walloftext';
      }, 400);
    } else if (cmd === 'clear') {
      interactiveOutput.innerHTML = '';
      out.innerHTML = '';
    } else if (cmd === 'whatsong') {
      // clear
      interactiveOutput.innerHTML = '';
      out.className = 'mb-1 whatsong-view';
      updateWhatsongView(out);


    } else if (cmd === 'weather' || cmd.startsWith('weather ')) {
      // full window
      interactiveOutput.innerHTML = '';
      out.className = 'mb-1 weather-view';
      out.innerHTML = `<span style="color:#DC9BB5">Reading the sky…</span>`;
      // city arg
      const city = rawCmd.trim().replace(/\s+/g, ' ').slice('weather '.length).trim();
      import('./terminalWeather')
        .then(({ renderWeather }) => renderWeather(out, termBody, city))
        .catch(() => {
          out.innerHTML = `<span style="color:#FF5F57">weather: forecast module failed to load.</span>`;
        });

    } else if (cmd === 'hack') {
      out.innerHTML = `<span style="color:#FF5F57">WARNING: UNAUTHORIZED ACCESS DETECTED.</span><br/>Initiating override sequence...<br/><br/>To bypass the firewall, type the password. Hint: it says "moo".`;
      inGame = true;
    } else if (cmd === 'exit' || cmd === 'neofetch') {
      inGame = false;
      out.textContent = '';
      onExit();
    } else if (cmd !== '') {
      out.textContent = `zsh: command not found: ${cmd}`;
    }

    if (out.innerHTML !== '') {
      interactiveOutput.appendChild(out);
    }

    // trim
    while (interactiveOutput.children.length > 12) {
      interactiveOutput.removeChild(interactiveOutput.firstChild!);
    }

    // scroll
    setTimeout(() => {
      termBody.scrollTop = termBody.scrollHeight;
    }, 10);
  });

  // hook
  (window as any)._runTerminalCommand = (cmdString: string) => {
    termInput.value = cmdString;
    termForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };
}

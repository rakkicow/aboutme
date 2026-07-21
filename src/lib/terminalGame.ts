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

  // Everything tab-completable. `sudo rm -rf /` is deliberately absent — it
  // should only ever be found by someone who already had the idea.
  const COMMANDS = ['help', 'whatsong', 'walloftext', 'hack', 'clear', 'exit'];

  // Shell history. Newest last; `histPos === history.length` means "not
  // browsing", i.e. the live input line.
  const history: string[] = [];
  let histPos = 0;
  let draft = ''; // what was typed before arrowing up, restored on the way back down

  // Last.fm track metadata is third-party text — escape before it touches innerHTML.
  const esc = (s: unknown) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  // Only let through URLs we'd actually navigate to — blocks javascript:/data: hrefs.
  const safeUrl = (u: unknown) => {
    const raw = String(u ?? '').trim();
    if (!raw) return 'https://last.fm';
    try {
      const parsed = new URL(raw, window.location.origin);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return esc(parsed.href);
    } catch {
      /* malformed — fall through */
    }
    return 'https://last.fm';
  };

  const updateWhatsongView = (outContainer: HTMLElement) => {
    const track = (window as any)._currentTrack;
    if (!track || !track.name) {
      outContainer.innerHTML = `<span style="color:#FF5F57">Error: No track currently scrobbling. Try again later.</span>`;
      return;
    }
    
    // Prevent redundant re-renders of the exact same song. `lastTrack` is only
    // committed once the art actually renders, so a failed load can still retry;
    // `pendingTrack` stops duplicate in-flight loads in the meantime.
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
      // Read the dynamically scaling font size of the terminal!
      const rootSize = parseFloat(getComputedStyle(outContainer).fontSize) || 11;
      const charH = rootSize * 0.5; // Bumped to 0.5em font size
      const charW = rootSize * 0.425; // 0.5em * 0.85 (0.6 base width + 0.25 letter-spacing) = 0.425
      
      let w = 28;
      let h = 24;
      
      const termBody = outContainer.closest('.term-body') as HTMLElement;
      if (termBody) {
         const availH = termBody.clientHeight - (rootSize * 15); // buffer for title, lyrics, and input
         const availW = termBody.clientWidth - (rootSize * 4); // buffer for padding
         
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
      
      // Density chars from dark to light
      const chars = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];
      
      let asciiHtml = '<div style="font-size:0.5em; line-height:1em; letter-spacing:0.25em; font-weight:900; font-family:monospace; margin-bottom:1.2em; margin-top:0.4em;">';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const r = data[i], g = data[i+1], b = data[i+2];
          // Calculate luminance
          const bright = (0.299 * r + 0.587 * g + 0.114 * b);
          const charIdx = Math.floor((bright / 255) * (chars.length - 1));
          const char = chars[charIdx];
          
          // Boost colors slightly so it glows on the dark terminal
          asciiHtml += `<span style="color:rgb(${Math.min(255, r+20)},${Math.min(255, g+20)},${Math.min(255, b+20)})">${char === ' ' ? '&nbsp;' : char}</span>`;
        }
        asciiHtml += '<br/>';
      }
      asciiHtml += '</div>';
      
      const mainColor = track.colors?.[0] || '#7CE57C';
      const titleHtml = `
        <style>
          @keyframes lyricReveal {
            0% { opacity: 0.25; text-shadow: none; }
            100% { opacity: 1; text-shadow: 0 0 6px rgba(255,255,255,0.6); }
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
        <div class="whatsong-lyrics" style="display:none; color:#FFFFFF; font-size:0.95em; font-style:italic; border-left:1px dashed ${mainColor}; margin-left:1px; padding-left:13px; margin-bottom:8px; white-space:pre-wrap; line-height:1.4;"></div>
      `;
      
      outContainer.innerHTML = asciiHtml + titleHtml;
      
      const lyricsDiv = outContainer.querySelector('.whatsong-lyrics') as HTMLElement;
      if (lyricsDiv) {
        fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(track.artist)}&track_name=${encodeURIComponent(track.name)}`)
          .then(res => { if (!res.ok) throw new Error(); return res.json(); })
          .then(data => {
            if (data && data.plainLyrics) {
              const lines = data.plainLyrics.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0 && !l.startsWith('['));
              if (lines.length > 0) {
                lyricsDiv.style.display = 'block';
                
                if ((outContainer as any)._lyricsTimer) clearTimeout((outContainer as any)._lyricsTimer);
                
                let currentIdx = 0;
                const showNext = () => {
                  if (!document.body.contains(outContainer)) return; // Stop memory leak if cleared!
                  
                  let count = 1;
                  const isNarrow = window.innerWidth <= 450;
                  
                  if (!isNarrow && currentIdx + 1 < lines.length) {
                     const l1 = lines[currentIdx];
                     const l2 = lines[currentIdx + 1];
                     // Heuristically decide if 2 lines fit perfectly in the terminal UI
                     if (l1.length + l2.length < 80 && l1.length < 45 && l2.length < 45) {
                        count = 2;
                     }
                  }
                  
                  let snippet = lines.slice(currentIdx, currentIdx + count).join('\n');
                  
                  // Calculate global reading estimate (average ~200 WPM -> ~3.3 words/sec -> 300ms/word + 1.2s buffer)
                  let duration = Math.max(2500, snippet.split(/\s+/).length * 300 + 1200);
                  
                  // On thin phones, aggressively truncate overflowing words and proportionally speed up the timer
                  if (isNarrow && count === 1) {
                     const maxChars = 36;
                     if (snippet.length > maxChars) {
                        const words = snippet.split(' ');
                        let kept = '';
                        let keptCount = 0;
                        for (const w of words) {
                           if (kept.length + w.length + 1 > maxChars) break;
                           kept += (kept.length > 0 ? ' ' : '') + w;
                           keptCount++;
                        }
                        if (keptCount === 0 && words.length > 0) {
                           kept = words[0].substring(0, maxChars);
                           keptCount = 1;
                        }
                        
                        const ratio = keptCount / words.length;
                        duration = Math.max(1000, Math.round(duration * ratio));
                        snippet = kept + '...';
                     }
                  }
                  
                  const fullSnippet = '"' + snippet + '"';
                  const animDuration = (duration * 0.9) / 1000;
                  const html = fullSnippet.split('').map((char, i) => {
                     const delay = (i / fullSnippet.length) * animDuration;
                     let c = char;
                     if (c === '<') c = '&lt;';
                     else if (c === '>') c = '&gt;';
                     else if (c === '&') c = '&amp;';
                     else if (c === '\n') return '<br>';
                     return `<span style="opacity:0.25; animation: lyricReveal 0.8s forwards ${delay.toFixed(3)}s">${c}</span>`;
                  }).join('');
                  
                  lyricsDiv.innerHTML = html;
                  
                  currentIdx += count;
                  if (currentIdx >= lines.length) currentIdx = 0; // Loop back to top
                  
                  (outContainer as any)._lyricsTimer = setTimeout(showNext, duration);
                };
                
                showNext();
                setTimeout(() => { termBody.scrollTop = termBody.scrollHeight; }, 10);
              }
            }
          })
          .catch(() => {});
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
    // Mirror the text into the typer so the caret naturally gets pushed!
    if (autoTyper) autoTyper.textContent = termInput.value;
  });

  // Keep the mirrored typer in sync when we set the value programmatically
  // (history recall, tab completion) — plain assignment fires no input event.
  const setInput = (value: string) => {
    termInput.value = value;
    if (autoTyper) autoTyper.textContent = value;
    // Park the caret at the end, after the browser has applied the value.
    requestAnimationFrame(() => {
      termInput.setSelectionRange(value.length, value.length);
    });
  };

  termInput.addEventListener('keydown', (e) => {
    if (destructing) {
      e.preventDefault();
      return;
    }

    // ── History: ArrowUp walks back, ArrowDown walks forward to the draft ──
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!history.length) return;
      e.preventDefault();

      if (e.key === 'ArrowUp') {
        if (histPos === history.length) draft = termInput.value; // stash the live line
        histPos = Math.max(0, histPos - 1);
        setInput(history[histPos]);
      } else {
        histPos = Math.min(history.length, histPos + 1);
        setInput(histPos === history.length ? draft : history[histPos]);
      }
      return;
    }

    // ── Tab completion ──
    if (e.key === 'Tab') {
      e.preventDefault();
      const typed = termInput.value.trim().toLowerCase();
      if (!typed) return;

      const hits = COMMANDS.filter((c) => c.startsWith(typed));
      if (hits.length === 1) {
        setInput(hits[0]);
      } else if (hits.length > 1) {
        // Fill in as far as the candidates agree, then list them like a shell.
        let prefix = hits[0];
        for (const h of hits) {
          while (!h.startsWith(prefix)) prefix = prefix.slice(0, -1);
        }
        if (prefix.length > typed.length) setInput(prefix);

        const listing = document.createElement('div');
        listing.className = 'mb-1 opacity-70';
        listing.style.color = '#7CE57C';
        listing.textContent = hits.join('   ');
        interactiveOutput.appendChild(listing);
        termBody.scrollTop = termBody.scrollHeight;
      }
    }
  });

  termForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (destructing) return; // input is dead once the countdown starts

    const rawCmd = termInput.value;
    // Collapse runs of whitespace so `sudo   rm  -rf  /` still matches.
    const cmd = rawCmd.trim().toLowerCase().replace(/\s+/g, ' ');
    termInput.value = '';
    if (autoTyper) autoTyper.textContent = '';

    // Record history, skipping blanks and immediate repeats.
    if (cmd && history[history.length - 1] !== rawCmd.trim()) {
      history.push(rawCmd.trim());
    }
    histPos = history.length;
    draft = '';



    // Echo command
    const echo = document.createElement('div');
    echo.className = 'text-cow-300 mt-1';
    echo.innerHTML = `~/ <span class="text-cow-400">$</span> <span style="color:#39FF14;">${rawCmd}</span>`;
    interactiveOutput.appendChild(echo);

    // Process command
    const out = document.createElement('div');
    out.className = 'mb-1';
    out.style.color = '#7CE57C';

    // Matches `sudo rm -rf /`, `sudo rm -fr /`, and the `/*` variant.
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
    } else if (cmd === 'rm -rf /' || cmd === 'rm -fr /') {
      out.innerHTML = `<span style="color:#FF5F57">rm: cannot remove '/': Permission denied</span><br/>Try again with <span style="color:#DC9BB5">sudo</span>. Or don't.`;
    } else if (cmd === 'help') {
      out.innerHTML = `Commands:<br/>- <span style="color:#DC9BB5">whatsong</span>: view current track & album art<br/>- <span style="color:#DC9BB5">walloftext</span>: visit my public text wall<br/>- <span style="color:#DC9BB5">hack</span>: launch mainframe override<br/>- <span style="color:#DC9BB5">clear</span>: clear terminal<br/>- <span style="color:#DC9BB5">exit</span>: return to auto mode<br/><br/><span style="opacity:0.6">↑/↓ for history · Tab to complete</span>`;
    } else if (cmd === 'walloftext') {
      out.innerHTML = `<span style="color:#DC9BB5">Redirecting via secure tunnel...</span>`;
      setTimeout(() => {
        window.location.href = '/walloftext';
      }, 400);
    } else if (cmd === 'clear') {
      interactiveOutput.innerHTML = '';
      out.innerHTML = '';
    } else if (cmd === 'whatsong') {
      // Clear chat above
      interactiveOutput.innerHTML = '';
      out.className = 'mb-1 whatsong-view';
      updateWhatsongView(out);


    } else if (cmd === 'hack') {
      out.innerHTML = `<span style="color:#FF5F57">WARNING: UNAUTHORIZED ACCESS DETECTED.</span><br/>Initiating override sequence...<br/><br/>To bypass the firewall, type the password. Hint: it says "moo".`;
      inGame = true;
    } else if (inGame && cmd === 'cow') {
      out.innerHTML = `<span style="color:#39FF14">ACCESS GRANTED.</span><br/>You found the secret! A special cow has been deployed.`;
      inGame = false;
      
      // The Special Cow Deployment:
      // 1. Play the moo sound!
      const audio = new Audio('/assets/moo.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {}); // Catch in case browser blocks autoplay
      
      // 2. Visual Easter Egg — a backdrop-filter overlay rather than a filter on
      // <body>, because a filtered ancestor becomes the containing block for its
      // fixed descendants and would tear the fixed nav loose for the duration.
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
      
      // 3. ASCII Art Cow Payload
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

    } else if (inGame && cmd === 'moo') {
      out.innerHTML = `<span style="color:#FEBC2E">Close, but I'm looking for the animal, not the sound!</span>`;
    } else if (inGame) {
      out.innerHTML = `<span style="color:#FF5F57">ACCESS DENIED. Incorrect password.</span>`;
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

    // Garbage collector: Remove old commands from the top to save space
    // We keep a maximum of 12 elements (6 command prompt + output pairs)
    while (interactiveOutput.children.length > 12) {
      interactiveOutput.removeChild(interactiveOutput.firstChild!);
    }

    // Scroll to bottom
    setTimeout(() => {
      termBody.scrollTop = termBody.scrollHeight;
    }, 10);
  });

  // Expose an imperative hook for external elements to trigger commands programmatically
  (window as any)._runTerminalCommand = (cmdString: string) => {
    termInput.value = cmdString;
    termForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };
}

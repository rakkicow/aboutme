export function initGame(
  termForm: HTMLFormElement,
  termInput: HTMLInputElement,
  interactiveOutput: HTMLElement,
  termBody: HTMLElement,
  termCaret: HTMLElement,
  onExit: () => void
) {
  let inGame = false;
  const autoTyper = document.getElementById('auto-typer');
  termInput.addEventListener('input', () => {
    // Mirror the text into the typer so the caret naturally gets pushed!
    if (autoTyper) autoTyper.textContent = termInput.value;
  });

  termForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawCmd = termInput.value;
    const cmd = rawCmd.trim().toLowerCase();
    termInput.value = '';
    if (autoTyper) autoTyper.textContent = '';

    // Echo command
    const echo = document.createElement('div');
    echo.className = 'text-cow-300 mt-1';
    echo.innerHTML = `~/ <span class="text-cow-400">$</span> <span style="color:#39FF14;">${rawCmd}</span>`;
    interactiveOutput.appendChild(echo);

    // Process command
    const out = document.createElement('div');
    out.className = 'mb-1';
    out.style.color = '#7CE57C';

    if (cmd === 'help') {
      out.innerHTML = `Commands:<br/>- <span style="color:#DC9BB5">whoami</span>: identify user<br/>- <span style="color:#DC9BB5">whatsong</span>: view current track & album art<br/>- <span style="color:#DC9BB5">walloftext</span>: visit my public text wall<br/>- <span style="color:#DC9BB5">hack</span>: launch mainframe override<br/>- <span style="color:#DC9BB5">clear</span>: clear terminal<br/>- <span style="color:#DC9BB5">exit</span>: return to auto mode`;
    } else if (cmd === 'whoami') {
      out.textContent = 'guest@rakshita.me';
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
      out.innerHTML = '';
      
      const track = (window as any)._currentTrack;
      if (!track || !track.name) {
        out.innerHTML = `<span style="color:#FF5F57">Error: No track currently scrobbling. Try again later.</span>`;
      } else {
        out.innerHTML = `<span style="color:#DC9BB5">Fetching audio data...</span>`;
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          // Adjusted to exactly match character aspect ratio for a perfect square
          const w = 34;
          const h = 24;
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) return;
          
          ctx.drawImage(img, 0, 0, w, h);
          const data = ctx.getImageData(0, 0, w, h).data;
          
          // Density chars from dark to light
          const chars = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];
          
          let asciiHtml = '<div style="font-size:4px; line-height:4px; letter-spacing:1px; font-weight:900; font-family:monospace; margin-bottom:12px; margin-top:4px;">';
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
            <div style="display:flex; align-items:center; gap:12px; border-left:3px solid ${mainColor}; padding-left:12px; margin-bottom: 8px;">
              <div>
                <div style="color:#FFFFFF; font-size:12px; font-weight:bold; letter-spacing:0.5px;">${track.name}</div>
                <div style="color:#DC9BB5; font-size:10px; opacity:0.8;">${track.artist}</div>
              </div>
              <div style="flex:1"></div>
              <div aria-hidden="true" style="display:flex; gap:3px; align-items:flex-end; height:12px; padding-right:8px;">
                ${[1,2,3,4,5].map((_, i) => {
                  const col = track.colors?.length ? track.colors[i % track.colors.length] : '#39FF14';
                  return `<span style="width:3px; border-radius:2px; background:${col}; box-shadow:0 0 4px ${col}; display:inline-block; animation: np-eq${i+1} 1s ease-in-out infinite alternate;"></span>`;
                }).join('')}
              </div>
            </div>
          `;
          
          out.innerHTML = asciiHtml + titleHtml;
          setTimeout(() => { termBody.scrollTop = termBody.scrollHeight; }, 10);
        };
        img.onerror = () => {
          out.innerHTML = `<span style="color:#FF5F57">Error: Cannot decode album art stream.</span>`;
        };
        if (track.artUrl) {
           img.src = track.artUrl;
        } else {
           out.innerHTML = `<span style="color:#FF5F57">Error: No album art available.</span>`;
        }
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
      
      // 2. Visual Easter Egg
      document.body.style.transition = 'filter 0.5s ease';
      document.body.style.filter = 'invert(1) hue-rotate(180deg)';
      setTimeout(() => {
        document.body.style.filter = '';
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
}

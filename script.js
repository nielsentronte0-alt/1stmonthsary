(function(){

  /* ============================================================
     CUSTOMIZE ME
     ============================================================ */
  const partnerName = "My Love";
  const relationshipStart = new Date(2026, 7, 15);
  const loveNotes = [
    "Every month with you feels like the first",
    "You're my favorite person to grow with",
    "Still choosing you, every single day",
    "You make ordinary days feel golden",
    "My favorite hello is always yours",
    "Here's to more months, more memories, more us",
    "You're the best part of my every day",
    "I fall for you more and more",
    "You're my home",
    "Loving you is the easiest thing I've ever done",
    "You make everything better",
    "My heart is yours, always",
    "I love you",
    "You're my sunshine on a rainy day",
    "Every moment with you is a treasure",
    "You're the reason I smile"
  ];
  const photos = [
    "image2.png",
    "image1.png",
    "image3.png",
    "image5.png",
    "image4.png",
    "image6.png",
  ];
  const photoCaptions = ["Our first date","So beautiful","Movie nights","Your smile","Us, always","so pretty"];
  /* ============================================================ */

  const flowerPalette = [
    { petal:"#D98CA0", center:"#F0DDB8" },
    { petal:"#E3B7C2", center:"#9C2B2B" },
    { petal:"#C9A15A", center:"#F3E9D2" },
    { petal:"#B98CAE", center:"#F0DDB8" }
  ];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ordinal(n){
    const s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  }

  function monthsSince(start){
    const now = new Date();
    let months = (now.getFullYear()-start.getFullYear())*12 + (now.getMonth()-start.getMonth());
    const marker = new Date(start.getFullYear(), start.getMonth()+months, start.getDate());
    if(marker > now) months -= 1;
    return Math.max(months,0);
  }

  function rand(min,max){ return Math.random()*(max-min)+min; }

  function blossomSVG(petal, center){
    return '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">'
      + '<circle cx="20" cy="9"  r="8" fill="'+petal+'" opacity="0.92"/>'
      + '<circle cx="31" cy="20" r="8" fill="'+petal+'" opacity="0.92"/>'
      + '<circle cx="20" cy="31" r="8" fill="'+petal+'" opacity="0.92"/>'
      + '<circle cx="9"  cy="20" r="8" fill="'+petal+'" opacity="0.92"/>'
      + '<circle cx="20" cy="20" r="6.5" fill="'+center+'"/>'
      + '</svg>';
  }

  function sparkleSVG(color){
    return '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M20 3 L24 16 L37 20 L24 24 L20 37 L16 24 L3 20 L16 16 Z" fill="'+color+'"/>'
      + '</svg>';
  }

  let spiralCounter = 0;
  function buildKeyframes(name, baseAngle, maxRadius, rotations, dir){
    const steps = 10;
    let body = "";
    for(let s=0;s<=steps;s++){
      const t = s/steps;
      const angle = baseAngle + dir*rotations*2*Math.PI*t;
      const radius = maxRadius*Math.pow(t,0.85);
      const x = (radius*Math.cos(angle)).toFixed(2);
      const y = (radius*Math.sin(angle)).toFixed(2);
      const scale = Math.min(1, t/0.35).toFixed(2);
      const rot = (dir*rotations*360*t).toFixed(1);
      const opacity = t < 0.08 ? (t/0.08).toFixed(2) : "1";
      const pct = (t*100).toFixed(2);
      body += pct+"% { transform: translate(-50%,-50%) translate("+x+"vmin, "+y+"vmin) scale("+scale+") rotate("+rot+"deg); opacity:"+opacity+"; }\n";
    }
    return "@keyframes "+name+" {\n"+body+"}\n";
  }

  function buildHeartKeyframes(name, tx, ty, dir){
    const steps = 12;
    let body = "";
    const len = Math.sqrt(tx*tx + ty*ty) || 1;
    const perpX = -ty/len, perpY = tx/len;
    const bend = dir*rand(0.22,0.5)*len;
    const mx = tx/2 + perpX*bend;
    const my = ty/2 + perpY*bend;
    const spinStart = dir*rand(160,300);
    const spinEnd = rand(-6,6);
    for(let s=0;s<=steps;s++){
      const t = s/steps;
      const it = 1-t;
      const x = 2*it*t*mx + t*t*tx;
      const y = 2*it*t*my + t*t*ty;
      const scale = Math.min(1, t/0.3).toFixed(2);
      const rot = (spinStart + (spinEnd-spinStart)*t).toFixed(1);
      const opacity = t < 0.08 ? (t/0.08).toFixed(2) : "1";
      const pct = (t*100).toFixed(2);
      body += pct+"% { transform: translate(-50%,-50%) translate("+x.toFixed(2)+"vmin, "+y.toFixed(2)+"vmin) scale("+scale+") rotate("+rot+"deg); opacity:"+opacity+"; }\n";
    }
    return "@keyframes "+name+" {\n"+body+"}\n";
  }

  function heartPoints(n, scale){
    const pts = [];
    for(let i=0;i<n;i++){
      const t = (i/n)*2*Math.PI;
      const x = 16*Math.pow(Math.sin(t),3);
      const y = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
      pts.push({ x: x*scale, y: -y*scale });
    }
    return pts;
  }

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function buildItemsList(){
    const items = [];
    for(let i=0;i<24;i++){
      if(i % 7 === 0){
        items.push({ type:"flower", content:{ kind:"sparkle", color: i%2===0 ? "#C9A15A" : "#E3B7C2" } });
      } else {
        const fp = flowerPalette[i % flowerPalette.length];
        items.push({ type:"flower", content:{ kind:"blossom", petal:fp.petal, center:fp.center } });
      }
    }
    loveNotes.forEach(function(note){ items.push({ type:"letter", content:note }); });
    photos.forEach(function(src,i){ items.push({ type:"photo", content:{ src:src, caption:photoCaptions[i]||"" } }); });
    return items;
  }

  const bloomContainer = document.getElementById("bloom-container");
  const spiralStyleTag = document.getElementById("spiral-styles");

  function makeDraggable(el){
    let startX, startY, origX, origY, dragging = false, moved = false;
    function applyTransform(){
      const sx = parseFloat(el.dataset.sx) || 0;
      const sy = parseFloat(el.dataset.sy) || 0;
      const tx = parseFloat(el.dataset.tx) || 0;
      const ty = parseFloat(el.dataset.ty) || 0;
      const sc = parseFloat(el.dataset.scale) || 1;
      el.style.transform = "translate(-50%,-50%) translate("+sx.toFixed(1)+"vmin, "+sy.toFixed(1)+"vmin) translate("+tx.toFixed(0)+"px, "+ty.toFixed(0)+"px) scale("+sc+")";
    }
    function onStart(px, py, e){
      if(e && e.target.closest("#lbImg, .lb-close, #lightbox")) return;
      if(e && e.target.closest(".replay-btn")) return;
      dragging = true;
      moved = false;
      startX = px; startY = py;
      origX = parseFloat(el.dataset.tx) || 0;
      origY = parseFloat(el.dataset.ty) || 0;
    }
    function onMove(px, py){
      if(!dragging) return;
      const dx = px - startX, dy = py - startY;
      if(!moved && Math.sqrt(dx*dx + dy*dy) < 5) return;
      if(!moved){
        moved = true;
        el.style.cursor = "grabbing";
        el.style.transition = "none";
        el.style.animation = "none";
        applyTransform();
      }
      el.dataset.tx = origX + dx;
      el.dataset.ty = origY + dy;
      applyTransform();
    }
    function onEnd(){
      if(!dragging) return;
      dragging = false;
      if(moved){
        el.style.cursor = "";
        el.style.transition = "";
      }
    }
    el.addEventListener("mousedown", function(e){ onStart(e.clientX, e.clientY, e); });
    document.addEventListener("mousemove", function(e){ onMove(e.clientX, e.clientY); });
    document.addEventListener("mouseup", onEnd);
    el.addEventListener("touchstart", function(e){ const t=e.touches[0]; onStart(t.clientX, t.clientY, e); }, {passive:true});
    document.addEventListener("touchmove", function(e){ if(dragging){ const t=e.touches[0]; onMove(t.clientX, t.clientY); } }, {passive:true});
    document.addEventListener("touchend", onEnd);
  }

  function spawnElement(item, angle, dir, heartTarget){
    const el = document.createElement("div");
    let maxRadius, rotations, duration, delay, fx, fy, kf;

    if(item.type === "flower"){
      el.className = "bloom-item flower";
      const size = rand(5,9.5);
      el.style.width = size+"vmin"; el.style.height = size+"vmin";
      el.innerHTML = item.content.kind === "sparkle" ? sparkleSVG(item.content.color) : blossomSVG(item.content.petal, item.content.center);
      maxRadius = rand(32,68); rotations = rand(1.1,2.2);
      duration = rand(2.2,3.5); delay = rand(0,0.25);

      const finalAngle = angle + dir*rotations*2*Math.PI;
      fx = maxRadius*Math.cos(finalAngle);
      fy = maxRadius*Math.sin(finalAngle);
      el.dataset.sx = fx.toFixed(1);
      el.dataset.sy = fy.toFixed(1);
      el.dataset.scale = "1";

      if(reduceMotion){
        el.style.opacity = "0";
        el.style.transform = "translate(-50%,-50%) scale(0.6)";
        el.style.transition = "opacity .6s ease "+delay+"s, transform .6s ease "+delay+"s";
        bloomContainer.appendChild(el);
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){
            el.style.transform = "translate(-50%,-50%) translate("+fx.toFixed(1)+"vmin, "+fy.toFixed(1)+"vmin) scale(1)";
            el.style.opacity = "1";
            makeDraggable(el);
          });
        });
        return "";
      }

      const name = "spiral"+(spiralCounter++);
      kf = buildKeyframes(name, angle, maxRadius, rotations, dir);
      el.style.animation = name+" "+duration+"s cubic-bezier(0.22,0.61,0.36,1) "+delay+"s forwards";
      bloomContainer.appendChild(el);
      setTimeout(function(){ makeDraggable(el); }, (delay+duration)*1000);
      return kf;
    }

    if(item.type === "letter"){
      el.className = "bloom-item letter";
      el.textContent = item.content;
      duration = rand(2.5,3.5); delay = rand(0.1,0.4);
    } else {
      el.className = "bloom-item photo";
      if(item.content.src){
        el.innerHTML = '<img src="'+item.content.src+'" alt="'+item.content.caption+'"><span class="cap">'+item.content.caption+'</span>';
      } else {
        el.innerHTML = '<div class="placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.2"/></svg><small>add photo</small></div><span class="cap">'+item.content.caption+'</span>';
      }
      duration = rand(2.5,3.5); delay = rand(0.15,0.5);
      el.dataset.photo = "1";
    }

    fx = heartTarget.x; fy = heartTarget.y;
    el.dataset.sx = fx.toFixed(1);
    el.dataset.sy = fy.toFixed(1);
    el.dataset.scale = "1";

    if(reduceMotion){
      el.style.opacity = "0";
      el.style.transform = "translate(-50%,-50%) scale(0.6)";
      el.style.transition = "opacity .6s ease "+delay+"s, transform .6s ease "+delay+"s";
      bloomContainer.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          el.style.transform = "translate(-50%,-50%) translate("+fx.toFixed(1)+"vmin, "+fy.toFixed(1)+"vmin) scale(1)";
          el.style.opacity = "1";
        });
      });
      return "";
    }

    const name = "heart"+(spiralCounter++);
    kf = buildHeartKeyframes(name, fx, fy, dir);
    el.style.animation = name+" "+duration+"s cubic-bezier(0.22,0.61,0.36,1) "+delay+"s forwards";
    bloomContainer.appendChild(el);
    return kf;
  }

  function triggerBloom(){
    bloomContainer.innerHTML = "";
    let allKeyframes = "";

    const items = shuffle(buildItemsList());

    const heartItemCount = loveNotes.length + photos.length;
    const heartScale = 2.6;
    const heartSlots = shuffle(heartPoints(heartItemCount, heartScale));
    let heartSlotIndex = 0;

    const N = items.length;
    items.forEach(function(item, i){
      const slot = (i/N)*2*Math.PI + (Math.random()-0.5)*((2*Math.PI/N)*0.7);
      const dir = Math.random() < 0.5 ? 1 : -1;
      let kf;
      if(item.type === "flower"){
        kf = spawnElement(item, slot, dir);
      } else {
        const target = heartSlots[heartSlotIndex++];
        kf = spawnElement(item, slot, dir, target);
      }
      if(kf) allKeyframes += kf;
    });

    if(!reduceMotion){
      spiralStyleTag.textContent = allKeyframes;
    }

    document.getElementById("message-heading").textContent = "Happy "+ordinal(monthsCount||1)+" Monthsary, "+partnerName;
    document.getElementById("message-sub").textContent = "every flower, note, and photo here is just a fraction of how much you mean to me, I love you more than words can say. Here's to many more months and memories together.";

    setTimeout(function(){
      document.getElementById("message-card").classList.add("show");
    }, reduceMotion ? 600 : 2800);
  }

  const lyricsTimeline = [
    { time: 15,  text: "If you leave me don't you ever think I want you to go\nCause I'm bound to you\nAll I need is you to wait for me and I'll be there for you\nCause I'll run to you" },
    { time: 42,  text: "My heart belongs to you\nI'll take a piece of you" },
    { time: 73,  text: "I don't know what's happening now\nAnd a lot of things have turned\nI wished that I could turn back time\nBack when I'm with you" },
    { time: 100, text: "But my heart belongs to you\nI'll take a piece of you" },
    { time: 145, text: "My heart belongs to you\nI'll take a piece of you" },
    { time: 170, text: "My heart belongs to you\nI'll take a piece of you\nMy heart belongs to you\nI'll take a piece of you" }
  ];

  let lyricsUpdate = null;

  function playSongWithLyrics(){
    try{
      const a = document.getElementById("bgm");
      const lyricsEl = document.getElementById("lyrics-display");
      a.volume = 0.6;
      a.currentTime = 0;

      if(lyricsUpdate) a.removeEventListener("timeupdate", lyricsUpdate);

      lyricsUpdate = function(){
        let current = "";
        for(let i = 0; i < lyricsTimeline.length; i++){
          if(a.currentTime >= lyricsTimeline[i].time){
            current = lyricsTimeline[i].text;
          }
        }
        if(current){
          lyricsEl.textContent = current;
          lyricsEl.classList.add("show");
        } else {
          lyricsEl.classList.remove("show");
        }
      };

      a.addEventListener("timeupdate", lyricsUpdate);

      const p = a.play();
      if(p && p.catch) p.catch(function(){});
    }catch(e){}
  }

  /* ---------- init ---------- */
  const monthsCount = monthsSince(relationshipStart);
  document.getElementById("forName").textContent = partnerName;
  document.getElementById("postmarkDate").textContent = new Date(2026, 7, 15).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}).toUpperCase();
  document.getElementById("eyebrowCount").textContent = ordinal(monthsCount||1) + " MONTHSARY";

  /* ---------- interactions ---------- */
  const coverEl = document.getElementById("cover");
  const sealBtn = document.getElementById("sealBtn");
  let triggered = false;

  coverEl.addEventListener("click", function(){
    if(triggered) return;
    triggered = true;
    playSongWithLyrics();
    sealBtn.classList.add("breaking");
    setTimeout(function(){
      coverEl.classList.add("hide");
      document.getElementById("celebration").classList.add("show");
      triggerBloom();
    }, reduceMotion ? 0 : 260);
  });

  function dismissCard(){
    document.getElementById("message-card").classList.remove("show");
  }

  document.getElementById("mcClose").addEventListener("click", dismissCard);

  document.getElementById("replayBtn").addEventListener("click", function(){
    dismissCard();
    document.getElementById("celebration").classList.remove("show");
    document.getElementById("lyrics-display").classList.remove("show");
    document.getElementById("lyrics-display").textContent = "";
    coverEl.classList.remove("hide");
    sealBtn.classList.remove("breaking");
    const a = document.getElementById("bgm");
    a.pause();
    a.currentTime = 0;
    if(lyricsUpdate){ a.removeEventListener("timeupdate", lyricsUpdate); lyricsUpdate = null; }
    setTimeout(function(){
      bloomContainer.innerHTML = "";
      spiralStyleTag.textContent = "";
      triggered = false;
    }, 650);
  });

  /* ---------- lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  document.getElementById("lbClose").addEventListener("click", function(){
    lightbox.classList.remove("show");
  });
  lightbox.addEventListener("click", function(e){
    if(e.target === lightbox) lightbox.classList.remove("show");
  });

  document.addEventListener("click", function(e){
    const photoEl = e.target.closest(".bloom-item.photo");
    const letterEl = e.target.closest(".bloom-item.letter");
    const lbImg = document.getElementById("lbImg");
    const lbText = document.getElementById("lbText");

    if(photoEl){
      const img = photoEl.querySelector("img");
      if(!img) return;
      const cap = photoEl.querySelector(".cap");
      lbImg.src = img.src;
      lbImg.style.display = "";
      lbText.style.display = "none";
      document.getElementById("lbCaption").textContent = cap ? cap.textContent : "";
      lightbox.classList.add("show");
      return;
    }

    if(letterEl){
      lbImg.style.display = "none";
      lbText.style.display = "block";
      lbText.textContent = letterEl.textContent;
      document.getElementById("lbCaption").textContent = "";
      lightbox.classList.add("show");
    }
  });

})();

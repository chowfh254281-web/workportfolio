'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  // 1. 定義狀態
  const [randomAiVideo, setRandomAiVideo] = useState<string | null>(null);
  const [activeYt, setActiveYt] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(true); // Loading 狀態

  // 2. 初始化
  useEffect(() => {
    // 設定隨機影片
    const aiVideoSources = [
      "/images/AI_optimized/ai_1.mp4",
      "/images/AI_optimized/ai_2.mp4"
    ];
    setRandomAiVideo(aiVideoSources[Math.floor(Math.random() * aiVideoSources.length)]);

    // Preloader 設定 (2秒)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 3. Navbar Toggle Logic
  const toggleMenu = () => {
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    
    if (!navbar || !menuBtn) return;

    if (window.innerWidth <= 768) {
        const isActive = navbar.classList.contains('mobile-active');
        
        if (isActive) {
            navbar.classList.remove('mobile-active');
            menuBtn.classList.remove('open');
            document.body.style.overflow = ''; 
        } else {
            navbar.classList.remove('collapsed'); 
            navbar.classList.add('mobile-active');
            menuBtn.classList.add('open');
            document.body.style.overflow = 'hidden'; 
        }
    } else {
        navbar.classList.toggle('force-expand');
    }
  };

  // 4. 動畫與邏輯
  useEffect(() => {
    let lenis: any;
    
    import('@studio-freight/lenis').then((Lenis) => {
      lenis = new Lenis.default({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    const navbar = document.getElementById('navbar');
    const title = document.querySelector('.main-title') as HTMLElement;
    const subtitle = document.querySelector('.subtitle') as HTMLElement;
    const seamlessHero = document.getElementById('seamless-hero');
    const imgCard = document.querySelector('.img-card') as HTMLElement;
    const imgBg = document.querySelector('.img-bg') as HTMLElement;
    const heroOverlay = document.getElementById('hero-overlay');
    const introText = document.getElementById('intro-text-container');
    const aboutTrack = document.getElementById('about-track');
    const revealSource = document.getElementById('text-reveal-source');
    const detailsBlock = document.getElementById('text-details-block');
    const contactBubble = document.getElementById('contact-bubble');
    const scrollPrompt = document.getElementById('scroll-prompt');
    const overviewTitle = document.getElementById('overview-title');

    function splitTextIntoSpans(element: HTMLElement) {
        const childNodes = Array.from(element.childNodes);
        element.innerHTML = '';
        childNodes.forEach(node => {
          if (node.nodeType === 3) {
            const words = (node.textContent || '').split(/(\s+)/);
            words.forEach(word => {
              if (word.trim().length > 0) {
                const span = document.createElement('span');
                span.classList.add('word');
                span.textContent = word;
                element.appendChild(span);
              } else {
                element.appendChild(document.createTextNode(word));
              }
            });
          } else if (node.nodeType === 1) {
            const wrapperSpan = node.cloneNode(false) as HTMLElement;
            const innerWords = (node.textContent || '').split(/(\s+)/);
            innerWords.forEach(w => {
              if (w.trim().length > 0) {
                const wordSpan = document.createElement('span');
                wordSpan.classList.add('word');
                wordSpan.textContent = w;
                wrapperSpan.appendChild(wordSpan);
              } else {
                wrapperSpan.appendChild(document.createTextNode(w));
              }
            });
            element.appendChild(wrapperSpan);
          }
        });
    }

    if (revealSource) splitTextIntoSpans(revealSource);

    if (title && !title.classList.contains('split-done')) {
      const text = title.textContent || '';
      title.innerHTML = text.replace(/\S/g, "<span class='char-span'>$&</span>");
      title.classList.add('split-done');
      const spans = title.querySelectorAll('.char-span');
      spans.forEach((span: any, idx) => {
        setTimeout(() => span.classList.add('visible'), 100 + (idx * 50));
      });
      setTimeout(() => subtitle?.classList.add('visible'), 800);
    }

    if (subtitle && !subtitle.classList.contains('split-done')) {
       const subText = subtitle.textContent || '';
       subtitle.innerHTML = subText.split('').map(char => `<span class="sub-char">${char}</span>`).join('');
       subtitle.classList.add('split-done');
    }

    if (overviewTitle && !overviewTitle.classList.contains('split-done')) {
        const text = "WORK OVERVIEW";
        overviewTitle.innerHTML = text.split('').map(char => 
            char === ' ' ? '<span style="display:inline">&nbsp;</span>' : `<span>${char}</span>`
        ).join('');
        overviewTitle.classList.add('split-done');
    }

    const animateLoop = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      if (scrollY > 50) {
          if (navbar && navbar.classList.contains('mobile-active')) {
              navbar.classList.remove('collapsed');
          } else {
              navbar?.classList.add('collapsed');
          }
      } else {
        navbar?.classList.remove('collapsed');
        navbar?.classList.remove('force-expand');
      }

      if (scrollPrompt) {
        if (scrollY > 50) scrollPrompt.classList.add('hide');
        else scrollPrompt.classList.remove('hide');
      }

      const scatterProgress = Math.min(scrollY / (windowHeight * 0.6), 1);
      if (introText) {
        introText.style.opacity = (1 - scatterProgress).toString();
        introText.style.transform = `translate(-50%, -50%)`;
      }

      const colorP = scatterProgress;
      const r = 244 + (255 - 244) * colorP;
      const g = 208 + (255 - 208) * colorP;
      const b = 63 + (255 - 63) * colorP;
      const colorString = `rgb(${r},${g},${b})`;

      if (title) title.style.color = colorString;
      if (subtitle) subtitle.style.color = colorString;

      const charSpans = document.querySelectorAll('.char-span, .sub-char');
      if (charSpans.length > 0) {
        charSpans.forEach((span: any, i) => {
          const randomAngle = (i * 137.5) % 360;
          const distance = scrollY * 2.5;
          const x = Math.cos(randomAngle * Math.PI / 180) * distance;
          const y = Math.sin(randomAngle * Math.PI / 180) * distance;
          const rotation = scrollY * (i % 2 === 0 ? 0.5 : -0.5);
          const blur = scrollY * 0.05;
          const powerDist = Math.pow(distance * 0.02, 2) * 50;

          span.style.transform = `translate(${x * (powerDist / distance)}px, ${y * (powerDist / distance)}px) rotate(${rotation}deg)`;
          span.style.filter = `blur(${blur}px)`;
          span.style.color = colorString;
          span.style.opacity = (1 - scatterProgress).toString();
        });
      }

      if (seamlessHero) {
          const cardFadeIn = Math.min(scrollY / 150, 1);
          seamlessHero.style.opacity = cardFadeIn.toString();
      }

      if (seamlessHero && aboutTrack) {
        seamlessHero.style.maxWidth = '100vw';
        seamlessHero.style.maxHeight = '100vh';

        const trackRect = aboutTrack.getBoundingClientRect();
        const totalDistance = trackRect.height - windowHeight;
        let progress = 0;
        if (trackRect.top <= 0) progress = Math.abs(trackRect.top) / totalDistance;
        progress = Math.max(0, Math.min(progress, 1));

        const startW = Math.min(windowWidth * 0.25, 350);
        const startH = Math.min(windowWidth * 0.35, 500);
        const midW = windowWidth * 0.4;
        const midH = startH * 1.3;
        
        let currentW, currentH, radius;

        if (progress < 0.15) {
          const p1 = progress / 0.15;
          currentW = startW + (midW - startW) * p1;
          currentH = startH + (midH - startH) * p1;
          radius = 16;

          const swapP = Math.min(p1 * 2.5, 1);
          if (imgCard) imgCard.style.opacity = (1 - swapP).toString();
          if (imgBg) imgBg.style.opacity = swapP.toString();
          if (revealSource) revealSource.style.opacity = '0';
        } else {
          const growP = (progress - 0.15) / 0.75;
          currentW = midW + (windowWidth - midW) * growP;
          currentH = midH + (windowHeight - midH) * growP;
          radius = 16 * (1 - growP);

          if (imgCard) imgCard.style.opacity = '0';
          if (imgBg) imgBg.style.opacity = '1';

          let textFade = 0;
          if (progress < 0.25) {
            textFade = (progress - 0.15) / 0.10;
          } else if (progress < 0.85) {
            textFade = 1;
          } else {
            textFade = 1 - ((progress - 0.85) / 0.10);
          }

          const allWords = revealSource?.querySelectorAll('.word') || [];
          if (progress >= 0.25 && progress < 0.85) {
             allWords.forEach(word => word.classList.add('active'));
          } else if (progress < 0.25) {
            const readP = Math.max(0, (progress - 0.15) / 0.10);
            const activeCount = Math.floor(readP * allWords.length);
            allWords.forEach((word, idx) => {
              if (idx <= activeCount) word.classList.add('active');
              else word.classList.remove('active');
            });
          }

          if (revealSource) revealSource.style.opacity = Math.max(0, textFade).toString();

          let detailsOp = 0;
          if (progress > 0.85) {
            detailsOp = (progress - 0.85) / 0.10;
          }

          if (detailsBlock) {
              detailsBlock.style.opacity = Math.max(0, Math.min(detailsOp, 1)).toString();
              
              if (window.innerWidth > 768) {
                  detailsBlock.style.transform = `translateY(${(1 - Math.min(detailsOp, 1)) * 20}px)`;
              } else {
                  detailsBlock.style.transform = ''; 
              }
          }
          if (heroOverlay) heroOverlay.style.opacity = (growP * 0.6).toString();
        }

        seamlessHero.style.width = `${currentW}px`;
        seamlessHero.style.height = `${currentH}px`;
        seamlessHero.style.borderRadius = `${radius}px`;
      }

      if (contactBubble) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            contactBubble.classList.add('expanded');
        } else {
            contactBubble.classList.remove('expanded');
        }
      }

      updateTextWave();
      requestAnimationFrame(animateLoop);
    };

    const startAnim = requestAnimationFrame(animateLoop);

    return () => {
      cancelAnimationFrame(startAnim);
      if (lenis) lenis.destroy();
    };
  }, []);

  function updateTextWave() {
    const textContainer = document.getElementById('lets-create-text');
    const contentWrapper = document.getElementById('contact-content-wrapper');
    if (!textContainer) return;
    
    if (textContainer.querySelectorAll('span').length === 0) {
        const text = textContainer.textContent || '';
        textContainer.textContent = '';
        text.split('').forEach(char => {
            const s = document.createElement('span');
            s.textContent = char === ' ' ? '\u00A0' : char;
            textContainer.appendChild(s);
        });
    }

    const rect = textContainer.getBoundingClientRect();
    const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
    const start = window.innerHeight;
    const end = 0;
    let scrollPos = (start - rect.top) / (start - end);
    const wavePos = scrollPos * 1.5 - 0.2;
    const spans = textContainer.querySelectorAll('span');

    spans.forEach((span: any, index) => {
        if (isBottom) {
            span.style.color = '#fff';
            span.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
            span.style.transform = 'scale(1)';
            contentWrapper?.classList.add('shift-layout');
            return;
        }
        contentWrapper?.classList.remove('shift-layout');
        
        const letterPos = index / (spans.length - 1);
        const diff = Math.abs(wavePos - letterPos);
        const width = 0.15;
        
        if (diff < width) {
            const intensity = 1 - (diff / width);
            span.style.color = `rgb(255, ${215 + (40 * (1 - intensity))}, ${0 + (255 * (1 - intensity))})`;
            span.style.textShadow = `0 0 ${20 * intensity}px rgba(244, 208, 63, ${0.8 * intensity})`;
            span.style.transform = `scale(${1 + (0.15 * intensity)}) translateY(-${5 * intensity}px)`;
        } else if (letterPos < wavePos - width) {
            span.style.color = '#fff';
            span.style.textShadow = 'none';
            span.style.transform = 'scale(1)';
        } else {
            span.style.color = '#333';
            span.style.textShadow = 'none';
            span.style.transform = 'scale(1)';
        }
    });
  }

  const portfolioData: any = {
    'uiux': { type: 'static', src: "/images/index_uiux.png" },
    'graphic': { type: 'static', src: "/images/index_graphic.png" },
    '3d': { type: 'static', src: "/images/index_3d.png" },
    'photography': { type: 'static', src: "/images/index_photo.png" },
    'video': { type: 'yt', id: 'DOp19wtL28w' },
    'ai': { type: 'local-video', src: randomAiVideo }
  };

  const categories = [
    { id: 'uiux', label: 'UI/UX' },
    { id: 'graphic', label: 'Graphic' },
    { id: '3d', label: '3D VISUALS' },
    { id: 'photography', label: 'Photography' },
    { id: 'video', label: 'Videography' },
    { id: 'ai', label: 'AI Generative' }
  ];

  return (
    <>
      {/* @ts-ignore */}
      <style jsx global>{`
        /* PERFORMANCE & RESET */
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); min-height: 100vh; overflow-x: hidden; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-stopped { overflow: hidden; }
        .noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 500; mix-blend-mode: overlay; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
        
        /* Preloader */
        .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 9999; transition: opacity 0.8s ease-in-out; pointer-events: none; }
        .preloader.hidden { opacity: 0; }

        /* NAVBAR - FULLSCREEN MOBILE OVERLAY */
        .smart-nav { 
            position: fixed; top: 30px; left: 50%; transform: translateX(-50%); 
            padding: 0 30px; display: flex; align-items: center; justify-content: space-between;
            z-index: 2000; background: rgba(255, 255, 255, 0.05); 
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); 
            border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); 
            width: auto; min-width: 450px; height: 60px;
            transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); 
            overflow: hidden;
            /* 🔴 CURSOR POINTER for entire bar */
            cursor: pointer; 
        }
        
        /* Inner Wrapper for Logo and Burger */
        .nav-header {
            display: contents; /* Desktop: acts as if not there */
        }

        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: 30px; cursor: pointer; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; opacity: 1; max-width: 900px; }
        .nav-item { text-decoration: none; color: #ccc; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; position: relative; }
        .nav-item:hover, .nav-item.active { color: #F4D03F; }
        
        /* Menu Icon */
        .menu-icon { 
            width: 24px; height: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer; margin-left: 40px; 
            pointer-events: none; /* Let clicks pass to nav */
            z-index: 2005; 
        }
        .menu-line { 
            width: 100%; height: 1px; background-color: #fff; 
            transition: all 0.3s ease; transform-origin: center;
        }
        
        /* HAMBURGER TO X ANIMATION */
        .menu-icon.open .menu-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .menu-icon.open .menu-line:nth-child(2) { opacity: 0; }
        .menu-icon.open .menu-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* Desktop Hover Expand */
        .smart-nav:hover, .smart-nav.force-expand { min-width: 650px !important; background: rgba(255, 255, 255, 0.1) !important; padding: 0 30px !important; } 
        .smart-nav:hover .nav-links, .smart-nav.force-expand .nav-links { max-width: 900px !important; opacity: 1 !important; gap: 25px !important; pointer-events: auto !important; display: flex !important; } 
        
        .smart-nav.collapsed { min-width: 150px; background: rgba(255, 255, 255, 0.05); padding: 0 20px; } 
        .smart-nav.collapsed .nav-links { max-width: 0; opacity: 0; gap: 0; pointer-events: none; } 
        .smart-nav.collapsed .nav-logo { margin-right: 10px; } 
        .smart-nav.collapsed .menu-icon { margin-left: 0; }

        /* INTRO */
        .intro-section { height: 100vh; width: 100%; position: relative; overflow: hidden; margin-bottom: 0; z-index: 10; }
        .intro-text { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 50; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; pointer-events: none; will-change: opacity, transform, color; }
        .main-title { font-size: 8vw; font-weight: 900; margin: 0 0 20px 0; letter-spacing: -2px; line-height: 1; color: #F4D03F; transition: color 0.1s linear; }
        .subtitle { font-size: 1.5vw; font-weight: 400; line-height: 1.4; max-width: 800px; color: #F4D03F; opacity: 0; transform: translateY(20px); transition: all 1s ease; }
        .subtitle.visible { opacity: 1; transform: translateY(0); }
        .char-span, .sub-char { display: inline-block; will-change: transform, opacity, filter, color; }
        /* HERO */
        .seamless-hero { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 25vw; height: 35vw; max-width: 350px; max-height: 500px; border-radius: 16px; z-index: 5; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.6); opacity: 0; will-change: width, height, border-radius, opacity; }
        .hero-inner-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: none; }
        .img-bg { z-index: 1; opacity: 0; }
        .img-card { z-index: 2; opacity: 1; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 3; opacity: 0; pointer-events: none; }
        /* ABOUT */
        .about-track { height: 300vh; position: relative; z-index: 10; margin-top: -10vh; }
        .about-sticky-view { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; display: flex; align-items: center; padding: 0 5vw; box-sizing: border-box; background: transparent; pointer-events: none; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; width: 100%; height: 100%; align-items: center; position: relative; z-index: 2; }
        .card-target-left { width: 100%; aspect-ratio: 0.7; position: relative; visibility: hidden; } 
        .text-container { position: relative; height: auto; min-height: 400px; display: flex; align-items: center; justify-content: center; pointer-events: auto; }
        .text-layer-1 { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; text-align: center; font-size: 3.5vw; font-weight: 800; line-height: 1.2; letter-spacing: -1px; opacity: 0; z-index: 120; color: #fff; }
        .word { display: inline-block; opacity: 0.1; transition: opacity 0.5s ease; white-space: pre-wrap; }
        .word.active { opacity: 1; }
        .text-layer-2 { position: absolute; top: 50%; transform: translateY(-50%); left: 0; width: 100%; opacity: 0; transition: opacity 0.8s ease; text-align: left; }
        .details-text { font-size: 2vw; line-height: 1.4; font-weight: 400; color: #ddd; margin-bottom: 40px; }
        .headline-accent { font-family: 'Times New Roman', serif; font-style: italic; }
        .citation-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; } 
        .citation-item { font-size: 16px; color: #F4D03F; margin-bottom: 12px; padding-left: 15px; border-left: 2px solid rgba(244, 208, 63, 0.3); } 
        .citation-item span { display: block; color: #aaa; font-size: 14px; margin-top: 4px; }
        /* OVERVIEW */
        .overview-section { height: 100vh; width: 100%; position: relative; z-index: 30; background-color: #050505; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
        .overview-title { font-size: 6vw; font-weight: 800; letter-spacing: -1px; margin-bottom: 15px; color: #fff; line-height: 1; visibility: visible; }
        .overview-title span { display: inline-block; } 
        .overview-subtitle { font-size: 1.1rem; color: #888; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; visibility: visible; }
        .scroll-prompt { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 100; pointer-events: none; opacity: 0.6; transition: opacity 0.3s ease; }
        .scroll-prompt.hide { opacity: 0; }
        .scroll-text { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: rgba(255,255,255,0.4); text-transform: uppercase; }
        .scroll-line { width: 1px; height: 40px; background: rgba(255,255,255,0.1); position: relative; overflow: hidden; }
        .scroll-line::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, transparent, #fff, transparent); transform: translateY(-100%); animation: scrollFlow 2s cubic-bezier(0.77, 0, 0.175, 1) infinite; }
        @keyframes scrollFlow { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        /* GALLERY */
        .gallery-wrapper { position: relative; width: 100%; z-index: 200; background: #050505; box-shadow: 0 -50px 100px rgba(0,0,0,1); }
        .hero-section { width: 100%; height: 70vh; position: relative; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; background: #050505; cursor: pointer; }
        .hero-section:hover .hero-img.static-thumb { transform: scale(1.05); filter: brightness(1); }
        .hero-img-wrapper { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        .hero-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease, filter 0.5s ease, opacity 0.5s ease; }
        .hero-img.static-thumb { filter: brightness(0.6); transform: scale(1); }
        
        .hero-category-label { 
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -30%); 
            font-size: 8vw; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; 
            color: #fff; text-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 20; 
            pointer-events: none; text-align: center; width: 100%; 
            opacity: 0; /* Hidden by default on Desktop */
            transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); 
        }
        .hero-section:hover .hero-category-label { 
            opacity: 1; 
            transform: translate(-50%, -50%); 
        }

        .yt-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; }
        .hero-section:hover .yt-thumb { opacity: 0; } 
        /* CONTACT */
        #contact-section { height: 100vh; }
        .contact-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 30; width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 0; transition: gap 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .contact-content.shift-layout { gap: 50px; }
        .contact-title { font-size: 80px; font-weight: 900; color: #333; margin: 0; letter-spacing: -2px; display: inline-block; white-space: nowrap; }
        #lets-create-text span { display: inline-block; color: #333; transition: color 0.2s ease-out, text-shadow 0.2s ease-out, transform 0.2s ease-out; will-change: color, transform; }
        .vertical-line { width: 1px; height: 0; background-color: rgba(255, 255, 255, 0.4); margin: 0; opacity: 0; transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1), margin 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease; }
        .contact-content.shift-layout .vertical-line { height: 80px; margin: 0 40px; opacity: 1; transition-delay: 0.4s; }
        .qr-container { width: 0; opacity: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; transform: translateX(-50px); transition: all 0.5s ease; }
        .contact-content.shift-layout .qr-container { width: 100px; opacity: 1; transform: translateX(0); transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.6s, opacity 0.8s ease 0.9s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.9s; }
        .qr-code-img { width: 100px; min-width: 100px; height: auto; display: block; border-radius: 8px; }
        .contact-widget { position: fixed; bottom: 30px; right: 30px; z-index: 2500; display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; padding: 6px; width: auto; max-width: 52px; height: 52px; box-sizing: border-box; overflow: hidden; transition: max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease, padding-right 0.6s ease; }
        .contact-widget:hover, .contact-widget.expanded { max-width: 380px; padding-right: 25px; background: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .contact-widget:hover .contact-details, .contact-widget.expanded .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }
        .contact-icon { width: 38px; height: 38px; background: #fff; color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .contact-details { opacity: 0; white-space: nowrap; margin-left: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; pointer-events: none; transition: opacity 0.3s ease 0.1s, margin-left 0.4s ease; }
        .contact-link { color: #ccc; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 1px; display: flex; align-items: center; transition: color 0.3s; }
        .contact-link:hover { color: #fff; }
        .contact-link span.label { font-size: 9px; text-transform: uppercase; color: #666; margin-right: 10px; width: 60px; font-weight: 700; }

        /* MOBILE ADAPTATION OVERRIDES */
        @media (max-width: 768px) {
            /* 🔴 FIX GRID: Single Column to fix off-center text */
            .about-grid { 
                display: block !important; 
            }
            .card-target-left {
                display: none !important; 
            }

            /* 🔴 Mobile Text Always Visible */
            .hero-category-label {
                opacity: 1 !important;
                transform: translate(-50%, -50%) !important;
            }

            /* NAVBAR FULL SCREEN OVERLAY FIX */
            .smart-nav { 
                flex-direction: column !important;
                align-items: flex-start !important;
                width: 90% !important; 
                max-width: 350px !important;
                height: 60px; 
                overflow: hidden;
                transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                /* 🔴 RESET MIN-WIDTH for Mobile! */
                min-width: 0 !important; 
            }
            
            .smart-nav.mobile-active {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                transform: none !important;
                width: 100vw !important; 
                max-width: none !important;
                height: 100vh !important;
                
                border-radius: 0 !important;
                background: #000 !important;
                border: none !important;
                padding: 30px !important; 
                justify-content: flex-start !important;
                align-items: center !important; /* Center the content horizontally */
                z-index: 9000 !important; 
            }
            
            .nav-header {
                display: flex !important;
                width: 100%;
                justify-content: space-between;
                align-items: center;
                height: 60px;
                flex-shrink: 0;
            }
            
            .nav-links { 
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.4s ease 0.1s;
                pointer-events: none;
                margin-top: 0;
                height: 100%;
                justify-content: center;
                align-items: center; /* Center Items */
                text-align: center; /* Ensure text is centered */
                gap: 40px !important;
            }
            
            .smart-nav.mobile-active .nav-links {
                opacity: 1 !important;
                transform: translateY(0) !important;
                pointer-events: auto !important;
                visibility: visible !important;
            }
            
            .nav-item {
                font-size: 28px !important;
                font-weight: 700 !important;
                letter-spacing: 2px !important;
            }

            .main-title { font-size: 18vw; }
            .subtitle { font-size: 16px; padding: 0 20px; }

            /* 🔴 MOBILE TEXT CONTAINER HEIGHT FIX */
            .text-container {
                height: 100vh !important; /* Force full height so top:50% works */
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                padding: 0 20px;
            }
            .text-layer-1 { 
                font-size: 28px; 
                width: 90%; 
                line-height: 1.3; 
            }
            /* 🔴 TEXT VERTICAL AND HORIZONTAL CENTER FIX */
            .text-layer-2 { 
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important; /* Perfect Center */
                width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                text-align: center !important;
                padding: 0 20px !important; /* Reduced padding */
                pointer-events: none;
            }
            .details-text { 
                font-size: 16px;
                line-height: 1.5;
                color: #eee; 
                text-align: center !important;
                margin-bottom: 20px;
                width: 100%;
            }
            .citation-list { 
                text-align: left; 
                display: inline-block; 
                margin-top: 10px; 
                width: 100%;
                /* 🔴 REMOVED MAX-WIDTH LIMIT */
                max-width: 100% !important; 
            }

            .contact-content { 
                flex-direction: column !important; 
                gap: 30px; 
            }
            .contact-content.shift-layout { 
                gap: 40px; 
                transform: translate(-50%, -60%); 
            }
            .contact-title { 
                font-size: 15vw; 
                white-space: normal; 
                text-align: center; 
            }
            .vertical-line { 
                width: 1px; 
                height: 40px !important; 
                margin: 20px 0 !important; 
            }
            .contact-content.shift-layout .vertical-line {
                height: 60px !important;
            }
            .qr-container { 
                transform: translateY(20px); 
            }
            .contact-content.shift-layout .qr-container {
                width: 150px; 
                transform: translateY(0);
            }
        }
      `}</style>

      {/* Preloader - 遮住閃爍的畫面 */}
      <div className={`preloader ${!isLoading ? 'hidden' : ''}`}></div>

      {/* 🔴 Added onClick to the NAV container */}
      <nav className="smart-nav" id="navbar" onClick={toggleMenu}>
        <div className="nav-header">
            <Link href="/" className="nav-logo">SAM CHOW.</Link>
            {/* 🔴 Removed onClick from menu-icon to let event bubble to nav */}
            <div className="menu-icon" id="menu-btn">
                <div className="menu-line"></div>
                <div className="menu-line"></div>
                <div className="menu-line"></div>
            </div>
        </div>
        <div className="nav-links">
          <Link href="/uiux" className="nav-item">UI/UX</Link>
          <Link href="/graphic" className="nav-item">Graphic</Link>
          <Link href="/3d" className="nav-item">3D</Link>
          <Link href="/photography" className="nav-item">Photography</Link>
          <Link href="/video" className="nav-item">Video</Link>
          <Link href="/ai" className="nav-item">AI Generative</Link>
        </div>
      </nav>

      <div className="seamless-hero" id="seamless-hero">
        <img src="/images/profile.jpg" className="hero-inner-img img-card" alt="Card" />
        <img src="/profile_bg.png" className="hero-inner-img img-bg" alt="Background" />
        <div className="hero-overlay" id="hero-overlay"></div>
      </div>

      <div className="intro-section" id="intro-trigger">
        <div className="intro-text" id="intro-text-container">
          <h1 className="main-title">SAM CHOW.</h1>
          <div className="subtitle">MultiMedia Designer | Work Portfolio</div>
        </div>
        
        <div className="scroll-prompt" id="scroll-prompt">
          <div className="scroll-text">SCROLL</div>
          <div className="scroll-line"></div>
        </div>
      </div>

      <div className="about-track" id="about-track">
        <div className="about-sticky-view">
          <div className="about-grid">
            <div className="card-target-left" id="profile-anchor"></div>

            <div className="text-container">
              <div className="text-layer-1" id="text-reveal-source">
                I am a <span className="headline-accent">MultiMedia Designer</span>, currently working in a digital marketing agency based in Hong Kong more than 4 years.
              </div>
              <div className="text-layer-2" id="text-details-block">
                <div className="details-text">
                  I am professional in <span className="headline-accent">UIUX and graphic design</span>, 2D/3D animation design, video and photography editing. I hold a Bachelor of Engineering (Honours) in Product Analysis and Engineering Design from <span className="headline-accent">The Hong Kong Polytechnic University</span>.
                </div>
                <ul className="citation-list">
                  <li className="citation-item">Nov 2025<span>Senior Graphic Designer</span></li>
                  <li className="citation-item">Jan 2025<span>Senior Creative & Multimedia Designer</span></li>
                  <li className="citation-item">Aug 2022<span>Creative & Multimedia Designer</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-section" id="overview-section">
        <div className="overview-title" id="overview-title">WORK OVERVIEW</div>
        <div className="overview-subtitle" id="overview-subtitle">Select a category to explore details</div>
        <div className="scroll-prompt">
          <div className="scroll-text">SCROLL</div>
          <div className="scroll-line"></div>
        </div>
      </div>

      <div className="gallery-wrapper" id="gallery-container">
        {categories.map((cat) => {
          const data = portfolioData[cat.id];
          return (
            <Link key={cat.id} href={`/${cat.id}`}>
                <div 
                    className="hero-section"
                    onMouseEnter={() => {
                        if (data?.type === 'yt') setActiveYt(cat.id);
                    }}
                    onMouseLeave={() => {
                        if (data?.type === 'yt') setActiveYt(null);
                    }}
                >
                <div className="hero-img-wrapper yt-wrapper">
                    {data?.type === 'yt' ? (
                        <>
                            <img 
                                src={`https://img.youtube.com/vi/${data.id}/maxresdefault.jpg`} 
                                className="hero-img static-thumb yt-thumb" 
                                style={{ opacity: activeYt === cat.id ? 0 : 1 }}
                                alt={`${cat.label} Cover`} 
                            />
                            <div className="yt-container">
                                {activeYt === cat.id && (
                                    <iframe 
                                        width="100%" height="100%" 
                                        src={`https://www.youtube.com/embed/${data.id}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0`} 
                                        title="YouTube video player" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen 
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                                    ></iframe>
                                )}
                            </div>
                        </>
                    ) : data?.type === 'local-video' ? (
                        data.src ? (
                            <video 
                                src={data.src} 
                                className="hero-img" 
                                autoPlay loop muted playsInline 
                                style={{ objectFit: 'cover' }} 
                            ></video>
                        ) : null
                    ) : (
                        <img 
                            src={data?.src || '/images/placeholder.jpg'} 
                            className="hero-img static-thumb" 
                            alt={`${cat.label} Cover`} 
                        />
                    )}
                </div>
                <div className="hero-category-label">{cat.label}</div>
                </div>
            </Link>
          );
        })}

        {/* Contact Section */}
        <div className="hero-section" id="contact-section" style={{ background: '#080808', cursor: 'default' }}>
            <div className="hero-img-wrapper" style={{ opacity: 0.3 }}>
                <img src="/images/contact_bg.jpg" className="hero-img" style={{ filter: 'grayscale(100%) brightness(0.4)' }} alt="Contact BG" />
            </div>
            <div className="contact-content" id="contact-content-wrapper">
                <div className="contact-title" id="lets-create-text">Let's Create.</div>
                <div className="vertical-line"></div>
                <div className="qr-container" id="qr-target">
                    {/* Public image path check */}
                    <img src="/ig-qrcode.png" alt="Instagram QR Code" className="qr-code-img" />
                </div>
            </div>
        </div>
      </div>

      <div className="contact-widget" id="contact-bubble">
        <div className="contact-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div className="contact-details">
            <a href="https://wa.me/85267012420" target="_blank" className="contact-link" style={{ color: '#fff' }}>
                <span className="label">WHATSAPP</span>6701 2420
            </a>
            <a href="mailto:chowfh254281@gmail.com" className="contact-link" style={{ color: '#fff' }}>
                <span className="label">MAIL</span>chowfh254281@gmail.com
            </a>
        </div>
      </div>
    </>
  );
}
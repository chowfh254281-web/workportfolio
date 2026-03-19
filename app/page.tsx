'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeYt, setActiveYt] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    const target = e.target as HTMLElement;
    if (!navbar || !menuBtn) return;

    if (window.innerWidth <= 768) {
      const isActive = navbar.classList.contains('mobile-active');
      const isLogo = target.closest('.nav-logo');
      if (isLogo && !isActive) return;

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

  useEffect(() => {
    if (isLoading) return;

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

    // 🔴 100% 使用你原本提供嘅寫法
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
      const isMobile = windowWidth <= 768;

      if (scrollY > 50) {
          if (navbar && !navbar.classList.contains('mobile-active')) navbar.classList.add('collapsed');
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

      // 🔴 100% 使用你原本提供嘅算式
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

        const startW = isMobile ? windowWidth * 0.6 : Math.min(windowWidth * 0.25, 350);
        const startH = isMobile ? windowWidth * 0.8 : Math.min(windowWidth * 0.35, 500);
        const midW = isMobile ? windowWidth : windowWidth * 0.4;
        const midH = isMobile ? windowHeight : startH * 1.3;
        
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
          if (detailsBlock) {
             detailsBlock.style.opacity = '0';
             detailsBlock.style.pointerEvents = 'none';
          }

        } else {
          const growP = (progress - 0.15) / 0.75;
          currentW = midW + (windowWidth - midW) * growP;
          currentH = midH + (windowHeight - midH) * growP;
          radius = 16 * (1 - growP);

          if (imgCard) imgCard.style.opacity = '0';
          if (imgBg) imgBg.style.opacity = '1';

          let layer1Opacity = 0;
          if (progress < 0.25) {
             layer1Opacity = (progress - 0.15) / 0.10;
          } else if (progress < 0.55) {
             layer1Opacity = 1;
          } else {
             layer1Opacity = 1 - ((progress - 0.55) / 0.10);
          }
          
          if (revealSource) {
            revealSource.style.opacity = Math.max(0, Math.min(layer1Opacity, 1)).toString();
            revealSource.style.pointerEvents = layer1Opacity <= 0.1 ? 'none' : 'auto';
          }

          const allWords = revealSource?.querySelectorAll('.word') || [];
          if (progress >= 0.2 && progress < 0.50) {
            const readP = (progress - 0.2) / 0.30;
            const activeCount = Math.floor(readP * allWords.length);
            allWords.forEach((word, idx) => {
              if (idx <= activeCount) word.classList.add('active');
              else word.classList.remove('active');
            });
          } else if (progress >= 0.50) {
            allWords.forEach(word => word.classList.add('active'));
          } else {
            allWords.forEach(word => word.classList.remove('active'));
          }

          let layer2Opacity = 0;
          if (progress > 0.60) {
             layer2Opacity = (progress - 0.60) / 0.15;
          }
          
          if (detailsBlock) {
              const finalOp = Math.max(0, Math.min(layer2Opacity, 1));
              detailsBlock.style.opacity = finalOp.toString();
              detailsBlock.style.pointerEvents = finalOp > 0.5 ? 'auto' : 'none';
          }

          if (heroOverlay) heroOverlay.style.opacity = (growP * 0.6).toString();
        }

        seamlessHero.style.width = `${currentW}px`;
        seamlessHero.style.height = `${currentH}px`;
        seamlessHero.style.borderRadius = `${radius}px`;
      }

      if (contactBubble) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) contactBubble.classList.add('expanded');
        else contactBubble.classList.remove('expanded');
      }

      updateTextWave();
      requestAnimationFrame(animateLoop);
    };

    const startAnim = requestAnimationFrame(animateLoop);
    return () => {
      cancelAnimationFrame(startAnim);
      if (lenis) lenis.destroy();
    };
  }, [isLoading]);

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
    // 🟢 已經將 AI 區塊換成 gundam 影片
    'ai': { type: 'local_vid', src: "/images/AI_optimized/gundam.mp4" }
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
        /* HTML/Body Setup */
        html, body { 
          background-color: #000 !important; 
          margin: 0; 
          padding: 0; 
          overflow-x: hidden;
        }

        .main-content-wrapper { 
          opacity: 0 !important; 
          visibility: hidden !important; 
          transition: opacity 1s ease-in-out, visibility 1s; 
        }
        .main-content-wrapper.loaded { 
          opacity: 1 !important; 
          visibility: visible !important; 
        }

        /* PERFORMANCE & RESET */
        * { box-sizing: border-box; }
        body { color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); min-height: 100vh; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-stopped { overflow: hidden; }
        
        .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 9999; transition: opacity 0.8s ease-in-out; pointer-events: none; display: flex; align-items: center; justify-content: center; }
        .preloader.hidden { opacity: 0; }
        .loader { width: 48px; height: 48px; border: 3px solid rgba(244, 208, 63, 0.2); border-radius: 50%; display: inline-block; position: relative; box-sizing: border-box; animation: rotation 1s linear infinite; }
        .loader::after { content: ''; box-sizing: border-box; position: absolute; left: 0; top: 0; background: #F4D03F; width: 12px; height: 12px; transform: translate(-50%, 50%); border-radius: 50%; }
        @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* NAVBAR & HERO ... */
        .smart-nav { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); padding: 0 30px; display: flex; align-items: center; justify-content: space-between; z-index: 2000; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: auto; min-width: 450px; height: 60px; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); overflow: hidden; cursor: pointer; }
        .nav-header { display: contents; }
        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: auto; cursor: pointer; order: 1; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; opacity: 1; max-width: 900px; order: 2; margin: 0 40px; }
        .nav-item { text-decoration: none; color: #ccc; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; position: relative; }
        .nav-item:hover, .nav-item.active { color: #F4D03F; }
        .menu-icon { width: 24px; height: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer; pointer-events: none; z-index: 2005; order: 3; margin-left: 0; }
        .menu-line { width: 100%; height: 1px; background-color: #fff; transition: all 0.3s ease; transform-origin: center; }
        .menu-icon.open .menu-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .menu-icon.open .menu-line:nth-child(2) { opacity: 0; }
        .menu-icon.open .menu-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        @media (min-width: 769px) {
            .smart-nav:hover, .smart-nav.force-expand { min-width: 650px !important; background: rgba(255, 255, 255, 0.1) !important; padding: 0 30px !important; } 
            .smart-nav:hover .nav-links, .smart-nav.force-expand .nav-links { max-width: 900px !important; opacity: 1 !important; gap: 25px !important; pointer-events: auto !important; display: flex !important; } 
        }
        .smart-nav.collapsed { min-width: 150px; background: rgba(255, 255, 255, 0.05); padding: 0 20px; } 
        .smart-nav.collapsed .nav-links { max-width: 0; opacity: 0; gap: 0; pointer-events: none; } 
        .smart-nav.collapsed .nav-logo { margin-right: 10px; } 
        .smart-nav.collapsed .menu-icon { margin-left: 0; }

        .mobile-menu-overlay { display: none; }

        /* 🔴 完璧補回：INTRO SECTION 專屬 CSS，確保絕對置中 */
        .intro-section { height: 100vh; width: 100%; position: relative; overflow: hidden; margin-bottom: 0; z-index: 10; }
        .intro-text { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 50; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; pointer-events: none; will-change: opacity, transform, color; }
        .main-title { font-size: 8vw; font-weight: 900; margin: 0 0 20px 0; letter-spacing: -2px; line-height: 1; color: #F4D03F; transition: color 0.1s linear; white-space: nowrap; }
        .subtitle { font-size: 1.5vw; font-weight: 400; line-height: 1.4; max-width: 800px; color: #F4D03F; opacity: 0; transform: translateY(20px); transition: all 1s ease; }
        .subtitle.visible { opacity: 1; transform: translateY(0); }
        .char-span, .sub-char { display: inline-block; will-change: transform, opacity, filter, color; }

        .seamless-hero { 
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
          width: 25vw; height: 35vw; max-width: 350px; max-height: 500px; 
          border-radius: 16px; z-index: 5; overflow: hidden; 
          box-shadow: 0 30px 60px rgba(0,0,0,0.6); 
          opacity: 0; visibility: hidden;
          will-change: width, height, border-radius, opacity; 
        }
        .main-content-wrapper.loaded .seamless-hero { visibility: visible; }

        .hero-inner-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: none; }
        .img-bg { z-index: 1; opacity: 0; }
        .img-card { z-index: 2; opacity: 1; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 3; opacity: 0; pointer-events: none; }
        .about-track { height: 300vh; position: relative; z-index: 10; margin-top: -10vh; }
        .about-sticky-view { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; display: flex; align-items: center; padding: 0 5vw; box-sizing: border-box; background: transparent; pointer-events: none; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; width: 100%; height: 100%; align-items: center; position: relative; z-index: 2; }
        .card-target-left { width: 100%; aspect-ratio: 0.7; position: relative; visibility: hidden; } 
        .text-container { position: relative; height: auto; min-height: 400px; display: flex; align-items: center; justify-content: center; pointer-events: auto; }
        
        .text-layer-1 { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; text-align: center; font-size: 3.5vw; font-weight: 800; line-height: 1.2; letter-spacing: -1px; opacity: 0; z-index: 120; color: #fff; }
        .word { display: inline-block; opacity: 0.1; transition: opacity 0.5s ease; white-space: pre-wrap; }
        .word.active { opacity: 1; }
        
        .text-layer-2 { 
            position: fixed; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%); 
            width: 80%;
            max-width: 900px; 
            opacity: 0; 
            text-align: left; 
            z-index: 121;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center; 
        }
        
        .details-text { font-size: 2vw; line-height: 1.4; font-weight: 400; color: #ddd; margin-bottom: 40px; text-align: center; width: 100%; }
        
        .experience-list { width: 100%; max-width: 800px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; }
        
        .experience-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-end;
            padding: 15px 0; 
            border-bottom: 1px solid rgba(255,255,255,0.05); 
        }
        .exp-left { display: flex; flex-direction: column; gap: 4px; text-align: left; }
        
        .exp-date { font-size: 13px; color: #F4D03F; text-transform: uppercase; letter-spacing: 1px; }
        .exp-role { font-size: 18px; color: #fff; font-weight: 500; }
        .exp-company { font-size: 16px; color: #F4D03F; font-weight: 600; text-align: right; }
        
        .headline-accent { font-family: 'Times New Roman', serif; font-style: italic; }

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
        .gallery-wrapper { position: relative; width: 100%; z-index: 200; background: #050505; box-shadow: 0 -50px 100px rgba(0,0,0,1); }
        .hero-section { width: 100%; height: 70vh; position: relative; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; background: #050505; cursor: pointer; }
        .hero-img-wrapper { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        
        /* 🔴 1. 更新 Hover 動畫效果 (Non-hover 0.95 opacity) */
        .hero-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease, filter 0.5s ease, opacity 0.5s ease; }
        /* 預設: 0.95 Opacity */
        .hero-img.static-thumb { opacity: 0.95; transform: scale(1); filter: grayscale(20%); }
        /* Hover: 全彩變亮 (1 Opacity) */
        .hero-section:hover .hero-img.static-thumb { opacity: 1; transform: scale(1.05); filter: grayscale(0%); }
        
        /* 預設: Category Name 顯示 */
        .hero-category-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 8vw; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; color: #fff; text-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 20; pointer-events: none; text-align: center; width: 100%; opacity: 1; transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        /* Hover: Category Name 消失 */
        .hero-section:hover .hero-category-label { opacity: 0; }

        .yt-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; }
        
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
        
        .contact-link { color: #ccc; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 1px; display: flex; align-items: center; transition: all 0.3s; }
        .contact-link:hover { color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.6); }
        
        .contact-link span.label { font-size: 9px; text-transform: uppercase; color: #F4D03F; margin-right: 10px; width: 60px; font-weight: 700; }

        @media (max-width: 768px) {
            .about-grid { display: block !important; }
            .card-target-left { display: none !important; }
            .hero-category-label { opacity: 1 !important; transform: translate(-50%, -50%) !important; color: #fff; }
            .smart-nav { flex-direction: column !important; align-items: flex-start !important; width: 90% !important; max-width: 350px !important; height: 60px; overflow: hidden; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); min-width: 0 !important; }
            .smart-nav.mobile-active { position: fixed !important; top: 0 !important; left: 0 !important; transform: none !important; width: 100vw !important; max-width: none !important; height: 100vh !important; border-radius: 0 !important; background: #000 !important; border: none !important; padding: 30px !important; justify-content: flex-start !important; align-items: center !important; z-index: 9000 !important; }
            .nav-header { display: flex !important; width: 100%; justify-content: space-between; align-items: center; height: 60px; flex-shrink: 0; }
            .nav-logo { order: unset; margin-right: 0; }
            .menu-icon { order: unset; }
            .nav-links { display: flex !important; flex-direction: column !important; width: 100% !important; opacity: 0; transform: translateY(20px); transition: all 0.4s ease 0.1s; pointer-events: none; margin-top: 0; height: 100%; justify-content: center; align-items: center; gap: 40px !important; order: unset; margin: 0; }
            .smart-nav.mobile-active .nav-links { opacity: 1 !important; transform: translateY(0) !important; pointer-events: auto !important; visibility: visible !important; }
            .nav-item { font-size: 28px !important; font-weight: 700 !important; letter-spacing: 2px !important; }
            
            /* 🔴 補回 Mobile 的字體大小 */
            .main-title { font-size: 13vw; }
            .subtitle { font-size: 16px; padding: 0 20px; }
            .intro-text { position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; width: 100% !important; padding: 0 20px; }

            .text-container { height: 100vh !important; display: flex !important; align-items: center !important; justify-content: center !important; width: 100% !important; padding: 0 20px; }
            .text-layer-1 { font-size: 28px; width: 90%; line-height: 1.3; }
            
            .text-layer-2 { position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; width: 100% !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; text-align: center !important; padding: 0 20px !important; pointer-events: none; }
            
            .details-text { font-size: 16px; line-height: 1.5; color: #eee; text-align: center !important; margin-bottom: 20px; width: 100%; }
            .experience-list { text-align: left; display: inline-block; margin-top: 10px; width: 100%; max-width: 100% !important; }
            
            .experience-item { flex-direction: column; align-items: center; text-align: center; gap: 5px; }
            .exp-left { align-items: center; text-align: center; }
            .exp-company { text-align: center; margin-top: 5px; }
            
            .contact-content { flex-direction: column !important; gap: 30px; }
            .contact-content.shift-layout { gap: 40px; transform: translate(-50%, -60%); }
            .contact-title { font-size: 15vw; white-space: normal; text-align: center; }
            .vertical-line { width: 1px; height: 40px !important; margin: 20px 0 !important; }
            .contact-content.shift-layout .vertical-line { height: 60px !important; }
            .qr-container { transform: translateY(20px); }
            .contact-content.shift-layout .qr-container { width: 150px; transform: translateY(0); }
        }
      `}</style>

      {/* Preloader */}
      <div className={`preloader ${!isLoading ? 'hidden' : ''}`}>
          <span className="loader"></span>
      </div>

      <div className={`main-content-wrapper ${!isLoading ? 'loaded' : ''}`}>
          
          <nav className="smart-nav" id="navbar" onClick={toggleMenu}>
            <div className="nav-header">
                <Link href="/" className="nav-logo">SAM CHOW.</Link>
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
              {/* 原汁原味嘅 HTML，完全交比 JS 去𠝹字同飛散 */}
              <h1 className="main-title">SAM CHOW.</h1>
              <div className="subtitle">MultiMedia Designer &nbsp;|&nbsp; Work Portfolio</div>
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
                    
                    <div className="experience-list">
                        
                        <div className="experience-item">
                            <div className="exp-left">
                                <span className="exp-date">Aug 2025 - Now</span>
                                <span className="exp-role">Senior Graphic Designer</span>
                            </div>
                            <div className="exp-company">RFI (Asia) Limited</div>
                        </div>

                        <div className="experience-item">
                            <div className="exp-left">
                                <span className="exp-date">Jan 2025 - July 2025</span>
                                <span className="exp-role">Senior Creative & Multimedia Designer</span>
                            </div>
                            <div className="exp-company">Pontac Digital Limited</div>
                        </div>

                        <div className="experience-item">
                            <div className="exp-left">
                                <span className="exp-date">Aug 2022 - Dec 2024</span>
                                <span className="exp-role">Creative & Multimedia Designer</span>
                            </div>
                            <div className="exp-company">Pontac Digital Limited</div>
                        </div>

                    </div>
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
                    <div className="hero-img-wrapper">
                        {data?.type === 'yt' ? (
                            <>
                                {/* YT 縮圖設定維持 0.95 */}
                                <img src={`https://img.youtube.com/vi/${data.id}/maxresdefault.jpg`} className="hero-img static-thumb yt-thumb" style={activeYt === cat.id ? { opacity: 0 } : {}} alt="YT Cover" />
                                <div className="yt-container">
                                    {activeYt === cat.id && (
                                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${data.id}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0`} title="YouTube video player" frameBorder="0" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}></iframe>
                                    )}
                                </div>
                            </>
                        ) : data?.type === 'local_vid' ? (
                            /* 🟢 支援本地影片全螢幕，直接套用 static-thumb 動畫 */
                            <video 
                                src={data.src} 
                                className="hero-img static-thumb" 
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                            />
                        ) : (
                            <img src={data?.src || '/images/placeholder.jpg'} className="hero-img static-thumb" alt={`${cat.label} Cover`} />
                        )}
                    </div>
                    <div className="hero-category-label">{cat.label}</div>
                    </div>
                </Link>
              );
            })}

            <div className="hero-section" id="contact-section" style={{ background: '#080808', cursor: 'default' }}>
                <div className="hero-img-wrapper">
                    <img src="/images/contact_bg.jpg" className="hero-img" style={{ filter: 'grayscale(100%) brightness(0.4)', opacity: 0.3 }} alt="Contact BG" />
                </div>
                <div className="contact-content" id="contact-content-wrapper">
                    <div className="contact-title" id="lets-create-text">Let's Create.</div>
                    <div className="vertical-line"></div>
                    <div className="qr-container" id="qr-target">
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
                <a href="https://wa.me/85267012420" target="_blank" className="contact-link"><span className="label">WHATSAPP</span>6701 2420</a>
                <a href="mailto:chowfh254281@gmail.com" className="contact-link"><span className="label">MAIL</span>chowfh254281@gmail.com</a>
            </div>
          </div>

      </div>
    </>
  );
}
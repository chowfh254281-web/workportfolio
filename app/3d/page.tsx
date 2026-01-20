'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script'; 

// 1. 全域類型宣告
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'environment-image'?: string;
        exposure?: string;
        'shadow-intensity'?: string;
        'auto-rotate'?: boolean;
        'rotation-per-second'?: string;
      }, HTMLElement>;
    }
  }
}

export default function ThreeDPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const prodRef = useRef<HTMLDivElement>(null);
  const modelsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ueRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const freshRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const ueHeaderRef = useRef<HTMLDivElement>(null);
  const ueGalleryRef = useRef<HTMLDivElement>(null);
  const liveHeaderRef = useRef<HTMLDivElement>(null);
  const liveGalleryRef = useRef<HTMLDivElement>(null);
  const freshGalleryRef = useRef<HTMLDivElement>(null);
  const revealTextRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let lenis: any;
    let animationFrameId: number;

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

    const splitTextIntoSpans = (element: HTMLElement) => {
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
            } 
            else if (node.nodeType === 1) { 
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
    };

    if (revealTextRef.current) splitTextIntoSpans(revealTextRef.current);
    const allWords = revealTextRef.current?.querySelectorAll('.word') || [];

    setTimeout(() => { 
        const prodCards = document.querySelectorAll('.production-group .video-card');
        prodCards.forEach((card: any) => { 
            card.style.animation = 'none'; 
            card.style.opacity = '1';        
            card.style.transform = 'translateY(0)'; 
        }); 
    }, 1900);

    const animate = () => {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        if (scrollPromptRef.current) {
            if (scrollY > 50) scrollPromptRef.current.classList.add('hide'); 
            else scrollPromptRef.current.classList.remove('hide');
        }

        if (trackRef.current) {
            const trackRect = trackRef.current.getBoundingClientRect();
            const totalDistance = trackRect.height - windowHeight;
            let progress = 0;
            if (trackRect.top <= 0) progress = Math.abs(trackRect.top) / totalDistance;
            progress = Math.max(0, Math.min(progress, 1));

            const cgHero = heroRef.current;
            const productionSection = prodRef.current;
            const header = headerRef.current;
            const layerUE = ueRef.current;
            const ueHeader = ueHeaderRef.current;
            const ueGallery = ueGalleryRef.current;
            const layerLive = liveRef.current;
            const liveHeader = liveHeaderRef.current;
            const liveGallery = liveGalleryRef.current;
            const layerFresh = freshRef.current;
            const freshGallery = freshGalleryRef.current;
            const layerModels = modelsRef.current;
            const layerText = textRef.current;

            if (cgHero && productionSection && header && layerUE && ueHeader && ueGallery && layerLive && liveHeader && liveGallery && layerFresh && freshGallery && layerModels && layerText) {
                
                if (progress < 0.15) {
                    const exitP = progress / 0.15;
                    cgHero.style.transform = `translate(-50%, calc(-50% - ${exitP * 100}vh))`; 
                    header.style.transform = `translateY(-${exitP * 50}vh)`;
                    
                    if (progress > 0.1) {
                        const entryP = (progress - 0.1) / 0.05;
                        productionSection.style.opacity = entryP.toString();
                        productionSection.style.transform = `translate(-50%, calc(-50% + ${(1-entryP)*100}px))`;
                    } else {
                        productionSection.style.opacity = '0';
                    }
                } 
                else if (progress >= 0.15 && progress < 0.30) {
                    cgHero.style.transform = `translate(-50%, -150vh)`; 
                    
                    if (progress < 0.25) {
                        productionSection.style.opacity = '1';
                        productionSection.style.transform = `translate(-50%, -50%)`;
                    } else {
                        const exitP = (progress - 0.25) / 0.05;
                        productionSection.style.opacity = (1 - exitP).toString();
                        productionSection.style.transform = `translate(-50%, calc(-50% - ${exitP*100}px))`;
                    }
                    layerUE.style.opacity = '0';
                }
                else if (progress >= 0.30 && progress < 0.50) {
                    productionSection.style.opacity = '0';
                    
                    let ueOp = 0;
                    if (progress < 0.35) ueOp = (progress - 0.30) / 0.05;
                    else if (progress < 0.45) ueOp = 1;
                    else ueOp = 1 - ((progress - 0.45) / 0.05);
                    
                    layerUE.style.opacity = Math.max(0, Math.min(ueOp, 1)).toString();
                    
                    if (progress < 0.45) {
                        layerUE.style.transform = `translateY(0)`;
                        if (progress > 0.30) {
                            const entryP = Math.min((progress - 0.30) / 0.10, 1);
                            ueHeader.style.transform = `translateY(${(1-entryP)*30}px)`;
                            ueGallery.style.transform = `translateY(${(1-entryP)*60}px)`;
                        }
                    } else {
                        const exitP = (progress - 0.45) / 0.05;
                        layerUE.style.transform = `translateY(-${exitP * 100}px)`;
                    }
                    layerLive.style.opacity = '0';
                }
                else if (progress >= 0.50 && progress < 0.70) {
                    layerUE.style.opacity = '0';
                    ueHeader.style.transform = `translateY(0)`;
                    ueGallery.style.transform = `translateY(0)`;

                    let liveOp = 0;
                    if (progress < 0.55) {
                        liveOp = (progress - 0.50) / 0.05;
                        layerLive.style.transform = `translateY(0)`;
                        liveHeader.style.transform = `translateY(${(1-liveOp)*30}px)`;
                        liveGallery.style.transform = `translateY(${(1-liveOp)*60}px)`;
                    }
                    else if (progress < 0.65) {
                        liveOp = 1;
                        layerLive.style.transform = `translateY(0)`;
                        liveHeader.style.transform = `translateY(0)`;
                        liveGallery.style.transform = `translateY(0)`;
                    }
                    else {
                        liveOp = 1 - ((progress - 0.65) / 0.05);
                        layerLive.style.transform = `translateY(-${(progress-0.65)*200}vh)`;
                    }
                    
                    layerLive.style.opacity = Math.max(0, Math.min(liveOp, 1)).toString();
                    layerFresh.style.opacity = '0';
                }
                else if (progress >= 0.70 && progress < 0.85) {
                    layerLive.style.opacity = '0';
                    
                    let freshOp = 0;
                    if (progress < 0.75) freshOp = (progress - 0.70) / 0.05;
                    else if (progress < 0.85) freshOp = 1; 
                    
                    layerFresh.style.opacity = freshOp.toString();

                    if (progress > 0.75) {
                        const galleryP = Math.min((progress - 0.75) / 0.05, 1);
                        freshGallery.style.opacity = galleryP.toString();
                        freshGallery.style.transform = `translateY(${(1-galleryP)*50}px)`;
                    } else {
                        freshGallery.style.opacity = '0';
                    }
                    
                    layerModels.style.opacity = '0';
                    layerText.style.opacity = '0';
                }
                else if (progress >= 0.85) {
                    const freshExit = 1 - Math.min((progress - 0.85) / 0.05, 1);
                    layerFresh.style.opacity = freshExit.toString();
                    
                    const modelOp = Math.min((progress - 0.85) / 0.05, 1);
                    layerModels.style.opacity = modelOp.toString();
                    layerText.style.opacity = modelOp.toString();
                    
                    if (progress > 0.90) {
                        const textEntry = Math.min((progress - 0.90) / 0.10, 1);
                        const wordsToActivate = Math.floor(textEntry * allWords.length);
                        allWords.forEach((word: any, index: number) => {
                            word.style.opacity = '';
                            if (index <= wordsToActivate) { 
                                word.classList.remove('dim'); 
                                word.classList.add('active'); 
                            } else { 
                                word.classList.remove('active'); 
                                word.classList.add('dim'); 
                            }
                        });
                    }
                }
            }
        }

        const contactBubble = document.getElementById('contact-bubble');
        if (contactBubble) {
            if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 50) {
                contactBubble.classList.add('expanded');
            } else {
                contactBubble.classList.remove('expanded');
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    };

    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    const toggleMenu = () => {
        if (window.innerWidth > 768) {
            navbar?.classList.toggle('force-expand');
        } else {
            mobileMenu?.classList.toggle('active');
            menuBtn?.classList.toggle('open');
        }
    };

    const handleScroll = () => {
        if (window.scrollY > 50) navbar?.classList.add('collapsed');
        else {
            navbar?.classList.remove('collapsed');
            navbar?.classList.remove('force-expand');
        }
    };

    menuBtn?.addEventListener('click', toggleMenu);
    window.addEventListener('scroll', handleScroll);

    animate();

    return () => {
        if (lenis) lenis.destroy();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        menuBtn?.removeEventListener('click', toggleMenu);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Load Model Viewer Script */}
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" strategy="lazyOnload" />

      {/* @ts-ignore */}
      <style jsx global>{`
        /* PERFORMANCE & RESET */
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); min-height: 100vh; overflow-x: hidden; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-stopped { overflow: hidden; }
        .noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; mix-blend-mode: overlay; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
        
        /* NAVBAR */
        .smart-nav { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); height: 60px; padding: 0 30px; display: flex; justify-content: space-between; align-items: center; z-index: 2000; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: auto; min-width: 450px; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: 30px; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; opacity: 1; max-width: 900px; }
        .nav-item { text-decoration: none; color: #ccc; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; position: relative; }
        .nav-item:hover, .nav-item.active { color: #F4D03F; }
        .menu-icon { width: 24px; height: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer; margin-left: 40px; }
        .menu-line { width: 100%; height: 1px; background-color: #fff; transition: width 0.3s ease; }
        .smart-nav.collapsed { min-width: 150px; background: rgba(255, 255, 255, 0.05); padding: 0 20px; } 
        .smart-nav.collapsed .nav-links { max-width: 0; opacity: 0; gap: 0; pointer-events: none; } 
        .smart-nav.collapsed .nav-logo { margin-right: 10px; } 
        .smart-nav.collapsed .menu-icon { margin-left: 0; }
        .smart-nav:hover, .smart-nav.force-expand { min-width: 500px !important; background: rgba(255, 255, 255, 0.1) !important; padding: 0 30px !important; } 
        .smart-nav:hover .nav-links, .smart-nav.force-expand .nav-links { max-width: 900px !important; opacity: 1 !important; gap: 25px !important; pointer-events: auto !important; display: flex !important; } 
        .mobile-menu-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 1500; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 30px; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; } .mobile-menu-overlay.active { opacity: 1; pointer-events: auto; }
        .mobile-link { font-size: 30px; font-weight: 700; color: #888; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; transform: translateY(20px); opacity: 0; transition: all 0.4s ease; } .mobile-link:hover { color: #fff; } .mobile-menu-overlay.active .mobile-link { transform: translateY(0); opacity: 1; }
        @media (max-width: 768px) { .nav-links { display: none !important; } .smart-nav { min-width: 0 !important; width: 90% !important; max-width: 350px; top: 20px; padding: 0 20px !important; } }
        
        /* TRACK */
        .sequence-track { height: 1300vh; position: relative; z-index: 10; }
        .sticky-viewport { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        
        /* HEADER */
        .header-content { text-align: center; width: 100%; position: absolute; top: 10%; left:0; z-index: 5; pointer-events: none; transition: opacity 0.5s ease; }
        h1.page-title { font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; color: #fff; opacity: 1; }
        .page-desc { margin-top: 20px; font-size: 16px; color: #888; max-width: 600px; display: inline-block; opacity: 1; }

        /* VIDEO CARDS */
        .video-card { width: 100%; height: 100%; border-radius: 8px; overflow: hidden; position: relative; background: #111; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        video { width: 100%; height: 100%; object-fit: cover; }
        .video-caption { position: absolute; bottom: 20px; left: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: rgba(255,255,255,0.9); z-index: 2; pointer-events: none; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
        .video-number { position: absolute; bottom: 10px; left: 15px; font-size: 80px; font-weight: 100; line-height: 1; color: transparent; -webkit-text-stroke: 1px rgba(255, 255, 255, 0.7); z-index: 3; pointer-events: none; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        .video-desc { position: absolute; top: 20px; left: 20px; font-size: 12px; font-weight: 700; letter-spacing: 2px; color: #fff; z-index: 3; pointer-events: none; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }

        /* HERO GALLERY */
        .cg-hero-section { position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); display: flex; justify-content: center; gap: 10px; width: 95vw; height: 50vh; z-index: 30; opacity: 1; }
        .hero-strip { flex: 1; height: 100%; transition: flex 0.4s cubic-bezier(0.22, 1, 0.36, 1); position: relative; }
        .hero-strip:hover { flex: 1.5; }

        /* PRODUCTION */
        .production-section { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px; z-index: 20; width: 100%; opacity: 0; }
        .section-title { font-size: 1.5vw; font-weight: 700; letter-spacing: 4px; color: #fff; text-transform: uppercase; margin: 0; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .production-group { display: flex; gap: 2vw; width: auto; }
        .prod-card-wrap { width: 25vw; aspect-ratio: 9/16; }

        /* MODELS */
        .layer-models { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; display: flex; justify-content: space-between; align-items: center; padding: 0 5%; opacity: 0; transition: opacity 0.8s ease; }
        .model-container { width: 25vw; height: 60vh; position: relative; pointer-events: auto; }
        .model-container:nth-child(1) { margin-top: 15vh; } .model-container:nth-child(2) { margin-top: -15vh; }
        model-viewer { width: 100%; height: 100%; --poster-color: transparent; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.6)); }

        .layer-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; text-align: center; z-index: 10; pointer-events: none; opacity: 0; }
        .reveal-text { font-size: 5vw; font-weight: 800; line-height: 1.2; letter-spacing: -1px; color: #fff; }
        .word { display: inline-block; opacity: 0; transition: opacity 0.3s ease; white-space: pre-wrap; }
        .word.active { opacity: 1 !important; } .word.dim { opacity: 0.1 !important; }
        .headline-accent { font-family: 'Times New Roman', serif; font-style: italic; color: #F4D03F; }

        /* UNREAL ENGINE */
        .layer-ue { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 15; pointer-events: none; opacity: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ue-header-group { text-align: center; margin-bottom: 4vh; }
        .ue-big-title { font-size: 5vw; font-weight: 900; letter-spacing: -1px; color: #fff; margin: 0; text-shadow: 0 0 50px rgba(255,255,255,0.2); line-height: 1.1; }
        .ue-small-subtitle { font-size: 1.2vw; font-weight: 700; letter-spacing: 4px; color: #F4D03F; text-transform: uppercase; margin-top: 15px; }
        .ue-gallery { display: grid; grid-template-columns: 1fr 1.8fr; grid-template-rows: 1fr 1fr; gap: 1.5vw; width: 85vw; height: 50vh; }
        .ue-col-left, .ue-col-right { display: contents; }
        .ue-col-left > .ue-img-wrapper:nth-child(1) { grid-column: 1; grid-row: 1; }
        .ue-col-left > .ue-img-wrapper:nth-child(2) { grid-column: 1; grid-row: 2; }
        .ue-col-right > .ue-img-wrapper { grid-column: 2; grid-row: 1 / span 2; height: 100%; }
        .ue-img-wrapper { position: relative; border-radius: 12px; overflow: hidden; background: #111; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .ue-img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .ue-col-right .ue-img-wrapper img { object-position: left center; }
        .ue-img-wrapper:hover img { transform: scale(1.05); }
        .ue-label { position: absolute; bottom: 20px; left: 20px; background: rgba(255,255,255,0.9); color: #000; padding: 6px 16px; border-radius: 30px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); pointer-events: auto; }

        /* LIVE SETUP */
        .layer-live { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 16; pointer-events: none; opacity: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .live-header-group { text-align: center; margin-bottom: 4vh; }
        .live-big-title { font-size: 5vw; font-weight: 900; letter-spacing: -1px; color: #fff; margin: 0; text-shadow: 0 0 50px rgba(255,255,255,0.2); line-height: 1.1; }
        .live-gallery { display: grid; grid-template-columns: 1fr 1.8fr; grid-template-rows: 1fr 1fr; gap: 1.5vw; width: 85vw; height: 50vh; }
        .live-col-left, .live-col-right { display: contents; }
        .live-col-left > .live-img-wrapper:nth-child(1) { grid-column: 1; grid-row: 1; }
        .live-col-left > .live-img-wrapper:nth-child(2) { grid-column: 1; grid-row: 2; }
        .live-col-right > .live-img-wrapper { grid-column: 2; grid-row: 1 / span 2; height: 100%; }
        .live-img-wrapper { position: relative; border-radius: 12px; overflow: hidden; background: #111; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .live-img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .live-img-wrapper:hover img { transform: scale(1.05); }
        .live-label { position: absolute; bottom: 20px; left: 20px; background: rgba(255,255,255,0.9); color: #000; padding: 6px 16px; border-radius: 30px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); pointer-events: auto; }

        /* FRESH METAVERSE GARDEN */
        .layer-fresh { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 17; pointer-events: none; opacity: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
        .fresh-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; filter: brightness(0.5); }
        .fresh-content { position: relative; z-index: 2; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 30px; }
        .fresh-title { font-size: 7vw; font-weight: 900; letter-spacing: -2px; color: #fff; margin: 0; text-shadow: 0 10px 30px rgba(0,0,0,0.5); line-height: 1; }
        .fresh-subtitle { font-size: 1.2vw; font-weight: 700; letter-spacing: 4px; color: #F4D03F; text-transform: uppercase; display: inline-block; background: rgba(0,0,0,0.3); padding: 5px 15px; border-radius: 20px; backdrop-filter: blur(5px); }
        .fresh-gallery { display: flex; gap: 20px; margin-top: 20px; opacity: 0; transform: translateY(50px); }
        .fresh-img-wrapper { width: 20vw; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: transform 0.3s ease; }
        .fresh-img-wrapper:hover { transform: scale(1.05); }
        .fresh-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }

        /* CONTACT WIDGET */
        .contact-widget { position: fixed; bottom: 30px; right: 30px; z-index: 2500; display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; padding: 6px; width: auto; max-width: 52px; height: 52px; box-sizing: border-box; overflow: hidden; transition: max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease, padding-right 0.6s ease; }
        .contact-widget:hover, .contact-widget.expanded { max-width: 380px; padding-right: 25px; background: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .contact-widget:hover .contact-details, .contact-widget.expanded .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }
        .contact-icon { width: 38px; height: 38px; background: #fff; color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .contact-details { opacity: 0; white-space: nowrap; margin-left: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; pointer-events: none; transition: opacity 0.3s ease 0.1s, margin-left 0.4s ease; }
        .contact-link { color: #ccc; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 1px; display: flex; align-items: center; transition: color 0.3s; }
        .contact-link:hover { color: #fff; }
        .contact-link span.label { font-size: 9px; text-transform: uppercase; color: #666; margin-right: 10px; width: 60px; font-weight: 700; }
        
        /* SCROLL PROMPT UI */
        .scroll-prompt { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 100; pointer-events: none; transition: opacity 0.5s ease, transform 0.5s ease; opacity: 1; }
        .scroll-prompt.hide { opacity: 0; transform: translate(-50%, 20px); }
        .scroll-text { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: rgba(255,255,255,0.4); text-transform: uppercase; }
        .scroll-line { width: 1px; height: 40px; background: rgba(255,255,255,0.1); position: relative; overflow: hidden; }
        .scroll-line::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, transparent, #fff, transparent); transform: translateY(-100%); animation: scrollFlow 2s cubic-bezier(0.77, 0, 0.175, 1) infinite; }
        @keyframes scrollFlow { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
      `}</style>

      <div className="noise-overlay"></div>
      
      <nav className="smart-nav" id="navbar">
        <Link href="/" className="nav-logo">SAM CHOW.</Link>
        <div className="nav-links">
          <Link href="/uiux" className="nav-item">UI/UX</Link>
          <Link href="/graphic" className="nav-item">Graphic</Link>
          <Link href="/3d" className="nav-item active">3D</Link>
          <Link href="/photography" className="nav-item">Photography</Link>
          <Link href="/video" className="nav-item">Video</Link>
          <Link href="/ai" className="nav-item">AI Generative</Link>
        </div>
        <div className="menu-icon" id="menu-btn">
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </div>
      </nav>

      <div className="mobile-menu-overlay" id="mobile-menu">
        <Link href="/uiux" className="mobile-link">UI/UX</Link>
        <Link href="/graphic" className="mobile-link">Graphic</Link>
        <Link href="/3d" className="mobile-link">3D</Link>
        <Link href="/photography" className="mobile-link">Photography</Link>
        <Link href="/video" className="mobile-link">Video</Link>
        <Link href="/ai" className="mobile-link">AI Generative</Link>
      </div>

      <div className="sequence-track" id="sequence-track" ref={trackRef}>
        <div className="sticky-viewport">
            
            <div className="header-content" id="main-header" ref={headerRef}>
                <h1 className="page-title">3D VISUAL</h1>
                <div className="page-desc">Motion graphics, simulations, and rendered realities.</div>
            </div>

            <div className="cg-hero-section" id="cg-hero" ref={heroRef}>
                <div className="hero-strip"><div className="video-card"><video src="/images/3dvideo/Kiehls Sogo.mp4" autoPlay loop muted playsInline></video><div className="video-caption">KIEHLS SOGO</div></div></div>
                <div className="hero-strip"><div className="video-card"><video src="/images/3dvideo/Kiehls Taxi.mp4" autoPlay loop muted playsInline></video><div className="video-caption">KIEHLS TAXI</div></div></div>
                <div className="hero-strip"><div className="video-card"><video src="/images/3dvideo/valentino mock.mp4" autoPlay loop muted playsInline></video><div className="video-caption">VALENTINO 2</div></div></div>
                <div className="hero-strip"><div className="video-card"><video src="/images/3dvideo/valentino mock (2).mp4" autoPlay loop muted playsInline></video><div className="video-caption">VALENTINO 1</div></div></div>
                <div className="hero-strip"><div className="video-card"><video src="/images/3dvideo/L'Oreal Paris.mp4" autoPlay loop muted playsInline></video><div className="video-caption">L'OREAL</div></div></div>
            </div>

            <div className="production-section" id="production-section" ref={prodRef}>
                <h2 className="section-title">CGI PRODUCTION</h2>
                <div className="production-group">
                    <div className="prod-card-wrap">
                        <div className="video-card"><video src="/images/3dvideo/sogofootage.mov" autoPlay loop muted playsInline></video>
                        <div className="video-desc">FOOTAGE</div><div className="video-number">01</div></div>
                    </div>
                    <div className="prod-card-wrap">
                        <div className="video-card"><video src="/images/3dvideo/flower test10650-0849.mp4" autoPlay loop muted playsInline></video>
                        <div className="video-desc">PRODUCTION</div><div className="video-number">02</div></div>
                    </div>
                    <div className="prod-card-wrap">
                        <div className="video-card"><video src="/images/3dvideo/CGIWorkbench.mp4" autoPlay loop muted playsInline></video>
                        <div className="video-desc">COMPOSITION</div><div className="video-number">03</div></div>
                    </div>
                </div>
            </div>

            <div className="layer-ue" id="layer-ue" ref={ueRef}>
                <div className="ue-header-group" id="ue-header" ref={ueHeaderRef}>
                    <h2 className="ue-big-title">SheShido XR Immersive wall Production</h2>
                    <div className="ue-small-subtitle">Unreal Engine</div>
                </div>
                <div className="ue-gallery" id="ue-gallery" ref={ueGalleryRef}>
                    <div className="ue-col-left">
                        <div className="ue-img-wrapper"><img src="/images/sitevisit1.png" alt="Site Visit 1" /><div className="ue-label">Site Visit</div></div>
                        <div className="ue-img-wrapper"><img src="/images/sitevisit2.png" alt="Site Visit 2" /></div>
                    </div>
                    <div className="ue-col-right">
                        <div className="ue-img-wrapper"><img src="/images/unreal1.png" alt="3D Development" /><div className="ue-label">3D Development</div></div>
                    </div>
                </div>
            </div>

            <div className="layer-live" id="layer-live" ref={liveRef}>
                <div className="live-header-group" id="live-header" ref={liveHeaderRef}>
                     <h2 className="live-big-title">LIVE SETUP</h2>
                </div>
                <div className="live-gallery" id="live-gallery" ref={liveGalleryRef}>
                    <div className="live-col-left">
                        <div className="live-img-wrapper"><img src="/images/live1.png" alt="Live 1" /><div className="live-label">On Site Setup</div></div>
                        <div className="live-img-wrapper"><img src="/images/live3.png" alt="Live 3" /></div>
                    </div>
                    <div className="live-col-right">
                        <div className="live-img-wrapper"><img src="/images/live2.png" alt="Live 2" /><div className="live-label">Perspective view LED Wall</div></div>
                    </div>
                </div>
            </div>

            <div className="layer-fresh" id="layer-fresh" ref={freshRef}>
                <img src="/images/freshgarden.png" alt="Fresh Garden" className="fresh-bg" />
                <div className="fresh-content">
                    <h2 className="fresh-title">Fresh Metaverse Garden</h2>
                    <div className="fresh-subtitle">BLENDER</div>
                    <div className="fresh-gallery" id="fresh-gallery" ref={freshGalleryRef}>
                        <div className="fresh-img-wrapper"><img src="/images/freshblack.png" alt="Fresh Black" /></div>
                        <div className="fresh-img-wrapper"><img src="/images/freshcombucha.png" alt="Fresh Combucha" /></div>
                        <div className="fresh-img-wrapper"><img src="/images/freshtea.png" alt="Fresh Tea" /></div>
                    </div>
                </div>
            </div>

            <div className="layer-models" id="layer-models" ref={modelsRef} suppressHydrationWarning>
                {/* 3. 確保只在客戶端渲染 3D 模型 */}
                {isMounted && (
                    <>
                        {/* @ts-ignore */}
                        <div className="model-container"><model-viewer src="/images/3d_models/all%20hours_product.glb" environment-image="/images/3d_models/studio_lighting.hdr" exposure="1.2" shadow-intensity="1" auto-rotate rotation-per-second="15deg"></model-viewer></div>
                        {/* @ts-ignore */}
                        {/* 4. 修正路徑: 空格轉 %20 且指向正確的 3d_models 資料夾 */}
                        <div className="model-container"><model-viewer src="/images/3d_models/Black%20Tea%206%20.glb" environment-image="/images/3d_models/studio_lighting.hdr" exposure="1.2" shadow-intensity="1" auto-rotate rotation-per-second="-15deg"></model-viewer></div>
                    </>
                )}
            </div>
            <div className="layer-text" id="layer-text" ref={textRef}>
                <div className="reveal-text" id="reveal-text" ref={revealTextRef}>I imagine. I create. Using <span className="headline-accent">3D software</span> to construct imaginary worlds.</div>
            </div>

        </div>
    </div>

    <div className="scroll-prompt" id="scroll-prompt" ref={scrollPromptRef}>
        <div className="scroll-text">SCROLL</div>
        <div className="scroll-line"></div>
    </div>

    <div className="contact-widget" id="contact-bubble">
        <div className="contact-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
        <div className="contact-details">
            <a href="https://wa.me/85267012420" target="_blank" className="contact-link" style={{ color: '#fff' }}><span className="label">WA</span>+852 6701 2420</a>
            <a href="mailto:chowfh254281@gmail.com" className="contact-link" style={{ color: '#fff' }}><span className="label">MAIL</span>chowfh254281@gmail.com</a>
        </div>
    </div>
    </>
  );
}
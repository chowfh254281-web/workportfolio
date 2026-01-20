'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function UiuxPage() {
  // 1. 新增 Loading 狀態 (Preloader)
  const [isLoading, setIsLoading] = useState(true);

  // Refs for drag containers
  const galleryRef = useRef<HTMLDivElement>(null);
  const minigameRef = useRef<HTMLDivElement>(null);
  const christmasRef = useRef<HTMLDivElement>(null);
  const kenzoRef = useRef<HTMLDivElement>(null);

  // Refs for Observer targets
  const kiehlsRef = useRef<HTMLDivElement>(null);
  const clarinsGameRef = useRef<HTMLDivElement>(null);
  const christmasSectionRef = useRef<HTMLDivElement>(null);
  const kenzoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 設定 Preloader Timer (0.5秒後淡出)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    let lenis: any;

    // 1. Initialize Lenis Smooth Scroll
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

    // 2. Drag to Scroll Logic
    const enableDrag = (slider: HTMLDivElement | null) => {
      if (!slider) return;
      let isDown = false;
      let startX: number;
      let scrollLeft: number;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      };
      const onMouseLeave = () => {
        isDown = false;
        slider.style.cursor = 'grab';
      };
      const onMouseUp = () => {
        isDown = false;
        slider.style.cursor = 'grab';
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2.5;
        slider.scrollLeft = scrollLeft - walk;
      };

      slider.addEventListener('mousedown', onMouseDown);
      slider.addEventListener('mouseleave', onMouseLeave);
      slider.addEventListener('mouseup', onMouseUp);
      slider.addEventListener('mousemove', onMouseMove);

      return () => {
        slider.removeEventListener('mousedown', onMouseDown);
        slider.removeEventListener('mouseleave', onMouseLeave);
        slider.removeEventListener('mouseup', onMouseUp);
        slider.removeEventListener('mousemove', onMouseMove);
      };
    };

    const cleanupGallery = enableDrag(galleryRef.current);
    const cleanupMinigame = enableDrag(minigameRef.current);
    const cleanupChristmas = enableDrag(christmasRef.current);
    const cleanupKenzo = enableDrag(kenzoRef.current);

    // 3. Center Gallery on Load
    const centerSection = (slider: HTMLDivElement | null, stripClass: string) => {
      if (slider) {
        const strip = slider.querySelector(stripClass);
        if (strip) {
          const centerPos = (strip.scrollWidth - slider.clientWidth) / 2;
          slider.scrollTo({ left: centerPos, behavior: 'smooth' });
        }
      }
    };
    setTimeout(() => {
        centerSection(galleryRef.current, '.uiux-strip');
        centerSection(minigameRef.current, '.clarins-minigame-strip');
        centerSection(christmasRef.current, '.christmas-strip');
        centerSection(kenzoRef.current, '.kenzo-strip');
    }, 500);


    // 4. Intersection Observer for Fade-In
    const observerCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (target === kiehlsRef.current) {
                const items = target.querySelectorAll('.kiehls-static-item');
                items.forEach((item) => item.classList.add('visible'));
                observer.unobserve(target);
            }
            if (target === clarinsGameRef.current) {
                const items = target.querySelectorAll('.clarins-minigame-item');
                items.forEach((item) => item.classList.add('visible'));
                observer.unobserve(target);
            }
            if (target === christmasSectionRef.current) {
                const items = target.querySelectorAll('.christmas-item');
                items.forEach((item) => item.classList.add('visible'));
                observer.unobserve(target);
            }
            if (target === kenzoSectionRef.current) {
                const items = target.querySelectorAll('.kenzo-item');
                items.forEach((item) => item.classList.add('visible'));
                observer.unobserve(target);
            }
        }
      });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, { threshold: 0.25 });

    if (kiehlsRef.current) scrollObserver.observe(kiehlsRef.current);
    if (clarinsGameRef.current) scrollObserver.observe(clarinsGameRef.current);
    if (christmasSectionRef.current) scrollObserver.observe(christmasSectionRef.current);
    if (kenzoSectionRef.current) scrollObserver.observe(kenzoSectionRef.current);

    // Navbar Logic
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

    return () => {
      clearTimeout(timer); // Cleanup timer
      if (lenis) lenis.destroy();
      cleanupGallery && cleanupGallery();
      cleanupMinigame && cleanupMinigame();
      cleanupChristmas && cleanupChristmas();
      cleanupKenzo && cleanupKenzo();
      scrollObserver.disconnect();
      menuBtn?.removeEventListener('click', toggleMenu);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* PERFORMANCE & RESET */
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); min-height: 100vh; overflow-x: hidden; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-stopped { overflow: hidden; }
        .noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; mix-blend-mode: overlay; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
        
        /* Preloader */
        .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 9999; transition: opacity 0.8s ease-in-out; pointer-events: none; }
        .preloader.hidden { opacity: 0; }

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
        
        /* HEADER */
        .header-section { padding: 220px 40px 80px 40px; text-align: center; position: relative; z-index: 10; }
        h1.page-title { font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.2s; color: #fff; }
        .page-desc { margin-top: 20px; font-size: 16px; color: #888; max-width: 600px; display: inline-block; opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.4s; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

        /* SCROLL CONTAINER */
        .scroll-container { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none; cursor: grab; user-select: none; display: flex; align-items: center; justify-content: flex-start; }
        .scroll-container:active { cursor: grabbing; }
        .scroll-container::-webkit-scrollbar { display: none; }

        /* UIUX SHOWCASE */
        .uiux-showcase { width: 100%; height: 100vh; min-height: 600px; position: relative; margin-bottom: 0; opacity: 0; animation: fadeInShowcase 1.5s ease forwards 0.6s; background-image: url('/images/uiux/sheshido_bg.png'); background-size: cover; background-position: center; background-repeat: no-repeat; display: flex; align-items: center; }
        .uiux-strip { display: flex; gap: 40px; padding: 20px 5vw; height: 70vh; align-items: center; width: max-content; pointer-events: none; }
        .uiux-strip-item { aspect-ratio: 9/19.5; height: 100%; flex-shrink: 0; position: relative; border-radius: 20px; overflow: hidden; background: #000; box-shadow: none; margin: 20px 0; transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); pointer-events: auto; animation: floatVertical 6s ease-in-out infinite; }
        .uiux-strip-item:nth-child(odd) { animation-delay: 0s; } .uiux-strip-item:nth-child(even) { animation-delay: 1.5s; }
        .uiux-strip-item img, .uiux-strip-item video { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
        .uiux-strip-item:hover { transform: scale(1.05); animation-play-state: paused; }
        @keyframes fadeInShowcase { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatVertical { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

        /* KIEHLS */
        .kiehls-section { position: relative; width: 100%; height: 100vh; margin-bottom: 0; overflow: hidden; display: flex; justify-content: flex-end; align-items: center; padding-right: 10vw; background: #000; }
        .kiehls-bg-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; opacity: 1; }
        .kiehls-img-container { position: relative; z-index: 2; height: 80vh; width: auto; border: none; overflow: hidden; filter: drop-shadow(0 30px 60px rgba(0,0,0,0.6)); animation: floatVertical 6s ease-in-out infinite; margin: 20px 0; }
        .kiehls-img-container img { width: auto; height: 100%; object-fit: contain; display: block; }
        
        .kiehls-static-showcase { width: 100%; min-height: 100vh; position: relative; background-image: url('/images/uiux/khiels_bg.jpg'); background-size: cover; background-position: center; display: flex; justify-content: center; align-items: center; padding: 5vw; }
        .kiehls-static-strip { position: relative; z-index: 2; display: flex; gap: 3vw; height: 70vh; align-items: center; padding: 20px 0; }
        .kiehls-static-item { height: 100%; width: auto; border: none; filter: drop-shadow(0 30px 60px rgba(0,0,0,0.5)); opacity: 0; transform: translateY(50px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .kiehls-static-item.visible { opacity: 1; transform: translateY(0); animation: floatVertical 6s ease-in-out infinite; }
        .kiehls-static-item:nth-child(1) { transition-delay: 0s; animation-delay: 0.2s; }
        .kiehls-static-item:nth-child(2) { transition-delay: 0.2s; animation-delay: 0.7s; }
        .kiehls-static-item:nth-child(3) { transition-delay: 0.4s; animation-delay: 1.2s; }
        .kiehls-static-item img { height: 100%; width: auto; object-fit: contain; display: block; }

        /* CLARINS */
        .clarins-section { width: 100%; min-height: 100vh; position: relative; background-image: url('/images/uiux/clarins_bg.jpg'); background-size: cover; background-position: center; display: flex; justify-content: center; align-items: center; overflow: hidden; }
        .clarins-content { position: relative; display: flex; justify-content: space-between; align-items: center; width: 90%; max-width: 1600px; height: 100vh; padding: 0 2vw; z-index: 2; }
        .clarins-item { position: relative; flex-shrink: 0; animation: floatVertical 6s ease-in-out infinite; margin: 20px 0; }
        .clarins-item.product { height: 45vh; width: auto; animation-delay: 0s; }
        .clarins-item.phone { height: 60vh; width: auto; animation-delay: 1.5s; }
        .clarins-item img { height: 100%; width: auto; object-fit: contain; display: block; filter: drop-shadow(0 30px 60px rgba(0,0,0,0.5)); }

        .clarins-minigame-showcase { width: 100%; min-height: 100vh; position: relative; background-image: url('/images/uiux/clarinsminigame_bg.png'); background-size: cover; background-position: center; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 5vw 0; }
        .minigame-header { font-size: 1.5vw; font-weight: 700; letter-spacing: 4px; color: #F4D03F; text-transform: uppercase; margin-bottom: 5vh; text-shadow: none; pointer-events: none; text-align: center; }
        .minigame-scroll-wrapper { width: 100%; display: flex; justify-content: flex-start; }
        .clarins-minigame-strip { position: relative; z-index: 2; display: flex; gap: 2.5vw; height: 65vh; align-items: center; width: max-content; pointer-events: none; padding: 20px 5vw; }
        .clarins-minigame-item { height: 100%; width: auto; border: none; background: transparent; opacity: 0; transform: translateY(50px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); pointer-events: auto; }
        .clarins-minigame-item.visible { opacity: 1; transform: translateY(0); animation: floatVertical 6s ease-in-out infinite; }
        .clarins-minigame-item:nth-child(1) { transition-delay: 0s; animation-delay: 0.1s; } .clarins-minigame-item:nth-child(2) { transition-delay: 0.2s; animation-delay: 0.6s; } .clarins-minigame-item:nth-child(3) { transition-delay: 0.4s; animation-delay: 1.1s; } .clarins-minigame-item:nth-child(4) { transition-delay: 0.6s; animation-delay: 1.6s; }
        .clarins-minigame-item img { height: 100%; width: auto; object-fit: contain; display: block; pointer-events: none; }

        /* CHRISTMAS */
        .christmas-showcase { width: 100%; min-height: 100vh; position: relative; display: flex; justify-content: center; align-items: center; padding: 5vw 0; overflow: hidden; }
        .christmas-showcase::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('/images/uiux/christmas_bg.png'); background-size: cover; background-position: center; filter: blur(5px); z-index: 0; transform: scale(1.05); }
        .christmas-strip { position: relative; z-index: 2; display: flex; gap: 2.5vw; height: 65vh; align-items: center; width: max-content; pointer-events: none; padding: 20px 5vw; }
        .christmas-item { height: 100%; width: auto; border: none; background: transparent; border-radius: 20px; overflow: hidden; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15)); opacity: 0; transform: translateY(50px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); pointer-events: auto; }
        .christmas-item.visible { opacity: 1; transform: translateY(0); animation: floatVertical 6s ease-in-out infinite; }
        .christmas-item:nth-child(1) { transition-delay: 0s; animation-delay: 0.1s; } .christmas-item:nth-child(2) { transition-delay: 0.2s; animation-delay: 0.6s; } .christmas-item:nth-child(3) { transition-delay: 0.4s; animation-delay: 1.1s; } .christmas-item:nth-child(4) { transition-delay: 0.6s; animation-delay: 1.6s; }
        .christmas-item img { height: 100%; width: auto; object-fit: contain; display: block; pointer-events: none; }

        /* KENZO */
        .kenzo-showcase { width: 100%; height: 100vh; min-height: 600px; position: relative; background-color: #000; display: flex; align-items: center; }
        .kenzo-strip { display: flex; gap: 40px; padding: 20px 5vw; height: 70vh; align-items: center; width: max-content; pointer-events: none; }
        .kenzo-item { aspect-ratio: 9/19.5; height: 100%; flex-shrink: 0; position: relative; border-radius: 20px; overflow: hidden; background: #000; margin: 20px 0; opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); pointer-events: auto; }
        .kenzo-item.visible { opacity: 1; transform: translateY(0); animation: floatVertical 6s ease-in-out infinite; }
        .kenzo-item:nth-child(1) { transition-delay: 0s; animation-delay: 0.1s; } .kenzo-item:nth-child(2) { transition-delay: 0.1s; animation-delay: 0.3s; } .kenzo-item:nth-child(3) { transition-delay: 0.2s; animation-delay: 0.5s; } .kenzo-item:nth-child(4) { transition-delay: 0.3s; animation-delay: 0.7s; } .kenzo-item:nth-child(5) { transition-delay: 0.4s; animation-delay: 0.9s; } .kenzo-item:nth-child(6) { transition-delay: 0.5s; animation-delay: 1.1s; } .kenzo-item:nth-child(7) { transition-delay: 0.6s; animation-delay: 1.3s; }
        .kenzo-item img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
        .kenzo-item:hover { transform: scale(1.05); animation-play-state: paused; }

        @media (max-width: 768px) {
            .header-section { padding-bottom: 40px; }
            .uiux-showcase { height: 70vh; min-height: 450px; }
            .uiux-strip { gap: 20px; padding: 20px 30px; height: 60vh; }
            .kiehls-section { justify-content: center; padding-right: 0; height: 80vh; }
            .kiehls-img-container { height: 65vh; width: auto; }
            .kiehls-static-showcase { height: auto; padding: 60px 20px; align-items: flex-start; }
            .kiehls-static-strip { flex-direction: column; height: auto; width: 100%; gap: 40px; padding: 20px 0; }
            .kiehls-static-item { width: 100%; height: auto; max-height: 70vh; transform: translateY(30px); }
            .kiehls-static-item img { width: 100%; height: auto; }
            .clarins-section { height: auto; padding: 100px 0; }
            .clarins-content { flex-direction: column; gap: 40px; height: auto; justify-content: center; }
            .clarins-item.product { height: 40vh; width: auto; }
            .clarins-item.phone { height: 50vh; width: auto; }
            .clarins-minigame-showcase, .christmas-showcase { height: auto; padding: 60px 20px; display: block; }
            .minigame-header { font-size: 5vw; text-align: center; margin-bottom: 40px; }
            .minigame-scroll-wrapper, .christmas-showcase .scroll-container { display: block; width: 100%; }
            .clarins-minigame-strip, .christmas-strip { flex-direction: column; height: auto; width: 100%; gap: 40px; padding: 20px 0; }
            .clarins-minigame-item, .christmas-item { width: 100%; height: auto; max-height: 70vh; }
            .clarins-minigame-item img, .christmas-item img { width: 100%; height: auto; }
            .kenzo-showcase { height: 70vh; min-height: 450px; }
            .kenzo-strip { gap: 20px; padding: 20px 30px; height: 60vh; }
        }

        /* CONTACT WIDGET */
        .contact-widget { position: fixed; bottom: 30px; right: 30px; z-index: 2500; display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; padding: 6px; width: auto; max-width: 52px; height: 52px; box-sizing: border-box; overflow: hidden; transition: max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease, padding-right 0.6s ease; }
        .contact-widget:hover, .contact-widget.expanded { max-width: 380px; padding-right: 25px; background: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .contact-widget:hover .contact-details, .contact-widget.expanded .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }
        .contact-icon { width: 38px; height: 38px; background: #fff; color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .contact-details { opacity: 0; white-space: nowrap; margin-left: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; pointer-events: none; transition: opacity 0.3s ease 0.1s, margin-left 0.4s ease; }
        .contact-link { color: #ccc; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 1px; display: flex; align-items: center; transition: color 0.3s; }
        .contact-link:hover { color: #fff; }
        .contact-link span.label { font-size: 9px; text-transform: uppercase; color: #666; margin-right: 10px; width: 60px; font-weight: 700; }
      `}</style>

      {/* Preloader - 遮住閃爍畫面 */}
      <div className={`preloader ${!isLoading ? 'hidden' : ''}`}></div>

      <div className="noise-overlay"></div>

      <nav className="smart-nav" id="navbar">
        <Link href="/" className="nav-logo">SAM CHOW.</Link>
        <div className="nav-links">
          <Link href="/uiux" className="nav-item active">UI/UX</Link>
          <Link href="/graphic" className="nav-item">Graphic</Link>
          <Link href="/3d" className="nav-item">3D</Link>
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

      <div className="header-section">
        <h1 className="page-title">UI/UX Design</h1>
        <div className="page-desc">Crafting intuitive digital experiences and seamless interactions.</div>
      </div>

      {/* SHISEIDO */}
      <div className="uiux-showcase">
        <div className="scroll-container" id="draggable-gallery" ref={galleryRef}>
          <div className="uiux-strip">
            <div className="uiux-strip-item"><img src="/images/uiux/shiseido_1.png" alt="Shiseido UI 1" /></div>
            <div className="uiux-strip-item"><img src="/images/uiux/shiseido_2.png" alt="Shiseido UI 2" /></div>
            <div className="uiux-strip-item"><video src="/images/AmyTicket_KT.mp4" autoPlay loop muted playsInline></video></div>
            <div className="uiux-strip-item"><img src="/images/uiux/shiseido_3.png" alt="Shiseido UI 3" /></div>
            <div className="uiux-strip-item"><img src="/images/uiux/shiseido_4.png" alt="Shiseido UI 4" /></div>
          </div>
        </div>
      </div>

      {/* KIEHLS Part 1 */}
      <div className="kiehls-section">
        <video className="kiehls-bg-video" autoPlay loop muted playsInline>
          <source src="/images/kiehls_video.mov" type="video/mp4" />
        </video>
        <div className="kiehls-img-container">
          <img src="/images/uiux/kiehls_1.png" alt="Kiehls UI Design 1" />
        </div>
      </div>

      {/* KIEHLS Part 2 */}
      <div className="kiehls-static-showcase" id="kiehls-part-2" ref={kiehlsRef}>
        <div className="kiehls-static-strip">
          <div className="kiehls-static-item"><img src="/images/uiux/khiels_2.png" alt="Kiehls UI Design 2" /></div>
          <div className="kiehls-static-item"><img src="/images/uiux/khiels_3.png" alt="Kiehls UI Design 3" /></div>
          <div className="kiehls-static-item"><img src="/images/uiux/khiels_4.png" alt="Kiehls UI Design 4" /></div>
        </div>
      </div>

      {/* CLARINS */}
      <div className="clarins-section">
        <div className="clarins-content">
          <div className="clarins-item product">
            <img src="/images/uiux/clarins_product.png" alt="Clarins Product" />
          </div>
          <div className="clarins-item phone">
            <img src="/images/uiux/clarins_phone.png" alt="Clarins UI" />
          </div>
        </div>
      </div>

      {/* CLARINS MINI GAME */}
      <div className="clarins-minigame-showcase" id="clarins-minigame" ref={clarinsGameRef}>
        <h2 className="minigame-header">MINI GAME DEVELOPMENT</h2>
        <div className="scroll-container minigame-scroll-wrapper" id="draggable-minigame" ref={minigameRef}>
          <div className="clarins-minigame-strip">
            <div className="clarins-minigame-item"><img src="/images/uiux/clarinsminigame_1.png" alt="Mini Game 1" /></div>
            <div className="clarins-minigame-item"><img src="/images/uiux/clarinsminigame_2.png" alt="Mini Game 2" /></div>
            <div className="clarins-minigame-item"><img src="/images/uiux/clarinsminigame_3.png" alt="Mini Game 3" /></div>
            <div className="clarins-minigame-item"><img src="/images/uiux/clarinsminigame_4.png" alt="Mini Game 4" /></div>
          </div>
        </div>
      </div>

      {/* CHRISTMAS */}
      <div className="christmas-showcase" id="christmas-section" ref={christmasSectionRef}>
        <div className="scroll-container" id="draggable-christmas" ref={christmasRef}>
          <div className="christmas-strip">
            <div className="christmas-item"><img src="/images/uiux/christmas_1.png" alt="Christmas 1" /></div>
            <div className="christmas-item"><img src="/images/uiux/christmas_2.png" alt="Christmas 2" /></div>
            <div className="christmas-item"><img src="/images/uiux/christmas_3.png" alt="Christmas 3" /></div>
            <div className="christmas-item"><img src="/images/uiux/christmas_4.png" alt="Christmas 4" /></div>
          </div>
        </div>
      </div>

      {/* KENZO */}
      <div className="kenzo-showcase" id="kenzo-section" ref={kenzoSectionRef}>
        <div className="scroll-container" id="draggable-kenzo" ref={kenzoRef}>
          <div className="kenzo-strip">
            <div className="kenzo-item"><img src="/images/uiux/kenzo_1.jpg" alt="Kenzo 1" /></div>
            <div className="kenzo-item"><img src="/images/uiux/kenzo_2.jpg" alt="Kenzo 2" /></div>
            <div className="kenzo-item"><img src="/images/uiux/kenzo_3.jpg" alt="Kenzo 3" /></div>
            <div className="kenzo-item"><img src="/images/uiux/kenzo_4.jpg" alt="Kenzo 4" /></div>
            <div className="kenzo-item"><img src="/images/uiux/kenzo_5.jpg" alt="Kenzo 5" /></div>
            <div className="kenzo-item"><img src="/images/uiux/kenzo_6.jpg" alt="Kenzo 6" /></div>
            <div className="kenzo-item"><img src="/images/uiux/kenzo_7.jpg" alt="Kenzo 7" /></div>
          </div>
        </div>
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
'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function AiPage() {
  
  useEffect(() => {
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

    // 2. Navbar & Mobile Menu Logic
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

    // Cleanup
    return () => {
        if (lenis) lenis.destroy();
        menuBtn?.removeEventListener('click', toggleMenu);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans overflow-x-hidden relative">
      {/* @ts-ignore */}
      <style jsx global>{`
        /* RESET & BASICS */
        * { box-sizing: border-box; }
        body { margin: 0; background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); }
        
        .noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
        
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

        /* NAVBAR STYLES */
        .smart-nav { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); height: 60px; padding: 0 30px; display: flex; justify-content: space-between; align-items: center; z-index: 2000; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: auto; min-width: 450px; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: 30px; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; opacity: 1; max-width: 900px; }
        .nav-item { text-decoration: none; color: #ccc; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; position: relative; }
        .nav-item:hover, .nav-item.active { color: #F4D03F; }
        
        /* Mobile Menu Icon */
        .menu-icon { width: 24px; height: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer; margin-left: 40px; }
        .menu-line { width: 100%; height: 1px; background-color: #fff; transition: width 0.3s ease; }
        
        /* Navbar States */
        .smart-nav.collapsed { min-width: 150px; background: rgba(255, 255, 255, 0.05); padding: 0 20px; } 
        .smart-nav.collapsed .nav-links { max-width: 0; opacity: 0; gap: 0; pointer-events: none; } 
        .smart-nav.collapsed .nav-logo { margin-right: 10px; } 
        .smart-nav.collapsed .menu-icon { margin-left: 0; }
        
        .smart-nav:hover, .smart-nav.force-expand { min-width: 650px !important; background: rgba(255, 255, 255, 0.1) !important; padding: 0 30px !important; } 
        .smart-nav:hover .nav-links, .smart-nav.force-expand .nav-links { max-width: 900px !important; opacity: 1 !important; gap: 25px !important; pointer-events: auto !important; display: flex !important; } 
        
        /* Mobile Overlay */
        .mobile-menu-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 1500; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 30px; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; } .mobile-menu-overlay.active { opacity: 1; pointer-events: auto; }
        .mobile-link { font-size: 30px; font-weight: 700; color: #888; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; transform: translateY(20px); opacity: 0; transition: all 0.4s ease; } .mobile-link:hover { color: #fff; } .mobile-menu-overlay.active .mobile-link { transform: translateY(0); opacity: 1; }
        
        @media (max-width: 768px) { .nav-links { display: none !important; } .smart-nav { min-width: 0 !important; width: 90% !important; max-width: 350px; top: 20px; padding: 0 20px !important; } }

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

      {/* Noise Overlay */}
      <div className="noise-overlay"></div>

      {/* Navbar (Updated Structure) */}
      <nav className="smart-nav" id="navbar">
        <Link href="/" className="nav-logo">SAM CHOW.</Link>
        <div className="nav-links">
          <Link href="/uiux" className="nav-item">UI/UX</Link>
          <Link href="/graphic" className="nav-item">Graphic</Link>
          <Link href="/3d" className="nav-item">3D</Link>
          <Link href="/photography" className="nav-item">Photography</Link>
          <Link href="/video" className="nav-item">Video</Link>
          <Link href="/ai" className="nav-item active">AI Generative</Link>
        </div>
        <div className="menu-icon" id="menu-btn">
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className="mobile-menu-overlay" id="mobile-menu">
        <Link href="/uiux" className="mobile-link">UI/UX</Link>
        <Link href="/graphic" className="mobile-link">Graphic</Link>
        <Link href="/3d" className="mobile-link">3D</Link>
        <Link href="/photography" className="mobile-link">Photography</Link>
        <Link href="/video" className="mobile-link">Video</Link>
        <Link href="/ai" className="mobile-link">AI Generative</Link>
      </div>

      {/* Header */}
      <section className="pt-[220px] pb-[100px] px-[40px] text-center relative z-10">
        <h1 className="text-[80px] font-black leading-none tracking-tighter text-white opacity-0 animate-fadeInUp [animation-delay:0.2s]">AI Generative</h1>
        <div className="mt-[20px] text-base text-[#888] max-w-[600px] inline-block opacity-0 animate-fadeInUp [animation-delay:0.4s]">
          Exploring the frontier of machine creativity.
        </div>
      </section>

      {/* Video Gallery Stack */}
      <div className="flex flex-col gap-[80px] w-full max-w-[1400px] mx-auto mb-[120px] px-[40px]">
        {/* Video 1 */}
        <div className="relative w-full opacity-0 animate-fadeInUp [animation-delay:0.6s]">
          <video src="/images/AI_optimized/ai_1.mp4" autoPlay loop muted playsInline className="w-full h-auto max-h-[85vh] object-cover rounded-xl shadow-2xl"></video>
          <div className="mt-[15px] text-sm font-semibold text-[#888] uppercase tracking-widest pl-[5px]">Sequence 01</div>
        </div>

        {/* Video 2 */}
        <div className="relative w-full opacity-0 animate-fadeInUp [animation-delay:0.8s]">
          <video src="/images/AI_optimized/ai_2.mp4" autoPlay loop muted playsInline className="w-full h-auto max-h-[85vh] object-cover rounded-xl shadow-2xl"></video>
          <div className="mt-[15px] text-sm font-semibold text-[#888] uppercase tracking-widest pl-[5px]">Sequence 02</div>
        </div>

        {/* Video 3 */}
        <div className="relative w-full opacity-0 animate-fadeInUp [animation-delay:1.0s]">
          <video src="/images/muji.mov" autoPlay loop muted playsInline className="w-full h-auto max-h-[85vh] object-cover rounded-xl shadow-2xl"></video>
          <div className="mt-[15px] text-sm font-semibold text-[#888] uppercase tracking-widest pl-[5px]">Sequence 03</div>
        </div>
      </div>

      {/* Contact Widget (Added for consistency) */}
      <div className="contact-widget" id="contact-bubble">
        <div className="contact-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
        <div className="contact-details">
            <a href="https://wa.me/85267012420" target="_blank" className="contact-link" style={{ color: '#fff' }}><span className="label">WA</span>+852 6701 2420</a>
            <a href="mailto:chowfh254281@gmail.com" className="contact-link" style={{ color: '#fff' }}><span className="label">MAIL</span>chowfh254281@gmail.com</a>
        </div>
      </div>

    </div>
  );
}
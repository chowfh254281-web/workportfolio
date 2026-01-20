'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function GraphicPage() {
  // 1. 新增 Loading 狀態 (Preloader)
  const [isLoading, setIsLoading] = useState(true);

  // Refs for rows
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const row4Ref = useRef<HTMLDivElement>(null);
  const row5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 設定 Preloader Timer (0.5秒後淡出)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    let lenis: any;
    let animationFrameId: number;

    // 1. Initialize Lenis Smooth Scroll
    import('@studio-freight/lenis').then((Lenis) => {
      lenis = new Lenis.default({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // smoothTouch: true, // Removed to fix TS error
        touchMultiplier: 1.5,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    // 2. Desktop Marquee Animation Logic
    const initDesktopAnimation = () => {
      const rows = [row1Ref.current, row2Ref.current, row3Ref.current, row4Ref.current, row5Ref.current];
      if (!rows[0]) return;

      let baseSpeed = 0.5; 
      let scrollVelocity = 0; 
      let skewStrength = 0;
      let singleSetWidth = 0;

      // Positions
      let pos1 = 0, pos3 = 0, pos5 = 0; // Left moving
      let pos2 = 0, pos4 = 0; // Right moving
      
      let lastScrollY = window.scrollY; 

      const calculateWidth = () => {
        if(rows[0]) {
            const items = rows[0].querySelectorAll('.strip-item');
            let totalItemWidth = 0;
            
            // Sum the first 5 unique items
            for(let i=0; i<5; i++) {
                if(items[i]) totalItemWidth += items[i].getBoundingClientRect().width;
            }
            
            const style = window.getComputedStyle(rows[0]);
            const gap = parseFloat(style.gap) || 15;
            
            // Total width of one "set"
            singleSetWidth = totalItemWidth + (gap * 5);
            
            // Reset Right Moving Rows offset to ensure seamless loop start
            if(pos2 === 0 && singleSetWidth > 0) {
                pos2 = -singleSetWidth; 
                pos4 = -singleSetWidth; 
            }
        }
      };

      const animate = () => {
        const currentScrollY = window.scrollY; 
        const delta = currentScrollY - lastScrollY; 
        lastScrollY = currentScrollY;
        
        // Smoothed Velocity
        scrollVelocity += (delta * 0.1 - scrollVelocity) * 0.1;
        
        const speed = baseSpeed + (scrollVelocity * 5); 
        const limit = singleSetWidth || 3000; // Fallback width if calculation fails
        
        // Skew
        skewStrength += ((scrollVelocity * 2) - skewStrength) * 0.1;
        const safeSkew = Math.max(Math.min(skewStrength, 5), -5);

        // --- LEFT MOVING (Rows 1, 3, 5) ---
        pos1 -= speed; if (pos1 <= -limit) pos1 += limit; if (pos1 > 0) pos1 -= limit;
        pos3 -= speed; if (pos3 <= -limit) pos3 += limit; if (pos3 > 0) pos3 -= limit;
        pos5 -= speed; if (pos5 <= -limit) pos5 += limit; if (pos5 > 0) pos5 -= limit;

        // --- RIGHT MOVING (Rows 2, 4) ---
        pos2 += speed; if (pos2 >= 0) pos2 -= limit; if (pos2 < -limit) pos2 += limit;
        pos4 += speed; if (pos4 >= 0) pos4 -= limit; if (pos4 < -limit) pos4 += limit;

        // Apply transforms
        if(rows[0]) rows[0].style.transform = `translate3d(${pos1.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[1]) rows[1].style.transform = `translate3d(${pos2.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[2]) rows[2].style.transform = `translate3d(${pos3.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[3]) rows[3].style.transform = `translate3d(${pos4.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[4]) rows[4].style.transform = `translate3d(${pos5.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        
        animationFrameId = requestAnimationFrame(animate);
      };

      // Initialization
      calculateWidth();
      window.addEventListener('resize', calculateWidth);
      // Wait for images to load to calculate correct width
      if (document.readyState === 'complete') {
        calculateWidth();
      } else {
        window.addEventListener('load', calculateWidth);
      }
      
      animate();

      return () => {
        window.removeEventListener('resize', calculateWidth);
        window.removeEventListener('load', calculateWidth);
        cancelAnimationFrame(animationFrameId);
      };
    };

    // 3. Mobile Logic (Intersection Observer)
    const initMobileVerticalLogic = () => {
        const observerOptions = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 };
        const observer = new IntersectionObserver((entries) => { 
            entries.forEach(entry => { 
                if (entry.isIntersecting) { entry.target.classList.add('in-view'); } 
                else { entry.target.classList.remove('in-view'); } 
            }); 
        }, observerOptions);
        
        const items = document.querySelectorAll('.strip-item');
        items.forEach(item => { observer.observe(item); });

        return () => {
            observer.disconnect();
        };
    };

    // Determine which logic to run based on screen width
    let cleanupDesktop: () => void;
    let cleanupMobile: () => void;

    if (window.innerWidth > 768) {
        // @ts-ignore
        cleanupDesktop = initDesktopAnimation() || (() => {});
    } else {
        cleanupMobile = initMobileVerticalLogic();
    }

    const handleResizeSwitch = () => {
         // Placeholder for resize logic
    };
    window.addEventListener('resize', handleResizeSwitch);

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
      clearTimeout(timer); // Preloader cleanup
      if (lenis) lenis.destroy();
      if (cleanupDesktop) cleanupDesktop();
      if (cleanupMobile) cleanupMobile();
      menuBtn?.removeEventListener('click', toggleMenu);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResizeSwitch);
    };
  }, []);

  return (
    <>
      {/* @ts-ignore */}
      <style jsx global>{`
        /* PERFORMANCE & RESET */
        * { box-sizing: border-box; }
        body { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); min-height: 100vh; overflow-x: hidden; }
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
        .header-section { padding: 220px 40px 100px 40px; text-align: center; position: relative; z-index: 10; }
        h1.page-title { font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.2s; color: #fff; }
        .page-desc { margin-top: 20px; font-size: 16px; color: #888; max-width: 600px; display: inline-block; opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.4s; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        
        /* KINETIC GALLERY */
        .kinetic-wrapper { 
            position: relative; width: 100%; overflow: hidden; padding-bottom: 200px; 
            display: flex; flex-direction: column; gap: 15px; 
        }
        .mobile-track { display: contents; }
        .gallery-strip { 
            display: flex; gap: 15px; width: max-content; 
            transform: translate3d(0, 0, 0); will-change: transform; 
            backface-visibility: hidden; perspective: 1000px;
        }
        .strip-item { 
            flex-shrink: 0; width: auto; height: 32vw; min-height: 320px; max-height: 640px;
            position: relative; border-radius: 12px; overflow: hidden; background-color: #111; 
            transform: translateZ(0);
        }
        .strip-item img { 
            width: auto; height: 100%; object-fit: contain; 
            filter: brightness(0.9); transition: filter 0.3s ease, transform 0.3s ease; 
            will-change: transform, filter; transform: translateZ(0); 
        }
        .strip-item:hover img { filter: brightness(1.1) !important; transform: scale(1.05); }
        .strip-caption { position: absolute; bottom: 20px; left: 20px; font-size: 3vw; font-weight: 700; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.5); z-index: 2; pointer-events: none; }
        
        @media (max-width: 768px) {
            .header-section { padding-bottom: 50px; }
            .kinetic-wrapper { gap: 20px; padding: 0 20px 100px 20px; display: block; }
            .mobile-track { display: block; margin-bottom: 30px; }
            .gallery-strip { display: flex; flex-direction: column; gap: 30px; width: 100%; transform: none !important; overflow: visible; }
            .strip-item { width: 100%; height: auto; max-width: none; filter: brightness(0.9); }
            .strip-item img { width: 100%; height: auto; filter: inherit; object-fit: cover; }
            .strip-item.in-view { filter: brightness(1); }
            .strip-item.duplicate { display: none; }
            .strip-caption { font-size: 40px; }
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
          <Link href="/uiux" className="nav-item">UI/UX</Link>
          <Link href="/graphic" className="nav-item active">Graphic</Link>
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
        <h1 className="page-title">Graphic</h1>
        <div className="page-desc">Visual identity, branding, and creative composition.</div>
      </div>

      <div className="kinetic-wrapper">
        <div className="mobile-track">
            <div className="gallery-strip" id="row-1" ref={row1Ref}>
                <div className="strip-item"><img src="/images/Graphic_optimized/02.jpg" alt="01" /><div className="strip-caption">01</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/24card1.jpg" alt="02" /><div className="strip-caption">02</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/300x600_1.jpg" alt="03" /><div className="strip-caption">03</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/0320_b.jpg" alt="04" /><div className="strip-caption">04</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/0414_v1.jpg" alt="05" /><div className="strip-caption">05</div></div>
                {/* Duplicates for Loop */}
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/02.jpg" alt="01" /><div className="strip-caption">01</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/24card1.jpg" alt="02" /><div className="strip-caption">02</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/300x600_1.jpg" alt="03" /><div className="strip-caption">03</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/0320_b.jpg" alt="04" /><div className="strip-caption">04</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/0414_v1.jpg" alt="05" /><div className="strip-caption">05</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/02.jpg" alt="01" /><div className="strip-caption">01</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/24card1.jpg" alt="02" /><div className="strip-caption">02</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/300x600_1.jpg" alt="03" /><div className="strip-caption">03</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/0320_b.jpg" alt="04" /><div className="strip-caption">04</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/0414_v1.jpg" alt="05" /><div className="strip-caption">05</div></div>
            </div>
        </div>

        <div className="mobile-track">
            <div className="gallery-strip" id="row-2" ref={row2Ref}>
                <div className="strip-item"><img src="/images/Graphic_optimized/0529_challenge_1-1_1b_2-1.jpg" alt="06" /><div className="strip-caption">06</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/967_1-1.jpg" alt="07" /><div className="strip-caption">07</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/122414.jpg" alt="08" /><div className="strip-caption">08</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/123214.jpg" alt="09" /><div className="strip-caption">09</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/HSBC Life x HKFC sponsorship video thumbnail_1.jpg" alt="10" /><div className="strip-caption">10</div></div>
                
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/0529_challenge_1-1_1b_2-1.jpg" alt="06" /><div className="strip-caption">06</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/967_1-1.jpg" alt="07" /><div className="strip-caption">07</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/122414.jpg" alt="08" /><div className="strip-caption">08</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/123214.jpg" alt="09" /><div className="strip-caption">09</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/HSBC Life x HKFC sponsorship video thumbnail_1.jpg" alt="10" /><div className="strip-caption">10</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/0529_challenge_1-1_1b_2-1.jpg" alt="06" /><div className="strip-caption">06</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/967_1-1.jpg" alt="07" /><div className="strip-caption">07</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/122414.jpg" alt="08" /><div className="strip-caption">08</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/123214.jpg" alt="09" /><div className="strip-caption">09</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/HSBC Life x HKFC sponsorship video thumbnail_1.jpg" alt="10" /><div className="strip-caption">10</div></div>
            </div>
        </div>

        <div className="mobile-track">
            <div className="gallery-strip" id="row-3" ref={row3Ref}>
                <div className="strip-item"><img src="/images/Graphic_optimized/INGREDIENTS_4-5.jpg" alt="11" /><div className="strip-caption">11</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/june6_2.jpg" alt="12" /><div className="strip-caption">12</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_01.jpg" alt="13" /><div className="strip-caption">13</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_02.jpg" alt="14" /><div className="strip-caption">14</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_03.jpg" alt="15" /><div className="strip-caption">15</div></div>
                
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/INGREDIENTS_4-5.jpg" alt="11" /><div className="strip-caption">11</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/june6_2.jpg" alt="12" /><div className="strip-caption">12</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_01.jpg" alt="13" /><div className="strip-caption">13</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_02.jpg" alt="14" /><div className="strip-caption">14</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_03.jpg" alt="15" /><div className="strip-caption">15</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/INGREDIENTS_4-5.jpg" alt="11" /><div className="strip-caption">11</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/june6_2.jpg" alt="12" /><div className="strip-caption">12</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_01.jpg" alt="13" /><div className="strip-caption">13</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_02.jpg" alt="14" /><div className="strip-caption">14</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_03.jpg" alt="15" /><div className="strip-caption">15</div></div>
            </div>
        </div>

        <div className="mobile-track">
            <div className="gallery-strip" id="row-4" ref={row4Ref}>
                <div className="strip-item"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_04.jpg" alt="16" /><div className="strip-caption">16</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_05.jpg" alt="17" /><div className="strip-caption">17</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_06.jpg" alt="18" /><div className="strip-caption">18</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/p1.jpg" alt="19" /><div className="strip-caption">19</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/p3_6.jpg" alt="20" /><div className="strip-caption">20</div></div>

                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_04.jpg" alt="16" /><div className="strip-caption">16</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_05.jpg" alt="17" /><div className="strip-caption">17</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_06.jpg" alt="18" /><div className="strip-caption">18</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/p1.jpg" alt="19" /><div className="strip-caption">19</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/p3_6.jpg" alt="20" /><div className="strip-caption">20</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_04.jpg" alt="16" /><div className="strip-caption">16</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_05.jpg" alt="17" /><div className="strip-caption">17</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/meadjohnson_socialmedia_06.jpg" alt="18" /><div className="strip-caption">18</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/p1.jpg" alt="19" /><div className="strip-caption">19</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/p3_6.jpg" alt="20" /><div className="strip-caption">20</div></div>
            </div>
        </div>

        <div className="mobile-track">
            <div className="gallery-strip" id="row-5" ref={row5Ref}>
                <div className="strip-item"><img src="/images/Graphic_optimized/p3b_3.jpg" alt="21" /><div className="strip-caption">21</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/post-4-5_V5a.jpg" alt="22" /><div className="strip-caption">22</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/scene1.jpg" alt="23" /><div className="strip-caption">23</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/scene2.jpg" alt="24" /><div className="strip-caption">24</div></div>
                <div className="strip-item"><img src="/images/Graphic_optimized/0414_v2c.jpg" alt="25" /><div className="strip-caption">25</div></div>

                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/p3b_3.jpg" alt="21" /><div className="strip-caption">21</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/post-4-5_V5a.jpg" alt="22" /><div className="strip-caption">22</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/scene1.jpg" alt="23" /><div className="strip-caption">23</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/scene2.jpg" alt="24" /><div className="strip-caption">24</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/0414_v2c.jpg" alt="25" /><div className="strip-caption">25</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/p3b_3.jpg" alt="21" /><div className="strip-caption">21</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/post-4-5_V5a.jpg" alt="22" /><div className="strip-caption">22</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/scene1.jpg" alt="23" /><div className="strip-caption">23</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/scene2.jpg" alt="24" /><div className="strip-caption">24</div></div>
                <div className="strip-item duplicate"><img src="/images/Graphic_optimized/0414_v2c.jpg" alt="25" /><div className="strip-caption">25</div></div>
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
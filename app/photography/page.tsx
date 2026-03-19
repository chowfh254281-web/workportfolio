'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function PhotographyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isContactExpanded, setIsContactExpanded] = useState(false);

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const row4Ref = useRef<HTMLDivElement>(null);
  const row5Ref = useRef<HTMLDivElement>(null);
  const row6Ref = useRef<HTMLDivElement>(null);
  const row7Ref = useRef<HTMLDivElement>(null);
  const row8Ref = useRef<HTMLDivElement>(null);
  const row9Ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

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

    // 🟢 終極無縫防跳動 + 置中進場邏輯 (同 Graphic Page 一樣)
    const initDesktopAnimation = () => {
      const rows = [row1Ref.current, row2Ref.current, row3Ref.current, row4Ref.current, row5Ref.current, row6Ref.current, row7Ref.current, row8Ref.current, row9Ref.current];
      if (!rows[0]) return;

      let baseSpeed = 0.5; 
      let scrollVelocity = 0; 
      let skewStrength = 0;
      
      let positions = [0, 0, 0, 0, 0, 0, 0, 0, 0]; 
      let rowLimits = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      
      let lastScrollY = window.scrollY; 

      const calculateWidth = () => {
        rows.forEach((row, index) => {
            if(!row) return;
            const items = row.children;
            // 每行都嚴格分為 3 組 (1 原版 + 2 複製品)，獲取單組真實數量
            const uniqueCount = Math.floor(items.length / 3);
            
            if (uniqueCount > 0 && items[uniqueCount]) {
                // 使用 offsetLeft 精準獲取物理距離，徹底消除 CSS 小數點誤差導致的跳動
                const firstItem = items[0] as HTMLElement;
                const secondSetItem = items[uniqueCount] as HTMLElement;
                rowLimits[index] = secondSetItem.offsetLeft - firstItem.offsetLeft;
            }
            
            // 讓所有行數一開始就「由中間開始」(充滿左右緩衝區，不留空位)
            if(rowLimits[index] > 0 && positions[index] === 0) {
                const stagger = (rowLimits[index] / 5) * (index % 5);
                if (index % 2 === 0) { // 向左移動的行
                    positions[index] = -rowLimits[index] - stagger;
                } else { // 向右移動的行
                    positions[index] = -rowLimits[index] + stagger;
                }
            }
        });

        if (wrapperRef.current) wrapperRef.current.classList.add('loaded');
      };

      const animate = () => {
        const currentScrollY = window.scrollY; 
        const delta = currentScrollY - lastScrollY; 
        lastScrollY = currentScrollY;
        
        scrollVelocity += (delta * 0.1 - scrollVelocity) * 0.1;
        const speed = baseSpeed + (scrollVelocity * 5); 
        
        skewStrength += ((scrollVelocity * 2) - skewStrength) * 0.1;
        const safeSkew = Math.max(Math.min(skewStrength, 5), -5);

        rows.forEach((row, i) => {
            if(!row) return;
            const limit = rowLimits[i] || 3000;
            const isLeftMoving = i % 2 === 0; 

            if (isLeftMoving) {
                positions[i] -= speed;
                // 向左無縫循環
                if (positions[i] <= -(limit * 2)) positions[i] += limit;
                if (positions[i] > -limit) positions[i] -= limit;
            } else { 
                positions[i] += speed;
                // 向右無縫循環
                if (positions[i] >= 0) positions[i] -= limit;
                if (positions[i] < -limit) positions[i] += limit;
            }
            
            row.style.transform = `translate3d(${positions[i].toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        });
        
        animationFrameId = requestAnimationFrame(animate);
      };

      calculateWidth();
      window.addEventListener('resize', calculateWidth);
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

    const initMobileVerticalLogic = () => {
        if (wrapperRef.current) wrapperRef.current.classList.add('loaded');
        const observerOptions = { root: null, rootMargin: '-20% 0px -20% 0px', threshold: 0 };
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

    let cleanupDesktop: () => void;
    let cleanupMobile: () => void;

    if (window.innerWidth > 768) {
        // @ts-ignore
        cleanupDesktop = initDesktopAnimation() || (() => {});
    } else {
        cleanupMobile = initMobileVerticalLogic();
    }

    const handleResizeSwitch = () => { };
    window.addEventListener('resize', handleResizeSwitch);

    const navbar = document.getElementById('navbar');
    const contactBubble = document.getElementById('contact-bubble');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            if (navbar && !navbar.classList.contains('mobile-active')) {
                navbar.classList.add('collapsed');
            }
        } else {
            navbar?.classList.remove('collapsed');
            navbar?.classList.remove('force-expand');
        }

        if (contactBubble) {
            if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 50) {
                contactBubble.classList.add('expanded');
            } else {
                contactBubble.classList.remove('expanded');
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      if (lenis) lenis.destroy();
      if (cleanupDesktop) cleanupDesktop();
      if (cleanupMobile) cleanupMobile();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResizeSwitch);
    };
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

  const toggleContact = () => setIsContactExpanded(!isContactExpanded);

  // 🟢 每行 5 張圖
  const row1Images = ["DSC00127", "DSC03905", "DSC04688", "DSC06114", "DSC02991"];
  const row2Images = ["DSC00672", "DSC04087", "DSC08718", "DSC05456", "DSC00709"];
  const row3Images = ["DSC00133", "DSC03919", "DSC05608", "DSC07850", "DSC02995"];
  const row4Images = ["DSC00765", "DSC04102", "DSC08748", "DSC08358", "DSC03300"];
  const row5Images = ["DSC00327", "DSC03959", "DSC05664", "DSC09908", "DSC03011"];
  const row6Images = ["DSC03382", "DSC04119", "DSC08760", "DSC08810", "DSC09492"];
  const row7Images = ["DSC00362", "DSC03982", "DSC05863", "DSC09480", "DSC03014"];
  // 🟢 新圖加入 Row 8 (代替部分舊圖)，維持 5 張
  const row8Images = ["DSC04391", "DSC04662-2", "DSC01244", "DSC01436", "DSC01437"]; 
  const row9Images = ["DSC00380", "DSC04086", "DSC05864", "DSC09482", "DSC03064"];

  return (
    <>
      {/* @ts-ignore */}
      <style jsx global>{`
        * { box-sizing: border-box; }
        body { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); min-height: 100vh; overflow-x: hidden; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-stopped { overflow: hidden; }
        .noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; mix-blend-mode: overlay; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
        
        .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 9999; transition: opacity 0.8s ease-in-out; pointer-events: none; }
        .preloader.hidden { opacity: 0; }

        .smart-nav { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); padding: 0 30px; display: flex; align-items: center; justify-content: space-between; z-index: 2000; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: auto; min-width: 450px; height: 60px; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); overflow: hidden; cursor: pointer; }
        .nav-header { display: contents; }
        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: auto; cursor: pointer; order: 1; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; opacity: 1; max-width: 900px; order: 2; margin: 0 40px; }
        .nav-item { text-decoration: none; color: #fff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; position: relative; }
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

        .header-section { padding: 220px 40px 100px 40px; text-align: center; position: relative; z-index: 10; }
        h1.page-title { font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.2s; color: #fff; }
        .page-desc { margin-top: 20px; font-size: 16px; color: #888; max-width: 600px; display: inline-block; opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.4s; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        
        .kinetic-wrapper { position: relative; width: 100%; overflow: hidden; padding-bottom: 200px; display: flex; flex-direction: column; gap: 15px; opacity: 0; transition: opacity 1.5s ease; }
        .kinetic-wrapper.loaded { opacity: 1; }
        .mobile-track { display: contents; }
        .gallery-strip { display: flex; gap: 15px; width: max-content; transform: translate3d(0, 0, 0); will-change: transform; backface-visibility: hidden; perspective: 1000px; }
        
        /* 🟢 改為 1:1 Aspect Ratio (同 Graphic 相同) */
        .strip-item { flex-shrink: 0; width: 35vw; height: auto; aspect-ratio: 1 / 1; position: relative; border-radius: 8px; overflow: hidden; background-color: #111; transform: translateZ(0); }
        .strip-item img, .strip-item video { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.9); transition: filter 0.3s ease, transform 0.3s ease; will-change: transform, filter; transform: translateZ(0); display: block; }
        .strip-item:hover img, .strip-item:hover video { filter: brightness(1.1) !important; transform: scale(1.05); }
        .strip-caption { position: absolute; bottom: 20px; left: 20px; font-size: 3vw; font-weight: 700; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.5); z-index: 2; pointer-events: none; }
        
        @media (max-width: 768px) {
            .header-section { padding-bottom: 50px; }
            .smart-nav { flex-direction: column !important; align-items: flex-start !important; width: 90% !important; max-width: 350px !important; height: 60px; overflow: hidden; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); min-width: 0 !important; }
            .smart-nav.mobile-active { position: fixed !important; top: 0 !important; left: 0 !important; transform: none !important; width: 100vw !important; max-width: none !important; height: 100vh !important; border-radius: 0 !important; background: #000 !important; border: none !important; padding: 30px !important; justify-content: flex-start !important; align-items: center !important; z-index: 9000 !important; }
            .nav-header { display: flex !important; width: 100%; justify-content: space-between; align-items: center; height: 60px; flex-shrink: 0; }
            .nav-logo { order: unset; margin-right: 0; }
            .menu-icon { order: unset; }
            .nav-links { display: flex !important; flex-direction: column !important; width: 100% !important; opacity: 0; transform: translateY(20px); transition: all 0.4s ease 0.1s; pointer-events: none; margin-top: 0; height: 100%; justify-content: center; align-items: center; gap: 40px !important; order: unset; margin: 0; }
            .smart-nav.mobile-active .nav-links { opacity: 1 !important; transform: translateY(0) !important; pointer-events: auto !important; visibility: visible !important; }
            .nav-item { font-size: 28px !important; font-weight: 700 !important; letter-spacing: 2px !important; }

            .kinetic-wrapper { gap: 40px; padding: 0 0 100px 0; display: flex; flex-direction: column; align-items: center; }
            .mobile-track { display: block; margin-bottom: 0; width: 100%; }
            .gallery-strip { display: flex; flex-direction: column; gap: 40px; width: 100%; transform: none !important; overflow: visible; align-items: center; }
            
            .strip-item { width: 100% !important; height: auto !important; aspect-ratio: 1 / 1; max-width: none; max-height: none; margin: 0 auto; filter: brightness(0.9); background-color: transparent; }
            .strip-item img, .strip-item video { width: 100%; height: 100%; filter: inherit; object-fit: cover; }
            .strip-item.in-view { filter: brightness(1); }
            .strip-item.duplicate { display: none; }
            .strip-caption { font-size: 40px; }
        }

        .contact-widget { position: fixed; bottom: 30px; right: 30px; z-index: 2500; display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; padding: 6px; width: auto; max-width: 52px; height: 52px; box-sizing: border-box; overflow: hidden; transition: max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease, padding-right 0.6s ease; cursor: pointer; }
        .contact-icon { width: 38px; height: 38px; background: #fff; color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .contact-details { opacity: 0; white-space: nowrap; margin-left: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; pointer-events: none; transition: opacity 0.3s ease 0.1s, margin-left 0.4s ease; }
        .contact-link { color: #ccc; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 1px; display: flex; align-items: center; transition: color 0.3s; }
        .contact-link:hover { color: #fff; }
        .contact-link span.label { font-size: 9px; text-transform: uppercase; color: #666; margin-right: 10px; width: 60px; font-weight: 700; }
        .contact-widget.expanded { max-width: 380px; padding-right: 25px; background: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .contact-widget.expanded .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }

        @media (min-width: 769px) {
            .contact-widget:hover { max-width: 380px; padding-right: 25px; background: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
            .contact-widget:hover .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }
        }
      `}</style>

      <div className={`preloader ${!isLoading ? 'hidden' : ''}`}></div>
      <div className="noise-overlay"></div>

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
          <Link href="/photography" className="nav-item active">Photography</Link>
          <Link href="/video" className="nav-item">Video</Link>
          <Link href="/ai" className="nav-item">AI Generative</Link>
        </div>
      </nav>

      <div className="header-section">
        <h1 className="page-title">Photography</h1>
        <div className="page-desc">Capturing the world, one frame at a time.</div>
      </div>

      <div className="kinetic-wrapper" id="kinetic-wrapper" ref={wrapperRef}>
        
        {/* ROW 1 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-1" ref={row1Ref}>
                {row1Images.map((img, i) => (
                    <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 1).padStart(2, '0')}</div></div>
                ))}
                {/* SET 2 */}
                {row1Images.map((img, i) => (
                    <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
                {/* SET 3 */}
                {row1Images.map((img, i) => (
                    <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
            </div>
        </div>

        {/* ROW 2 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-2" ref={row2Ref}>
                {row2Images.map((img, i) => (
                    <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 6).padStart(2, '0')}</div></div>
                ))}
                {/* SET 2 */}
                {row2Images.map((img, i) => (
                    <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
                {/* SET 3 */}
                {row2Images.map((img, i) => (
                    <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
            </div>
        </div>

        {/* ROW 3 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-3" ref={row3Ref}>
                {row3Images.map((img, i) => (
                    <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 11).padStart(2, '0')}</div></div>
                ))}
                {/* SET 2 */}
                {row3Images.map((img, i) => (
                    <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
                {/* SET 3 */}
                {row3Images.map((img, i) => (
                    <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
            </div>
        </div>

        {/* ROW 4 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-4" ref={row4Ref}>
                {row4Images.map((img, i) => (
                    <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 16).padStart(2, '0')}</div></div>
                ))}
                {/* SET 2 */}
                {row4Images.map((img, i) => (
                    <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
                {/* SET 3 */}
                {row4Images.map((img, i) => (
                    <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
            </div>
        </div>

        {/* ROW 5 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-5" ref={row5Ref}>
                {row5Images.map((img, i) => (
                    <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 21).padStart(2, '0')}</div></div>
                ))}
                {/* SET 2 */}
                {row5Images.map((img, i) => (
                    <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
                {/* SET 3 */}
                {row5Images.map((img, i) => (
                    <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
            </div>
        </div>

        {/* ROW 6 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-6" ref={row6Ref}>
                {row6Images.map((img, i) => (
                    <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 26).padStart(2, '0')}</div></div>
                ))}
                {/* SET 2 */}
                {row6Images.map((img, i) => (
                    <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
                {/* SET 3 */}
                {row6Images.map((img, i) => (
                    <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
            </div>
        </div>

        {/* ROW 7 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-7" ref={row7Ref}>
                {row7Images.map((img, i) => (
                    <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 31).padStart(2, '0')}</div></div>
                ))}
                {/* SET 2 */}
                {row7Images.map((img, i) => (
                    <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
                {/* SET 3 */}
                {row7Images.map((img, i) => (
                    <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
            </div>
        </div>

        {/* 🟢 ROW 8 (已加入 3 張新圖，共 5 張) */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-8" ref={row8Ref}>
                {row8Images.map((img, i) => (
                    <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 36).padStart(2, '0')}</div></div>
                ))}
                {/* SET 2 */}
                {row8Images.map((img, i) => (
                    <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
                {/* SET 3 */}
                {row8Images.map((img, i) => (
                    <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
            </div>
        </div>

        {/* ROW 9 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-9" ref={row9Ref}>
                {row9Images.map((img, i) => (
                    <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 41).padStart(2, '0')}</div></div>
                ))}
                {/* SET 2 */}
                {row9Images.map((img, i) => (
                    <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
                {/* SET 3 */}
                {row9Images.map((img, i) => (
                    <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                ))}
            </div>
        </div>

      </div>

      <div 
        className={`contact-widget ${isContactExpanded ? 'expanded' : ''}`} 
        id="contact-bubble"
        onClick={toggleContact}
      >
        <div className="contact-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
        <div className="contact-details">
            <a href="https://wa.me/85267012420" target="_blank" className="contact-link" style={{ color: '#fff' }}><span className="label">WHATSAPP</span>6701 2420</a>
            <a href="mailto:chowfh254281@gmail.com" className="contact-link" style={{ color: '#fff' }}><span className="label">MAIL</span>chowfh254281@gmail.com</a>
        </div>
      </div>
    </>
  );
}
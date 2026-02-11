'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function PhotographyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isContactExpanded, setIsContactExpanded] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const row4Ref = useRef<HTMLDivElement>(null);
  const row5Ref = useRef<HTMLDivElement>(null);
  const row6Ref = useRef<HTMLDivElement>(null);
  const row7Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    let lenis: any;
    let animationFrameId: number;
    let observer: IntersectionObserver;

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

    const initDesktopAnimation = () => {
      const rows = [
        row1Ref.current, row2Ref.current, row3Ref.current, 
        row4Ref.current, row5Ref.current, row6Ref.current,
        row7Ref.current
      ];
      if (!rows[0]) return;

      let baseSpeed = 0.5; 
      let scrollVelocity = 0;
      let skewStrength = 0;
      const vw = window.innerWidth;
      const gap = 15;

      const oddItemWidth = vw * 0.25; 
      const evenItemWidth = vw * 0.60; 
      const oddRowWidth = (oddItemWidth * 5) + (gap * 5); 
      const evenRowWidth = (evenItemWidth * 5) + (gap * 5); 

      let pos1 = 0, pos3 = 0, pos5 = 0, pos7 = 0; 
      let pos2 = 0, pos4 = 0, pos6 = 0; 
      pos2 = -evenRowWidth; pos4 = -evenRowWidth; pos6 = -evenRowWidth; 

      if (wrapperRef.current) wrapperRef.current.classList.add('loaded');
      let lastScrollY = window.scrollY;

      const animate = () => {
        const currentScrollY = window.scrollY; 
        const delta = currentScrollY - lastScrollY; 
        lastScrollY = currentScrollY;
        scrollVelocity += (delta * 0.1 - scrollVelocity) * 0.1;
        const speed = baseSpeed + (scrollVelocity * 2); 
        skewStrength += ((scrollVelocity * 2) - skewStrength) * 0.1;
        const safeSkew = Math.max(Math.min(skewStrength, 5), -5);

        const limitOdd = oddRowWidth;
        pos1 -= speed; pos3 -= speed; pos5 -= speed; pos7 -= speed;
        if (pos1 <= -limitOdd) pos1 += limitOdd; if (pos1 > 0) pos1 -= limitOdd;
        if (pos3 <= -limitOdd) pos3 += limitOdd; if (pos3 > 0) pos3 -= limitOdd;
        if (pos5 <= -limitOdd) pos5 += limitOdd; if (pos5 > 0) pos5 -= limitOdd;
        if (pos7 <= -limitOdd) pos7 += limitOdd; if (pos7 > 0) pos7 -= limitOdd;

        const limitEven = evenRowWidth;
        pos2 += speed; pos4 += speed; pos6 += speed;
        if (pos2 >= 0) pos2 -= limitEven; if (pos2 < -limitEven) pos2 += limitEven;
        if (pos4 >= 0) pos4 -= limitEven; if (pos4 < -limitEven) pos4 += limitEven;
        if (pos6 >= 0) pos6 -= limitEven; if (pos6 < -limitEven) pos6 += limitEven;

        if(rows[0]) rows[0].style.transform = `translate3d(${pos1.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[1]) rows[1].style.transform = `translate3d(${pos2.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[2]) rows[2].style.transform = `translate3d(${pos3.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[3]) rows[3].style.transform = `translate3d(${pos4.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[4]) rows[4].style.transform = `translate3d(${pos5.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[5]) rows[5].style.transform = `translate3d(${pos6.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[6]) rows[6].style.transform = `translate3d(${pos7.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(animationFrameId);
    };

    const initMobileVerticalLogic = () => {
        if (wrapperRef.current) wrapperRef.current.classList.add('loaded');
        const observerOptions = { root: null, rootMargin: '-20% 0px -20% 0px', threshold: 0 };
        observer = new IntersectionObserver((entries) => { 
            entries.forEach(entry => { 
                if (entry.isIntersecting) entry.target.classList.add('in-view'); 
                else entry.target.classList.remove('in-view'); 
            }); 
        }, observerOptions);
        document.querySelectorAll('.strip-item').forEach(item => observer.observe(item));
    };

    let cleanupDesktop: (() => void) | undefined;
    const handleResize = () => {
        if (window.innerWidth > 768) {
             if (cleanupDesktop) cleanupDesktop();
             // @ts-ignore
             cleanupDesktop = initDesktopAnimation();
        }
    };
    if (window.innerWidth > 768) {
        // @ts-ignore
        cleanupDesktop = initDesktopAnimation();
    } else {
        initMobileVerticalLogic();
    }
    window.addEventListener('resize', handleResize);

    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 50) navbar?.classList.add('collapsed');
        else {
            navbar?.classList.remove('collapsed');
            navbar?.classList.remove('force-expand');
        }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      if (lenis) lenis.destroy();
      if (cleanupDesktop) cleanupDesktop();
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    if (!navbar || !menuBtn) return;
    if (window.innerWidth <= 768) {
        if (navbar.classList.contains('mobile-active')) {
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
        .smart-nav { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); padding: 0 30px; display: flex; align-items: center; justify-content: space-between; z-index: 2000; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: auto; min-width: 450px; height: 60px; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); overflow: hidden; cursor: pointer; }
        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: auto; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; max-width: 900px; margin: 0 40px; }
        .nav-item { text-decoration: none; color: #ccc; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; position: relative; }
        .nav-item:hover, .nav-item.active { color: #F4D03F; }
        .menu-icon { width: 24px; height: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer; z-index: 2005; }
        .menu-line { width: 100%; height: 1px; background-color: #fff; transition: all 0.3s ease; }
        @media (min-width: 769px) {
            .smart-nav:hover, .smart-nav.force-expand { min-width: 650px !important; background: rgba(255, 255, 255, 0.1) !important; padding: 0 30px !important; } 
            .smart-nav:hover .nav-links, .smart-nav.force-expand .nav-links { max-width: 900px !important; opacity: 1 !important; display: flex !important; } 
        }
        .smart-nav.collapsed { min-width: 150px; padding: 0 20px; } 
        .smart-nav.collapsed .nav-links { max-width: 0; opacity: 0; } 
        .header-section { padding: 220px 40px 100px 40px; text-align: center; position: relative; z-index: 10; }
        h1.page-title { font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; opacity: 0; animation: fadeInUp 1.2s forwards; color: #fff; }
        .page-desc { margin-top: 20px; font-size: 16px; color: #888; max-width: 600px; display: inline-block; opacity: 0; animation: fadeInUp 1.2s forwards; animation-delay: 0.2s; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .kinetic-wrapper { position: relative; width: 100%; overflow: hidden; padding-bottom: 200px; display: flex; flex-direction: column; gap: 15px; opacity: 0; transition: opacity 1.5s ease; }
        .kinetic-wrapper.loaded { opacity: 1; }
        .gallery-strip { display: flex; gap: 15px; width: max-content; transform: translate3d(0, 0, 0); will-change: transform; backface-visibility: hidden; perspective: 1000px; }
        .strip-item { flex-shrink: 0; width: 25vw; aspect-ratio: 9 / 16; position: relative; border-radius: 8px; overflow: hidden; background-color: #111; transform: translateZ(0); }
        #row-2 .strip-item, #row-4 .strip-item, #row-6 .strip-item { width: 60vw; aspect-ratio: 16 / 9; }
        .strip-item img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.9); transition: 0.3s ease; display: block; }
        .strip-item:hover img { filter: brightness(1.1); transform: scale(1.05); }
        .strip-caption { position: absolute; bottom: 20px; left: 20px; font-size: 2vw; font-weight: 700; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.5); z-index: 2; }
        @media (max-width: 768px) {
            .header-section { padding-bottom: 50px; }
            .smart-nav { flex-direction: column !important; width: 90% !important; max-width: 350px !important; }
            .nav-item { font-size: 28px !important; }
            .kinetic-wrapper { gap: 40px; }
            .gallery-strip { flex-direction: column; width: 100%; transform: none !important; align-items: center; }
            .strip-item, #row-2 .strip-item, #row-4 .strip-item, #row-6 .strip-item, #row-7 .strip-item { width: 100% !important; aspect-ratio: auto; }
            .strip-item.duplicate { display: none; }
        }
        .contact-widget { position: fixed; bottom: 30px; right: 30px; z-index: 2500; display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; padding: 6px; transition: 0.6s cubic-bezier(0.22, 1, 0.36, 1); cursor: pointer; }
        .contact-icon { width: 38px; height: 38px; background: #fff; color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; }
        .contact-details { opacity: 0; white-space: nowrap; transition: 0.3s ease 0.1s; }
        .contact-link { color: #ccc; text-decoration: none; font-size: 13px; display: flex; align-items: center; }
        .contact-widget:hover, .contact-widget.expanded { max-width: 380px; padding-right: 25px; }
        .contact-widget:hover .contact-details, .contact-widget.expanded .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }
      `}</style>

      <div className={`preloader ${!isLoading ? 'hidden' : ''}`}></div>
      <div className="noise-overlay"></div>

      <nav className="smart-nav" id="navbar" onClick={toggleMenu}>
        <div className="nav-header">
            <Link href="/" className="nav-logo">SAM CHOW.</Link>
            <div className="menu-icon" id="menu-btn">
                <div className="menu-line"></div><div className="menu-line"></div><div className="menu-line"></div>
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
        {/* ROW 1 (Odd: 9:16) */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-1" ref={row1Ref}>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC00127.jpg" alt="01" /><div className="strip-caption">01</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC00133.jpg" alt="02" /><div className="strip-caption">02</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC00327.jpg" alt="03" /><div className="strip-caption">03</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC00362.jpg" alt="04" /><div className="strip-caption">04</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC00380.jpg" alt="05" /><div className="strip-caption">05</div></div>
                {/* Duplicates */}
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC00127.jpg" alt="01" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC00133.jpg" alt="02" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC00327.jpg" alt="03" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC00362.jpg" alt="04" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC00380.jpg" alt="05" /></div>
            </div>
        </div>

        {/* ROW 2 (Even: 16:9) */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-2" ref={row2Ref}>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC00672.jpg" alt="06" /><div className="strip-caption">06</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC00709.jpg" alt="07" /><div className="strip-caption">07</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC00765.jpg" alt="08" /><div className="strip-caption">08</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC03300.jpg" alt="09" /><div className="strip-caption">09</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC03382.jpg" alt="10" /><div className="strip-caption">10</div></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC00672.jpg" alt="06" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC00709.jpg" alt="07" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC00765.jpg" alt="08" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC03300.jpg" alt="09" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC03382.jpg" alt="10" /></div>
            </div>
        </div>

        {/* ROW 3 (Odd: 9:16) */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-3" ref={row3Ref}>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC03905.jpg" alt="11" /><div className="strip-caption">11</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC03919.jpg" alt="12" /><div className="strip-caption">12</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC03959.jpg" alt="13" /><div className="strip-caption">13</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC03982.jpg" alt="14" /><div className="strip-caption">14</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC04086.jpg" alt="15" /><div className="strip-caption">15</div></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC03905.jpg" alt="11" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC03919.jpg" alt="12" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC03959.jpg" alt="13" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC03982.jpg" alt="14" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC04086.jpg" alt="15" /></div>
            </div>
        </div>

        {/* ROW 4 (Even: 16:9) */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-4" ref={row4Ref}>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC04087.jpg" alt="16" /><div className="strip-caption">16</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC04102.jpg" alt="17" /><div className="strip-caption">17</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC04119.jpg" alt="18" /><div className="strip-caption">18</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC04391.jpg" alt="19" /><div className="strip-caption">19</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC04662-2.jpg" alt="20" /><div className="strip-caption">20</div></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC04087.jpg" alt="16" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC04102.jpg" alt="17" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC04119.jpg" alt="18" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC04391.jpg" alt="19" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC04662-2.jpg" alt="20" /></div>
            </div>
        </div>

        {/* ROW 5 (Odd: 9:16) */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-5" ref={row5Ref}>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC04688.jpg" alt="21" /><div className="strip-caption">21</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC05608.jpg" alt="22" /><div className="strip-caption">22</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC05664.jpg" alt="23" /><div className="strip-caption">23</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC05863.jpg" alt="24" /><div className="strip-caption">24</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC05864.jpg" alt="25" /><div className="strip-caption">25</div></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC04688.jpg" alt="21" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC05608.jpg" alt="22" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC05664.jpg" alt="23" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC05863.jpg" alt="24" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC05864.jpg" alt="25" /></div>
            </div>
        </div>

        {/* ROW 6 (Even: 16:9) - 🔴 Added DSC09492 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-6" ref={row6Ref}>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC08718.jpg" alt="26" /><div className="strip-caption">26</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC08748.jpg" alt="27" /><div className="strip-caption">27</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC08760.jpg" alt="28" /><div className="strip-caption">28</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC08810.jpg" alt="29" /><div className="strip-caption">29</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC09492.jpg" alt="30" /><div className="strip-caption">30</div></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC08718.jpg" alt="26" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC08748.jpg" alt="27" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC08760.jpg" alt="28" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC08810.jpg" alt="29" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC09492.jpg" alt="30" /></div>
            </div>
        </div>

        {/* ROW 7 (Odd: 9:16) - 🔴 Added DSC09480 & DSC09482 */}
        <div className="mobile-track">
            <div className="gallery-strip" id="row-7" ref={row7Ref}>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC06114.jpg" alt="31" /><div className="strip-caption">31</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC07850.jpg" alt="32" /><div className="strip-caption">32</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC09908.jpg" alt="33" /><div className="strip-caption">33</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC09480.jpg" alt="34" /><div className="strip-caption">34</div></div>
                <div className="strip-item"><img src="/images/photography_images_optimized/DSC09482.jpg" alt="35" /><div className="strip-caption">35</div></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC06114.jpg" alt="31" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC07850.jpg" alt="32" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC09908.jpg" alt="33" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC09480.jpg" alt="34" /></div>
                <div className="strip-item duplicate"><img src="/images/photography_images_optimized/DSC09482.jpg" alt="35" /></div>
            </div>
        </div>
      </div>

      <div className={`contact-widget ${isContactExpanded ? 'expanded' : ''}`} id="contact-bubble" onClick={toggleContact}>
        <div className="contact-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
        <div className="contact-details">
            <a href="https://wa.me/85267012420" target="_blank" className="contact-link" style={{ color: '#fff' }}><span className="label">WHATSAPP</span>6701 2420</a>
            <a href="mailto:chowfh254281@gmail.com" className="contact-link" style={{ color: '#fff' }}><span className="label">MAIL</span>chowfh254281@gmail.com</a>
        </div>
      </div>
    </>
  );
}
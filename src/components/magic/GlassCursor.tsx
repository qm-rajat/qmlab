import React, { useEffect, useRef } from 'react';

export default function GlassCursor() {
  const layerRef = useRef<HTMLDivElement>(null);
  const rippleLayerRef = useRef<HTMLDivElement>(null);
  const dropGlowRef = useRef<HTMLDivElement>(null);
  const shineWrapRef = useRef<HTMLDivElement>(null);
  const dropPosRef = useRef<HTMLDivElement>(null);
  const dropRotateRef = useRef<HTMLDivElement>(null);
  const dropHeadRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>(Array(7).fill(null));

  const mouse = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const head = useRef({ x: mouse.current.x, y: mouse.current.y });
  const prevHead = useRef({ x: head.current.x, y: head.current.y });
  const trail = useRef(Array(7).fill(0).map(() => ({ x: mouse.current.x, y: mouse.current.y })));
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    if (isTouch) return;

    let rafId: number;

    const animate = () => {
      prevHead.current.x = head.current.x;
      prevHead.current.y = head.current.y;
      
      head.current.x += (mouse.current.x - head.current.x) * 0.35;
      head.current.y += (mouse.current.y - head.current.y) * 0.35;

      const vx = head.current.x - prevHead.current.x;
      const vy = head.current.y - prevHead.current.y;
      const speed = Math.min(Math.hypot(vx, vy), 40);
      const angle = speed > 0.15 ? Math.atan2(vy, vx) * 180 / Math.PI : 0;
      const stretch = 1 + speed * 0.028;

      if (dropPosRef.current) dropPosRef.current.style.transform = `translate3d(${head.current.x}px, ${head.current.y}px, 0)`;
      if (dropRotateRef.current) dropRotateRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scaleX(${stretch.toFixed(3)})`;
      if (shineWrapRef.current) shineWrapRef.current.style.transform = `translate3d(${head.current.x}px, ${head.current.y}px, 0)`;
      if (dropGlowRef.current) dropGlowRef.current.style.transform = `translate3d(${head.current.x}px, ${head.current.y}px, 0)`;

      let prev = { ...head.current };
      for (let i = 0; i < trail.current.length; i++) {
        const p = trail.current[i];
        const lag = Math.max(0.34 - i * 0.03, 0.14);
        p.x += (prev.x - p.x) * lag;
        p.y += (prev.y - p.y) * lag;
        
        if (trailRefs.current[i]) {
          trailRefs.current[i]!.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        }
        prev = { ...p };
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (layerRef.current) layerRef.current.style.opacity = '1';

      // Check hover
      const checkClickable = (el: HTMLElement | null): boolean => {
        if (!el) return false;
        const tag = el.tagName?.toLowerCase();
        if (tag === 'button' || tag === 'a' || tag === 'input' || tag === 'select' || tag === 'textarea' || el.getAttribute('role') === 'button') return true;
        if (el.className && typeof el.className === 'string' && el.className.includes('cursor-pointer')) return true;
        return checkClickable(el.parentElement);
      };

      const isHovering = checkClickable(e.target as HTMLElement);
      if (isHovering) {
        dropRotateRef.current?.classList.add('is-hover');
        shineWrapRef.current?.classList.add('is-hover');
        dropGlowRef.current?.classList.add('is-hover');
      } else {
        dropRotateRef.current?.classList.remove('is-hover');
        shineWrapRef.current?.classList.remove('is-hover');
        dropGlowRef.current?.classList.remove('is-hover');
      }
    };

    const handleMouseLeave = () => { if (layerRef.current) layerRef.current.style.opacity = '0'; };
    const handleMouseEnter = () => { if (layerRef.current) layerRef.current.style.opacity = '1'; };

    const handleMouseDown = (e: MouseEvent) => {
      if (dropHeadRef.current) {
        dropHeadRef.current.classList.remove('is-click');
        void dropHeadRef.current.offsetWidth; // trigger reflow
        dropHeadRef.current.classList.add('is-click');
      }

      if (rippleLayerRef.current) {
        const r = document.createElement('div');
        r.className = 'click-ripple';
        r.style.left = e.clientX + 'px';
        r.style.top = e.clientY + 'px';
        rippleLayerRef.current.appendChild(r);
        r.addEventListener('animationend', () => r.remove());
      }
    };

    const handleAnimationEnd = () => {
      if (dropHeadRef.current) dropHeadRef.current.classList.remove('is-click');
    };

    if (dropHeadRef.current) dropHeadRef.current.addEventListener('animationend', handleAnimationEnd);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      if (dropHeadRef.current) dropHeadRef.current.removeEventListener('animationend', handleAnimationEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouch]);

  if (typeof window === 'undefined' || isTouch) return null;

  return (
    <>
      <style>{`
        #cursor-layer { position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:0; transition:opacity .25s ease; }
        #ripple-layer { position:fixed; inset:0; pointer-events:none; z-index:9998; }
        .drop-goo { position:absolute; top:0; left:0; filter:url(#goo-filter); opacity:.3; }
        .trail-dot { position:absolute; top:0; left:0; border-radius:50%; background:radial-gradient(circle at 35% 30%, #ffffff 0%, #66b3ff 42%, #0084ff 75%, #0052cc 100%); will-change:transform; }
        .drop-pos { position:absolute; top:0; left:0; will-change:transform; }
        .drop-rotate { position:absolute; top:0; left:0; width:40px; height:40px; will-change:transform; }
        .drop-head { width:100%; height:100%; border-radius:50%; background:radial-gradient(circle at 32% 26%, #ffffff 0%, #66b3ff 38%, #0084ff 72%, #0052cc 100%); box-shadow: inset -3px -4px 8px rgba(3,20,35,.3), inset 2px 3px 5px rgba(255,255,255,.65); transition:width .18s ease, height .18s ease, box-shadow .2s ease; }
        .drop-rotate.is-hover .drop-head { box-shadow: inset -3px -4px 8px rgba(3,20,35,.22), inset 2px 3px 5px rgba(255,255,255,.7); }
        .drop-glow { position:absolute; top:-30px; left:-30px; width:60px; height:60px; border-radius:50%; background:radial-gradient(circle, rgba(0,132,255,.4) 0%, rgba(0,132,255,0) 70%); will-change:transform; pointer-events:none; filter:blur(2px); transition:opacity .2s ease; opacity:.55; }
        .drop-glow.is-hover { opacity:.9; }
        @keyframes dropClick { 0% { transform:scale(1,1); } 28% { transform:scale(1.38,0.58); } 52% { transform:scale(0.68,1.34); } 72% { transform:scale(1.16,0.88); } 88% { transform:scale(0.94,1.04); } 100% { transform:scale(1,1); } }
        .drop-head.is-click { animation:dropClick .5s cubic-bezier(.32,1.6,.4,1) 1; }
        .drop-shine-wrap { position:absolute; top:0; left:0; width:0; height:0; will-change:transform; }
        .drop-shine { position:absolute; left:50%; top:50%; width:4px; height:4px; border-radius:50%; background:#fff; box-shadow:0 0 6px 1px rgba(255,255,255,.9); transform:translate(-50%,-50%); opacity:.85; }
        .drop-glint { position:absolute; left:50%; top:50%; width:2px; height:0px; background:linear-gradient(180deg, transparent, #cce6ff, #ffffff, #cce6ff, transparent); border-radius:2px; transform:translate(-50%,-50%) scaleY(0); opacity:0; transition:opacity .2s ease, transform .28s cubic-bezier(.3,1.6,.4,1); filter:drop-shadow(0 0 4px rgba(0,132,255,.9)); }
        .drop-shine-wrap.is-hover .drop-glint { height:26px; opacity:1; transform:translate(-50%,-50%) scaleY(1); animation:glintPulse 1.1s ease-in-out infinite; }
        @keyframes glintPulse { 0%,100% { opacity:.55; } 50% { opacity:1; } }
        .click-ripple { position:fixed; left:0; top:0; width:8px; height:8px; border-radius:50%; border:1.5px solid rgba(0,132,255,.65); transform:translate(-50%,-50%); pointer-events:none; animation:rippleExpand .6s ease-out forwards; }
        @keyframes rippleExpand { to { width:80px; height:80px; opacity:0; border-width:.5px; } }
        @media (prefers-reduced-motion: reduce) { .drop-head.is-click { animation:none; } .drop-shine-wrap.is-hover .drop-glint { animation:none; } .click-ripple { display:none; } }
      `}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="goo-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
          <feColorMatrix in="blur" mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <div id="ripple-layer" ref={rippleLayerRef}></div>

      <div id="cursor-layer" ref={layerRef}>
        <div className="drop-glow" ref={dropGlowRef}></div>
        <div className="drop-goo">
          {Array.from({ length: 7 }).map((_, i) => {
            const size = 40 * (1 - i * 0.11);
            return (
              <div
                key={i}
                className="trail-dot"
                style={{
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                }}
                ref={(el) => {
                  trailRefs.current[i] = el;
                }}
              />
            );
          })}
          <div className="drop-pos" ref={dropPosRef}>
            <div className="drop-rotate" ref={dropRotateRef}>
              <div className="drop-head" ref={dropHeadRef}></div>
            </div>
          </div>
        </div>
        <div className="drop-shine-wrap" ref={shineWrapRef}>
          <div className="drop-shine"></div>
          <div className="drop-glint"></div>
        </div>
      </div>
    </>
  );
}

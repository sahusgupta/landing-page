import React, { useRef, useEffect } from 'react'

export default function Illustration({className}){
  const wrap = useRef(null)

  useEffect(()=>{
    const el = wrap.current
    if(!el) return
    function onMove(e){
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--mx', (x*12).toFixed(2) + 'deg')
      el.style.setProperty('--my', (y*8).toFixed(2) + 'deg')
      el.style.setProperty('--tx', (x*8).toFixed(2) + 'px')
      el.style.setProperty('--ty', (y*6).toFixed(2) + 'px')
    }
    function onLeave(){
      el.style.setProperty('--mx','0deg')
      el.style.setProperty('--my','0deg')
      el.style.setProperty('--tx','0px')
      el.style.setProperty('--ty','0px')
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return ()=>{ el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  },[])

  return (
    <div ref={wrap} className={"illustration-card " + (className||'')}>
      <svg viewBox="0 0 280 220" className="illus-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="abstract illustration">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="280" height="220" rx="18" fill="url(#g1)" opacity="0.06" />
        <g transform="translate(24,28) scale(0.9)">
          <rect x="0" y="0" width="200" height="120" rx="12" fill="#fff" opacity="0.95" strokeOpacity="0.04" />
          <circle cx="30" cy="24" r="8" fill="#06b6d4" />
          <circle cx="52" cy="24" r="8" fill="#7c3aed" />
          <rect x="12" y="46" width="176" height="12" rx="6" fill="#f3f9fb" />
          <rect x="12" y="66" width="140" height="10" rx="5" fill="#eef7fb" />
          <rect x="12" y="82" width="100" height="10" rx="5" fill="#eef7fb" />
          <g transform="translate(0,100)">
            <rect x="0" y="0" width="72" height="72" rx="8" fill="#fff" stroke="#eaf8fb" />
            <rect x="82" y="0" width="92" height="36" rx="8" fill="#fff" stroke="#eef6fb" />
            <rect x="82" y="46" width="60" height="26" rx="6" fill="#fff" stroke="#eef6fb" />
          </g>
        </g>
      </svg>
    </div>
  )
}

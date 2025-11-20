import React, { useEffect, useRef } from 'react'

// LottieIllustration
// Props:
//  - src: URL or local path to a lottie json (string). If omitted, a small default is used.
//  - loop, autoplay: booleans
// Usage: <LottieIllustration src="/animations/hero.json" />
export default function LottieIllustration({ src, loop = true, autoplay = true, className = '' }){
  const container = useRef(null)
  const instanceRef = useRef(null)

  useEffect(()=>{
    const jsonUrl = src || 'https://assets8.lottiefiles.com/packages/lf20_tfb3estd.json'
    // cleanup existing
    if(instanceRef.current){
      instanceRef.current.destroy()
      instanceRef.current = null
    }

    // lazy-load lottie-web so it doesn't inflate the initial bundle
    let cancelled = false
    import('lottie-web').then((mod)=>{
      if(cancelled) return
      const lottie = mod.default || mod
      try{
        instanceRef.current = lottie.loadAnimation({
          container: container.current,
          renderer: 'svg',
          loop: loop,
          autoplay: autoplay,
          path: jsonUrl
        })
      }catch(e){
        // ignore
      }
    }).catch(()=>{
      // ignore import failure
    })

  return ()=>{ cancelled = true; if(instanceRef.current){ instanceRef.current.destroy(); instanceRef.current = null } }
  }, [src, loop, autoplay])

  return (
    <div className={`lottie-illustration ${className}`} aria-hidden="true">
      <div ref={container} style={{width: '100%', height: '100%'}} />
    </div>
  )
}

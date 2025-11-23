import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { PortfolioContext } from '../store/PortfolioContext'
import LottieIllustration from '../components/LottieIllustration'

function useTypewriter(words, speed = 80, pause = 1400){
  const [txt, setTxt] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(()=>{
    const current = words[wordIndex % words.length]
    const timeout = setTimeout(()=>{
      if(!isDeleting){
        const next = current.slice(0, txt.length + 1)
        setTxt(next)
        if(next === current) setIsDeleting(true)
      } else {
        const next = current.slice(0, Math.max(0, txt.length - 1))
        setTxt(next)
        if(next === ''){
          setIsDeleting(false)
          setWordIndex(i=> i + 1)
        }
      }
    }, txt === current && !isDeleting ? pause : speed)
    return ()=> clearTimeout(timeout)
  }, [txt, isDeleting, wordIndex, words, speed, pause])

  return txt
}

function Stat({label, value, helper}){
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-helper">{helper}</div>
    </div>
  )
}

function ProjectCard({project}){
  if(!project) return null
  return (
    <article className="project-card-lite">
      <div className="project-meta">
        <span className="pill">Featured</span>
        <span className="small muted">{(project.tech||[]).slice(0,3).join(', ')}</span>
      </div>
      <h3>{project.title}</h3>
      <p className="muted">{project.description?.slice(0,120) || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</p>
      <Link to="/projects" className="ghost-link">Open project -&gt;</Link>
    </article>
  )
}

function InfoCard({item, tag}){
  if(!item) return null
  return (
    <article className="info-card">
      <div className="info-meta">
        <span className="pill muted-pill">{tag}</span>
        {item.date && <span className="small muted">{item.date}</span>}
      </div>
      <h3>{item.title}</h3>
      {item.subtitle && <div className="small muted">{item.subtitle}</div>}
      {item.description && <p className="muted">{item.description.slice(0,120)}</p>}
    </article>
  )
}

export default function Home(){
  const { data } = useContext(PortfolioContext)

  return (
    <div className="home-shell">
      <section className="hero-new container">
        <div className="hero-copy hero-left">
          <div className="eyebrow">hi, i'm{/* replace with greeting e.g., "Hello, I'm" */}</div>
          <h1 className="hero-heading">sahus <span className="gradient-text name-underline">gupta</span></h1>
          <p className="hero-blurb">i build data-driven systems that help inform decision-making {/* replace with short personal elevator pitch */}</p>

          <div className="chip-row">

          </div>

          <div className="cta-row">
            <Link to="/projects" className="btn primary">View projects</Link>
            <Link to="/contact" className="btn ghost">Get in touch</Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-shell">
            <LottieIllustration className="hero-lottie" />
          </div>
        </div>
      </section>
    </div>
  );
}

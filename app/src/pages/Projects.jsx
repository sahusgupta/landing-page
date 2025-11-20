import React, {useContext} from 'react'
import { PortfolioContext } from '../store/PortfolioContext'

export default function Projects(){
  const {data} = useContext(PortfolioContext)
  return (
    <section>
      <h1>Projects</h1>
      <div className="modern-grid">
        {data.projects.map((p, i) => (
          <article key={p.id} className="card" data-aos="fade-up" data-aos-delay={i*80}>
            <div className="card-head">
              <h3>{p.title}</h3>
              <div className="tech-wrap">{(p.tech||[]).map(t=><span key={t} className="tag">{t}</span>)}</div>
            </div>
            <p className="card-desc">{p.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { PortfolioContext } from '../store/PortfolioContext'

function ResumeCard({ item, badge }) {
  if (!item) return null
  return (
    <article className="resume-card">
      <div className="resume-meta">
        <span className="pill muted-pill">{badge}</span>
        {item.date && <span className="small muted">{item.date}</span>}
      </div>
      <h3>{item.title}</h3>
      {item.subtitle && <div className="small muted">{item.subtitle}</div>}
      {item.description && <p className="muted">{item.description}</p>}
      {item.source && <div className="small muted">{item.source}</div>}
      {Array.isArray(item.bullets) && item.bullets.length > 0 && (
        <ul className="bullet-list">
          {item.bullets.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      )}
      {item.url && <a className="ghost-link" href={item.url} target="_blank" rel="noreferrer">View</a>}
    </article>
  )
}

export default function Resume(){
  const { data } = useContext(PortfolioContext)
  const education = data.education || []
  const experience = data.experience || []
  const awards = data.awards || []
  const featured = data.featured || []

  return (
    <section className="resume container">
      <header className="resume-hero">
        <h1>Resume</h1>
      </header>

      <div className="resume-grid">
        <div className="section-surface">
          <div className="section-head">
            <div>
              <p className="eyebrow">Education</p>
            </div>
          </div>
          <div className="info-grid-inner">
            {education.length === 0 && <div className="muted">Add education to your data.</div>}
            {education.map(item => <ResumeCard key={item.id || item.title} item={item} badge="School" />)}
          </div>
        </div>

        <div className="section-surface">
          <div className="section-head">
            <div>
              <p className="eyebrow">Experience</p>
            </div>
            <Link to="/projects" className="ghost-link">See projects</Link>
          </div>
          <div className="info-grid-inner">
            {experience.length === 0 && <div className="muted">Add experience to your data.</div>}
            {experience.map(item => <ResumeCard key={item.id || item.title} item={item} badge="Role" />)}
          </div>
        </div>

        <div className="section-surface">
          <div className="section-head">
            <div>
              <p className="eyebrow">Awards & Honors</p>
            </div>
          </div>
          <div className="info-grid-inner">
            {awards.length === 0 && <div className="muted">Add awards to your data.</div>}
            {awards.map(item => <ResumeCard key={item.id || item.title} item={item} badge="Award" />)}
          </div>
        </div>

        <div className="section-surface">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured in</p>
            </div>
          </div>
          <div className="info-grid-inner">
            {featured.length === 0 && <div className="muted">Add featured items to your data.</div>}
            {featured.map(item => <ResumeCard key={item.id || item.title} item={item} badge="Feature" />)}
          </div>
        </div>
      </div>
    </section>
  )
}

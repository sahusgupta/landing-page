import React, {useContext, useMemo, useState, useEffect} from 'react'
import { PortfolioContext } from '../store/PortfolioContext'

const placeholderImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
const PAGE_SIZE = 6

function GithubIcon({size = 20}){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.11.79-.25.79-.56v-2c-3.22.7-3.89-1.55-3.89-1.55-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.74 1.27 3.41.97.11-.76.41-1.27.74-1.57-2.57-.29-5.28-1.29-5.28-5.73 0-1.27.46-2.31 1.2-3.12-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.19a11.07 11.07 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.57.23 2.73.12 3.02.75.81 1.2 1.85 1.2 3.12 0 4.45-2.72 5.43-5.31 5.71.42.36.8 1.08.8 2.18v3.23c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Projects(){
  const {data} = useContext(PortfolioContext)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(()=>{ setPage(1) }, [query])

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    if(!q) return data.projects
    return data.projects.filter(p =>
      (p.tech||[]).some(t => t.toLowerCase().includes(q))
    )
  }, [data.projects, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(start, start + PAGE_SIZE)

  function goToPage(next){
    const clamped = Math.min(Math.max(next, 1), totalPages)
    setPage(clamped)
  }

  return (
    <section>
      <h1>Projects</h1>
      <div className="project-controls">
        <input
          type="search"
          placeholder="Search by tech tag (e.g. React, Flask)"
          value={query}
          onChange={e=> setQuery(e.target.value)}
          className="project-search"
        />
        <div className="project-count">
          {filtered.length} result{filtered.length === 1 ? '' : 's'}
        </div>
      </div>
      <div className="project-gallery">
        {pageItems.map((p, i) => {
          const hasLive = Boolean(p.liveUrl)
          const hasRepo = Boolean(p.repoUrl)
          const imageSrc = p.image || placeholderImage
          const statusLabel = p.status || 'In progress'
          return (
            <article key={p.id} className="project-card" data-aos="fade-up" data-aos-delay={i*80}>
              <div className="project-thumb">
                <img src={imageSrc} alt={`${p.title} preview`} loading="lazy" />
              </div>
              <div className="project-body">
                <div className="project-top">
                  <div className="project-info">
                    {statusLabel && <div className="status-pill">{statusLabel}</div>}
                    <h3>{p.title}</h3>
                    <p className="card-desc">{p.description}</p>
                  </div>
                  {(hasLive || hasRepo) && (
                    <div className="project-links">
                      {hasLive && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="project-link">View project</a>}
                      {hasRepo && (
                        <a href={p.repoUrl} target="_blank" rel="noreferrer" className="icon-link" aria-label={`${p.title} GitHub repository`}>
                          <GithubIcon />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="tech-wrap">
                  {(p.tech||[]).map(t=><span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={()=>goToPage(page-1)} disabled={safePage === 1}>Prev</button>
          <div className="page-indicator">Page {safePage} of {totalPages}</div>
          <button className="page-btn" onClick={()=>goToPage(page+1)} disabled={safePage === totalPages}>Next</button>
        </div>
      )}
    </section>
  )
}

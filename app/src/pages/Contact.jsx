import React from 'react'
import { Link } from 'react-router-dom'

const contactOptions = [
  {
    title: 'Email',
    description: 'Fastest way to reach me. I reply within a day.',
    action: { label: 'Email sahusgupta@tamu.edu', href: 'mailto:sahusgupta@tamu.edu' }
  },
  {
    title: 'Project inquiry',
    description: 'Have an idea or need a build partner? Share a few lines and we can scope it.',
    action: { label: 'Start with email', href: 'mailto:sahusgupta@tamu.edu?subject=Project%20inquiry' }
  },
  {
    title: 'Learn more',
    description: 'Browse my recent work and roles while you wait for a reply.',
    links: [
      { label: 'View projects', to: '/projects' },
      { label: 'Resume', to: '/resume' }
    ]
  }
]

export default function Contact(){
  return (
    <section className="container contact-page">
      <div className="contact-hero contact-cta">
        <div>
          <p className="eyebrow">Let&apos;s talk</p>
          <h1>Ready to collaborate?</h1>
          <p className="muted">I keep my inbox open for interesting problems, internships, and collaborations. Drop a line and I&apos;ll get back within 24 hours.</p>
        </div>
        <a className="btn primary" href="mailto:sahusgupta@tamu.edu">Email me</a>
      </div>

      <div className="contact-grid">
        {contactOptions.map((option) => (
          <div key={option.title} className="contact-card">
            <div className="contact-card-head">
              <div className="pill muted-pill small">{option.title}</div>
              {option.action && (
                <a className="ghost-link" href={option.action.href}>{option.action.label}</a>
              )}
            </div>
            <p className="muted">{option.description}</p>
            {Array.isArray(option.links) && option.links.length > 0 && (
              <div className="contact-links">
                {option.links.map(link => (
                  <Link key={link.label} to={link.to} className="chip">{link.label}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

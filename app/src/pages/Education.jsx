import React, {useContext} from 'react'
import { PortfolioContext } from '../store/PortfolioContext'

export default function Education(){
  const {data} = useContext(PortfolioContext)
  return (
    <section>
      <h1>Education</h1>
      {(data.education||[]).map((ed,i)=> (
        <div key={ed.id} className="edu-block" data-aos="fade-up" data-aos-delay={i*90}>
          <h3>{ed.title}</h3>
          <div className="edu-date">{ed.date}</div>
          <p>{ed.description}</p>
        </div>
      ))}
    </section>
  )
}

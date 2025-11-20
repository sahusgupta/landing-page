import React, {useContext} from 'react'
import { PortfolioContext } from '../store/PortfolioContext'

export default function Experience(){
  const {data} = useContext(PortfolioContext)
  return (
    <section>
      <h1>Experience</h1>
      {data.experience.map((e,i)=> (
        <div key={e.id} className="exp-block" data-aos="fade-up" data-aos-delay={i*90}>
          <h3>{e.title}</h3>
          <div className="exp-date">{e.date}</div>
          <p>{e.description}</p>
        </div>
      ))}
    </section>
  )
}

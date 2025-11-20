import React, {createContext, useState, useEffect} from 'react'

const STORAGE_KEY = 'portfolioData_v1'
export const PortfolioContext = createContext()

const defaultData = {
  projects: [
    { id: 'p1', title: 'Gradus App', tech:['Flutter','Puppeteer.js','Python','Golang'], description: 'A collaborative Flutter mobile application that securely scrapes data from Katy ISD\'s grade center.', links:[] },
    { id: 'p2', title: 'PlatoAI', tech:['Flask','JavaScript','PostgreSQL','OAuth v2'], description:'AI-powered college essay guidance platform.', links:[] }
  ],
  // experience = prior work, internships, leadership positions
  experience: [
    { id: 'w1', title: 'Summer Research Intern — XYZ Lab', date: 'Jun 2024 - Aug 2024', description: 'Worked on a small research project involving data pipelines and model evaluation.', bullets:[] }
  ],
  // education = schools, degrees, coursework
  education: [
    { id: 'ed1', title: 'Texas A&M University', date: 'Aug 2025 - May 2029', description: 'BS in Computer Science & Mathematics', bullets:[] },
    { id: 'ed2', title: 'Obra D. Tompkins High School', date: '2021 - 2025', description: 'High School Diploma with AP coursework', bullets:[] }
  ],
  awards: [
    { id: 'a1', title: 'Dean\'s List', date: 'Fall 2024', description: 'Academic honors for high GPA.' },
    { id: 'a2', title: 'Hackathon Finalist', date: '2023', description: 'Built a working prototype over 24 hours.' }
  ],
  featured: [
    { id: 'f1', title: 'Interview with Local News', source: 'Katy ISD Times', url: 'https://example.com/article', date: '2024', description: 'Discussed building student-focused tools.' },
    { id: 'f2', title: 'Project Spotlight', source: 'Tech Student Blog', url: 'https://example.com/spotlight', date: '2023', description: 'Highlight on Gradus App and its impact.' }
  ]
}

export function PortfolioProvider({children}){
  const [data, setData] = useState(()=>{
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : defaultData
    }catch(e){ return defaultData }
  })

  useEffect(()=>{ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }catch(e){} }, [data])

  // hydrate projects from external projects.json if present (expects { projects: [...] } shape)
  useEffect(()=>{
    fetch('/projects.json')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if(!json || !Array.isArray(json.projects)) return
        setData(prev => ({ ...prev, projects: json.projects }))
      })
      .catch(()=>{})
  }, [])

  function saveData(next){ setData(next) }
  function resetToDefaults(){ setData(defaultData) }
  function exportJSON(){ return JSON.stringify(data, null, 2) }
  function importJSON(json){ try{ setData(json); return true }catch(e){ return false } }

  return (
    <PortfolioContext.Provider value={{data, saveData, resetToDefaults, exportJSON, importJSON}}>
      {children}
    </PortfolioContext.Provider>
  )
}

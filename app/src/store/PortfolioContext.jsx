import React, {createContext, useState, useEffect} from 'react'

const STORAGE_KEY = 'portfolioData_v1'
export const PortfolioContext = createContext()

const defaultData = {
  projects: [
    
  ],
  experience: [
    
  ],
  education: [
    
  ],
  awards: [
   
  ],
  featured: [
    
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

  // hydrate data from JSON files in /public
  useEffect(()=>{
    let cancelled = false
    const basePath = (import.meta?.env?.BASE_URL || '/').replace(/\/+$/,'')
    const sources = [
      { key: 'projects', path: 'projects.json' },
      { key: 'experience', path: 'experience.json' },
      { key: 'education', path: 'education.json' },
      { key: 'awards', path: 'awards.json' },
      { key: 'featured', path: 'featured.json' }
    ]

    async function hydrateFromJson(){
      const results = await Promise.all(
        sources.map(async ({key, path}) => {
          const url = `${basePath}/${path.replace(/^\/+/, '')}`
          try{
            const res = await fetch(url)
            if(!res.ok) return null
            const json = await res.json()
            const payload = json?.[key]
            return Array.isArray(payload) ? { [key]: payload } : null
          }catch(e){ return null }
        })
      )

      const merged = results.filter(Boolean).reduce((acc, item) => ({ ...acc, ...item }), {})
      if(!cancelled && Object.keys(merged).length){
        setData(prev => ({ ...prev, ...merged }))
      }
    }

    hydrateFromJson()
    return () => { cancelled = true }
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

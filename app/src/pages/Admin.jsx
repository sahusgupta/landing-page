import React, {useContext, useState} from 'react'
import { PortfolioContext } from '../store/PortfolioContext'

export default function Admin(){
  const {data, saveData, resetToDefaults, exportJSON, importJSON} = useContext(PortfolioContext)
  const [projForm, setProjForm] = useState({title:'',tech:'',description:''})
  const [expForm, setExpForm] = useState({title:'',date:'',description:''})
  const [eduForm, setEduForm] = useState({title:'',date:'',description:''})

  function addProject(ev){
    ev.preventDefault();
    const tech = projForm.tech.split(',').map(s=>s.trim()).filter(Boolean)
    const newP = { id: 'id_'+Math.random().toString(36).slice(2,10), title: projForm.title, tech, description: projForm.description, links: [] }
    const next = {...data, projects: [newP, ...data.projects]}
    saveData(next)
    setProjForm({title:'',tech:'',description:''})
    alert('Project added')
  }

  function deleteProject(id){
    if(!confirm('Delete this project?')) return;
    const next = {...data, projects: data.projects.filter(p=>p.id!==id)}
    saveData(next)
  }

  function addExperience(ev){
    ev.preventDefault();
    const newE = { id: 'id_'+Math.random().toString(36).slice(2,10), title: expForm.title, date: expForm.date, description: expForm.description, bullets: [] }
    const next = {...data, experience: [newE, ...data.experience]}
    saveData(next)
    setExpForm({title:'',date:'',description:''})
    alert('Experience added')
  }

  function addEducation(ev){
    ev.preventDefault();
    const newEd = { id: 'id_'+Math.random().toString(36).slice(2,10), title: eduForm.title, date: eduForm.date, description: eduForm.description, bullets: [] }
    const next = {...data, education: [newEd, ...(data.education||[])]}
    saveData(next)
    setEduForm({title:'',date:'',description:''})
    alert('Education added')
  }

  function deleteExperience(id){
    if(!confirm('Delete this item?')) return;
    const next = {...data, experience: data.experience.filter(e=>e.id!==id)}
    saveData(next)
  }

  function deleteEducation(id){
    if(!confirm('Delete this education item?')) return;
    const next = {...data, education: (data.education||[]).filter(e=>e.id!==id)}
    saveData(next)
  }

  function handleExport(){
    const json = exportJSON()
    const blob = new Blob([json],{type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='portfolio-data.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  function handleImport(ev){
    const f = ev.target.files && ev.target.files[0];
    if(!f) return;
    const r = new FileReader();
    r.onload = ()=>{ try{ importJSON(JSON.parse(r.result)); alert('Imported'); }catch(e){ alert('Invalid JSON') } }
    r.readAsText(f)
  }

  return (
    <section>
      <h1>Admin</h1>
      <div className="admin-grid">
        <div className="admin-panel">
          <h3>Add Project</h3>
          <form onSubmit={addProject} className="admin-form">
            <input value={projForm.title} onChange={e=>setProjForm({...projForm,title:e.target.value})} placeholder="Title" required/>
            <input value={projForm.tech} onChange={e=>setProjForm({...projForm,tech:e.target.value})} placeholder="Comma-separated tech"/>
            <textarea value={projForm.description} onChange={e=>setProjForm({...projForm,description:e.target.value})} placeholder="Description"/>
            <button className="btn primary" type="submit">Add Project</button>
          </form>

          <h3>Existing Projects</h3>
          {data.projects.map(p=> (
            <div key={p.id} className="admin-item">
              <div>
                <strong>{p.title}</strong>
                <div className="small muted">{(p.tech||[]).join(', ')}</div>
              </div>
              <div>
                <button className="btn" onClick={()=>deleteProject(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-panel">
          <h3>Add Experience</h3>
          <form onSubmit={addExperience} className="admin-form">
            <input value={expForm.title} onChange={e=>setExpForm({...expForm,title:e.target.value})} placeholder="Title" required/>
            <input value={expForm.date} onChange={e=>setExpForm({...expForm,date:e.target.value})} placeholder="Date"/>
            <textarea value={expForm.description} onChange={e=>setExpForm({...expForm,description:e.target.value})} placeholder="Description"/>
            <button className="btn primary" type="submit">Add Experience</button>
          </form>

          <h3>Existing Experience</h3>
          {data.experience.map(e=> (
            <div key={e.id} className="admin-item">
              <div>
                <strong>{e.title}</strong>
                <div className="small muted">{e.date}</div>
              </div>
              <div>
                <button className="btn" onClick={()=>deleteExperience(e.id)}>Delete</button>
              </div>
            </div>
          ))}

          <hr/>
          <h3>Add Education</h3>
          <form onSubmit={addEducation} className="admin-form">
            <input value={eduForm.title} onChange={e=>setEduForm({...eduForm,title:e.target.value})} placeholder="School / Program" required/>
            <input value={eduForm.date} onChange={e=>setEduForm({...eduForm,date:e.target.value})} placeholder="Dates"/>
            <textarea value={eduForm.description} onChange={e=>setEduForm({...eduForm,description:e.target.value})} placeholder="Description / degree"/>
            <button className="btn primary" type="submit">Add Education</button>
          </form>

          <h3>Existing Education</h3>
          {(data.education||[]).map(e=> (
            <div key={e.id} className="admin-item">
              <div>
                <strong>{e.title}</strong>
                <div className="small muted">{e.date}</div>
              </div>
              <div>
                <button className="btn" onClick={()=>deleteEducation(e.id)}>Delete</button>
              </div>
            </div>
          ))}

          <hr/>
          <div className="controls">
            <button className="btn" onClick={handleExport}>Export JSON</button>
            <input type="file" onChange={handleImport} accept="application/json" />
            <button className="btn warn" onClick={()=>{ if(confirm('Reset to defaults?')){ resetToDefaults(); alert('Reset'); } }}>Reset to Defaults</button>
          </div>
        </div>
      </div>
    </section>
  )
}

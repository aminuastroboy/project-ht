import React, {useEffect, useState} from 'react'
import Confetti from 'react-confetti'
import CycleForm from '../widgets/CycleForm'
import Reminders from '../widgets/Reminders'
import HealthTips from '../widgets/HealthTips'
import InsightsSmall from '../widgets/InsightsSmall'

export default function Home(){
  const [cycles, setCycles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  useEffect(()=>{ const s = localStorage.getItem('cycles'); if(s) setCycles(JSON.parse(s)) },[])
  useEffect(()=> localStorage.setItem('cycles', JSON.stringify(cycles)), [cycles])

  function addCycle(c){ setCycles(p=>[...p,c]); setCelebrate(true); setTimeout(()=>setCelebrate(false),3200) }
  function deleteLatest(){ if(!cycles.length) return; if(!confirm('Delete latest cycle?')) return; setCycles(p=>p.slice(0,-1)) }
  const latest = cycles.length? cycles[cycles.length-1]: null
  const daysSince = (start)=> Math.max(1, Math.floor((Date.now()-new Date(start))/(1000*60*60*24))+1)

  return (
    <div>
      {celebrate && <Confetti recycle={false} numberOfPieces={180} colors={['#ec4899','#f472b6','#d8b4fe','#f9a8d4']} />}
      <div className="card" style={{textAlign:'center'}}>
        <div className="petal-circle">{ latest ? `Day ${Math.min(daysSince(latest.start), latest.duration)}` : '—' }</div>
        <div className="small-muted" style={{marginTop:8}}>{ latest? `Started ${latest.start} • ${latest.duration} days` : 'No cycles yet — add one' }</div>
        <div style={{marginTop:10}} className="row">
          <button className="btn" onClick={()=>setShowForm(true)}>+ Add Cycle</button>
          <button style={{background:'transparent',border:'none',color:'#e11d48',cursor:'pointer'}} onClick={deleteLatest}>Delete</button>
        </div>
      </div>

      <div className="section">
        <div className="card"><Reminders/></div>
        <div className="card"><HealthTips/></div>
        <div className="card"><InsightsSmall cycles={cycles} /></div>
      </div>

      {showForm && <CycleForm onClose={()=>setShowForm(false)} onSave={(c)=>{ addCycle(c); }} />}
    </div>
  )
}

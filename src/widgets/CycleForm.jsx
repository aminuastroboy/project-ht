import React, {useState} from 'react'
export default function CycleForm({onClose,onSave}){
  const [start,setStart]=useState('')
  const [duration,setDuration]=useState(5)
  function submit(e){ e.preventDefault(); onSave({id:Date.now(), start, duration: Number(duration)}); onClose(); }
  return (
    <div className="modal-backdrop" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.3)'}}>
      <form className="card" onSubmit={submit} style={{width:320,padding:16}}>
        <h3 style={{marginTop:0}}>Add Cycle</h3>
        <label className="small-muted">Start date</label>
        <input className="input" type="date" value={start} onChange={e=>setStart(e.target.value)} required />
        <label className="small-muted" style={{marginTop:8}}>Duration (days)</label>
        <input className="input" type="number" min="1" value={duration} onChange={e=>setDuration(e.target.value)} required />
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:10}}>
          <button type="button" onClick={onClose} style={{padding:8,borderRadius:8}}>Cancel</button>
          <button className="btn" type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}

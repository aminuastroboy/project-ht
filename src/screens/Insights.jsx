import React from 'react'
import InsightsSmall from '../widgets/InsightsSmall'
import HealthTips from '../widgets/HealthTips'
import Reminders from '../widgets/Reminders'

export default function Insights(){
  const cycles = JSON.parse(localStorage.getItem('cycles')||'[]')
  return (
    <div>
      <div className="card"><InsightsSmall cycles={cycles} /></div>
      <div style={{height:12}} />
      <div className="card"><HealthTips/></div>
      <div style={{height:12}} />
      <div className="card"><Reminders/></div>
    </div>
  )
}

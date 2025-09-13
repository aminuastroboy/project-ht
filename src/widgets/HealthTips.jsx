import React from 'react'
const tips = ['Stay hydrated', 'Gentle exercise', 'Prioritize sleep', 'Track symptoms']
export default function HealthTips(){ return (
  <div>
    <h3 style={{marginTop:0}}>💡 Health Tips</h3>
    <ul style={{margin:0,paddingLeft:16}}>{tips.map((t,i)=><li key={i}>{t}</li>)}</ul>
  </div>
)}
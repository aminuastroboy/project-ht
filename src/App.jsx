import React, { useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import Home from './screens/Home'
import Calendar from './screens/Calendar'
import Insights from './screens/Insights'

export default function App(){
  const [tab, setTab] = useState('home')
  return (
    <ErrorBoundary>
      <div className="app">
        <header className="header">
          <div className="brand">🌸 Cycle Tracker</div>
          <div className="small-muted">v2</div>
        </header>
        {tab==='home' && <Home/>}
        {tab==='calendar' && <Calendar/>}
        {tab==='insights' && <Insights/>}

        <div className="footer-space" />
        <nav className="nav" role="navigation">
          <button className={tab==='home'?'active':''} onClick={()=>setTab('home')}>🏠<div style={{fontSize:11}}>Home</div></button>
          <button className={tab==='calendar'?'active':''} onClick={()=>setTab('calendar')}>📅<div style={{fontSize:11}}>Calendar</div></button>
          <button className={tab==='insights'?'active':''} onClick={()=>setTab('insights')}>📊<div style={{fontSize:11}}>Insights</div></button>
        </nav>
      </div>
    </ErrorBoundary>
  )
}

import React from 'react'
export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={hasError:false} }
  static getDerivedStateFromError(){ return {hasError:true} }
  componentDidCatch(e,i){ console.error('App error', e, i) }
  render(){ if(this.state.hasError) return <div style={{padding:20}}>Something went wrong — refresh or contact the dev</div>; return this.props.children }
}

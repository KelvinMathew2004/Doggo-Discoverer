import { useState } from 'react'
import './App.css'

function App() {

  return (
    <div className="whole-page">
      <div className="history">
        <h3 style={{ fontWeight: "bolder"}}>Who have we seen so far?</h3>

      </div>
      <div className="main-card">
        <h1 className='heading'>Veni Vici!</h1>
        <h4>Discover dogs from your wildest dreams!</h4>
        <p>🐶🐕🦮🐩🦴</p>
        <div className="dog-card">

        </div>
        <button className="discover">🔀 Discover!</button>
      </div>
      <div className="ban-list">
        <h2 style={{ fontWeight: "bolder"}}>Ban List</h2>
        <h4>Select an attribute in your listing to ban it</h4>

      </div>
    </div>
  )
}

export default App

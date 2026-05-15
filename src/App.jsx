import { useState } from 'react'
import BillScreen from './screens/BillScreen'
import SplitScreen from './screens/SplitScreen'
import ResultScreen from './screens/ResultScreen'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('bill') // 'bill' | 'split' | 'result'
  const [billData, setBillData] = useState(null)
  const [splitData, setSplitData] = useState(null)

  function handleBillNext(data) {
    setBillData(data)
    setScreen('split')
  }

  function handleSplitNext(data) {
    setSplitData(data)
    setScreen('result')
  }

  function handleReset() {
    setBillData(null)
    setSplitData(null)
    setScreen('bill')
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">🍽️</span>
        <span className="app-title">TipSplit</span>
        {screen !== 'bill' && (
          <button className="reset-btn" onClick={handleReset}>New Bill</button>
        )}
      </header>

      <main className="app-main">
        {screen === 'bill' && <BillScreen onNext={handleBillNext} />}
        {screen === 'split' && <SplitScreen billData={billData} onNext={handleSplitNext} onBack={() => setScreen('bill')} />}
        {screen === 'result' && <ResultScreen billData={billData} splitData={splitData} onReset={handleReset} />}
      </main>
    </div>
  )
}

import { useState } from 'react'
import './Screen.css'

export default function SplitScreen({ billData, onNext, onBack }) {
  const [mode, setMode] = useState('equal') // 'equal' | 'itemized'
  const [people, setPeople] = useState(2)
  const [items, setItems] = useState([
    { id: 1, name: '', price: '' }
  ])
  const [assignments, setAssignments] = useState({}) // itemId -> [personIndex]
  const [names, setNames] = useState(['Person 1', 'Person 2'])

  // ── Equal split helpers ──
  function adjustPeople(delta) {
    const next = Math.max(1, Math.min(20, people + delta))
    setPeople(next)
    setNames(prev => {
      const arr = [...prev]
      while (arr.length < next) arr.push(`Person ${arr.length + 1}`)
      return arr.slice(0, next)
    })
  }

  // ── Itemized helpers ──
  function addItem() {
    setItems(prev => [...prev, { id: Date.now(), name: '', price: '' }])
  }

  function updateItem(id, field, val) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it))
  }

  function removeItem(id) {
    setItems(prev => prev.filter(it => it.id !== id))
    setAssignments(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  function toggleAssign(itemId, personIdx) {
    setAssignments(prev => {
      const cur = prev[itemId] || []
      const next = cur.includes(personIdx) ? cur.filter(i => i !== personIdx) : [...cur, personIdx]
      return { ...prev, [itemId]: next }
    })
  }

  function handleNext() {
    if (mode === 'equal') {
      onNext({ mode: 'equal', people, names })
    } else {
      onNext({ mode: 'itemized', people, names, items, assignments })
    }
  }

  const canProceed = mode === 'equal'
    ? people >= 1
    : items.length > 0 && items.every(it => it.price !== '')

  return (
    <div className="screen">
      <h2 className="screen-title">How to Split?</h2>

      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'equal' ? 'mode-tab--active' : ''}`} onClick={() => setMode('equal')}>
          Split Equally
        </button>
        <button className={`mode-tab ${mode === 'itemized' ? 'mode-tab--active' : ''}`} onClick={() => setMode('itemized')}>
          By Item
        </button>
      </div>

      {mode === 'equal' && (
        <div className="card">
          <label className="field-label">Number of people</label>
          <div className="counter-row">
            <button className="counter-btn" onClick={() => adjustPeople(-1)}>−</button>
            <span className="counter-val">{people}</span>
            <button className="counter-btn" onClick={() => adjustPeople(1)}>+</button>
          </div>

          <div className="names-list">
            {names.map((name, i) => (
              <input
                key={i}
                className="input name-input"
                type="text"
                value={name}
                onChange={e => {
                  const arr = [...names]; arr[i] = e.target.value; setNames(arr)
                }}
                placeholder={`Person ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {mode === 'itemized' && (
        <div className="card">
          <label className="field-label">Number of people</label>
          <div className="counter-row" style={{ marginBottom: 16 }}>
            <button className="counter-btn" onClick={() => adjustPeople(-1)}>−</button>
            <span className="counter-val">{people}</span>
            <button className="counter-btn" onClick={() => adjustPeople(1)}>+</button>
          </div>

          <div className="names-list" style={{ marginBottom: 20 }}>
            {names.map((name, i) => (
              <input
                key={i}
                className="input name-input"
                type="text"
                value={name}
                onChange={e => {
                  const arr = [...names]; arr[i] = e.target.value; setNames(arr)
                }}
                placeholder={`Person ${i + 1}`}
              />
            ))}
          </div>

          <label className="field-label">Items</label>
          {items.map(item => (
            <div key={item.id} className="item-block">
              <div className="item-row">
                <input
                  className="input item-name"
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={e => updateItem(item.id, 'name', e.target.value)}
                />
                <div className="input-row item-price-row">
                  <span className="input-prefix">$</span>
                  <input
                    className="input"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={item.price}
                    onChange={e => updateItem(item.id, 'price', e.target.value)}
                  />
                </div>
                {items.length > 1 && (
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                )}
              </div>
              <div className="assign-row">
                <span className="assign-label">Who ordered this?</span>
                <div className="assign-chips">
                  {names.map((name, i) => (
                    <button
                      key={i}
                      className={`assign-chip ${(assignments[item.id] || []).includes(i) ? 'assign-chip--active' : ''}`}
                      onClick={() => toggleAssign(item.id, i)}
                    >
                      {name || `P${i + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button className="btn-secondary" onClick={addItem} style={{ marginTop: 12 }}>
            + Add Item
          </button>
        </div>
      )}

      <div className="btn-row">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <button className="btn-primary btn-primary--flex" onClick={handleNext} disabled={!canProceed}>
          See Results →
        </button>
      </div>
    </div>
  )
}

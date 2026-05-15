import { useState } from 'react'
import './Screen.css'

const QUICK_TIPS = [15, 18, 20, 25]

export default function BillScreen({ onNext }) {
  const [subtotal, setSubtotal] = useState('')
  const [tax, setTax] = useState('')
  const [tipPct, setTipPct] = useState(18)
  const [customTip, setCustomTip] = useState('')
  const [tipOnPreTax, setTipOnPreTax] = useState(true)
  const [usingCustom, setUsingCustom] = useState(false)

  const subtotalNum = parseFloat(subtotal) || 0
  const taxNum = parseFloat(tax) || 0
  const activeTip = usingCustom ? (parseFloat(customTip) || 0) : tipPct
  const tipBase = tipOnPreTax ? subtotalNum : subtotalNum + taxNum
  const tipAmount = (tipBase * activeTip) / 100
  const total = subtotalNum + taxNum + tipAmount

  function handleQuickTip(pct) {
    setTipPct(pct)
    setUsingCustom(false)
    setCustomTip('')
  }

  function handleCustomChange(val) {
    setCustomTip(val)
    setUsingCustom(true)
  }

  function handleNext() {
    if (subtotalNum <= 0) return
    onNext({
      subtotal: subtotalNum,
      tax: taxNum,
      tipPct: activeTip,
      tipAmount,
      tipOnPreTax,
      total
    })
  }

  const isValid = subtotalNum > 0

  return (
    <div className="screen">
      <h2 className="screen-title">Enter Your Bill</h2>

      <div className="card">
        <label className="field-label">Subtotal (before tax)</label>
        <div className="input-row">
          <span className="input-prefix">$</span>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={subtotal}
            onChange={e => setSubtotal(e.target.value)}
          />
        </div>

        <label className="field-label" style={{ marginTop: 18 }}>Tax (optional)</label>
        <div className="input-row">
          <span className="input-prefix">$</span>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={tax}
            onChange={e => setTax(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <label className="field-label">Tip</label>
        <div className="tip-grid">
          {QUICK_TIPS.map(pct => (
            <button
              key={pct}
              className={`tip-btn ${!usingCustom && tipPct === pct ? 'tip-btn--active' : ''}`}
              onClick={() => handleQuickTip(pct)}
            >
              {pct}%
            </button>
          ))}
        </div>

        <div className="input-row" style={{ marginTop: 12 }}>
          <span className="input-prefix">%</span>
          <input
            className={`input ${usingCustom ? 'input--active' : ''}`}
            type="number"
            inputMode="decimal"
            placeholder="Custom %"
            value={customTip}
            onChange={e => handleCustomChange(e.target.value)}
          />
        </div>

        <div className="toggle-row" style={{ marginTop: 14 }}>
          <span className="toggle-label">Tip on pre-tax amount</span>
          <button
            className={`toggle ${tipOnPreTax ? 'toggle--on' : ''}`}
            onClick={() => setTipOnPreTax(v => !v)}
            aria-pressed={tipOnPreTax}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      {subtotalNum > 0 && (
        <div className="summary-card">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotalNum.toFixed(2)}</span>
          </div>
          {taxNum > 0 && (
            <div className="summary-row">
              <span>Tax</span>
              <span>${taxNum.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Tip ({activeTip}%)</span>
            <span>${tipAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button className="btn-primary" onClick={handleNext} disabled={!isValid}>
        Next — Split the Bill →
      </button>
    </div>
  )
}

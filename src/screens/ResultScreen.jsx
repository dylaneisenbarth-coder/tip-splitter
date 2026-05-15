import './Screen.css'

export default function ResultScreen({ billData, splitData, onReset }) {
  const { subtotal, tax, tipAmount, tipPct, total } = billData
  const { mode, people, names, items, assignments } = splitData

  // ── Calculate per-person amounts ──
  let personTotals = {}

  if (mode === 'equal') {
    const share = total / people
    for (let i = 0; i < people; i++) {
      personTotals[i] = { name: names[i], subtotal: subtotal / people, tip: tipAmount / people, tax: tax / people, total: share }
    }
  } else {
    // itemized: distribute each item among assignees, then add tip/tax proportionally
    const itemSubtotals = {} // personIdx -> subtotal share
    let assignedTotal = 0

    for (let i = 0; i < people; i++) itemSubtotals[i] = 0

    items.forEach(item => {
      const price = parseFloat(item.price) || 0
      const assignees = (assignments[item.id] || [])
      if (assignees.length === 0) {
        // unassigned: split equally
        for (let i = 0; i < people; i++) itemSubtotals[i] += price / people
      } else {
        const share = price / assignees.length
        assignees.forEach(i => { itemSubtotals[i] += share })
      }
      assignedTotal += price
    })

    // Tip & tax split proportionally to each person's item share
    const base = assignedTotal || 1
    for (let i = 0; i < people; i++) {
      const ratio = itemSubtotals[i] / base
      const myTip = tipAmount * ratio
      const myTax = tax * ratio
      personTotals[i] = {
        name: names[i],
        subtotal: itemSubtotals[i],
        tip: myTip,
        tax: myTax,
        total: itemSubtotals[i] + myTip + myTax
      }
    }
  }

  function handleShare() {
    const lines = [`🍽️ TipSplit — ${new Date().toLocaleDateString()}`, '']
    lines.push(`Bill total: $${total.toFixed(2)} (incl. ${tipPct}% tip)`, '')
    Object.values(personTotals).forEach(p => {
      lines.push(`${p.name}: $${p.total.toFixed(2)}`)
    })
    const text = lines.join('\n')
    if (navigator.share) {
      navigator.share({ title: 'TipSplit', text })
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'))
    }
  }

  return (
    <div className="screen">
      <h2 className="screen-title">Here's the Split 🎉</h2>

      <div className="summary-card" style={{ marginBottom: 20 }}>
        <div className="summary-row">
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        {tax > 0 && <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>}
        <div className="summary-row">
          <span>Tip ({tipPct}%)</span><span>${tipAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row summary-total">
          <span>Grand Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="people-grid">
        {Object.entries(personTotals).map(([idx, p]) => (
          <div key={idx} className="person-card">
            <div className="person-avatar">{(p.name || `P${parseInt(idx)+1}`)[0].toUpperCase()}</div>
            <div className="person-info">
              <div className="person-name">{p.name}</div>
              <div className="person-breakdown">
                <span>${p.subtotal.toFixed(2)} food</span>
                {p.tip > 0 && <span> + ${p.tip.toFixed(2)} tip</span>}
                {p.tax > 0 && <span> + ${p.tax.toFixed(2)} tax</span>}
              </div>
            </div>
            <div className="person-total">${p.total.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <button className="btn-share" onClick={handleShare}>
        📤 Share Split
      </button>

      <button className="btn-secondary" onClick={onReset} style={{ marginTop: 12 }}>
        Start New Bill
      </button>
    </div>
  )
}

import { useState, useCallback } from 'react'

const COLORS = {
  navy: '#0D1B2A',
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  cream: '#FAF7F0',
  navyLight: '#1a2e45',
  navyMid: '#152236',
  border: '#2a3f5a',
  textMuted: '#8aa0b8',
}

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#0D1B2A', fontFamily: "'DM Sans', sans-serif", color: '#FAF7F0' },
  header: { backgroundColor: '#152236', borderBottom: '1px solid #2a3f5a', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px' },
  logo: { width: 42, height: 42, backgroundColor: '#C9A84C', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: '#0D1B2A', flexShrink: 0 },
  brandName: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#C9A84C', margin: 0, lineHeight: 1.2 },
  brandSub: { fontSize: 12, color: '#8aa0b8', margin: 0, marginTop: 2 },
  disclaimer: { backgroundColor: '#1a2a1a', border: '1px solid #2d4a2d', borderRadius: 8, padding: '12px 16px', margin: '20px 24px 0', display: 'flex', gap: 10, alignItems: 'flex-start' },
  disclaimerText: { fontSize: 12, color: '#7aad7a', lineHeight: 1.5, margin: 0 },
  main: { padding: '24px', maxWidth: 800, margin: '0 auto' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#C9A84C', marginBottom: 16, marginTop: 0 },
  card: { backgroundColor: '#152236', border: '1px solid #2a3f5a', borderRadius: 12, padding: 20, marginBottom: 20 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: '#8aa0b8', letterSpacing: '0.03em', textTransform: 'uppercase' },
  input: { backgroundColor: '#0D1B2A', border: '1px solid #2a3f5a', borderRadius: 8, padding: '10px 14px', fontSize: 15, color: '#FAF7F0', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" },
  select: { backgroundColor: '#0D1B2A', border: '1px solid #2a3f5a', borderRadius: 8, padding: '10px 14px', fontSize: 15, color: '#FAF7F0', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' },
  inputHint: { fontSize: 11, color: '#8aa0b8', marginTop: 2 },
  button: { backgroundColor: '#C9A84C', color: '#0D1B2A', border: 'none', borderRadius: 8, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: '100%', marginTop: 8 },
  resultsCard: { backgroundColor: '#152236', border: '2px solid #C9A84C', borderRadius: 12, padding: 24, marginBottom: 20 },
  resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 16 },
  resultItem: { backgroundColor: '#0D1B2A', borderRadius: 10, padding: '14px 16px', textAlign: 'center' },
  resultLabel: { fontSize: 11, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 },
  resultValue: { fontSize: 22, fontWeight: 700, color: '#E8C97A', fontFamily: "'Playfair Display', serif" },
  resultSub: { fontSize: 11, color: '#8aa0b8', marginTop: 3 },
  breakdownTable: { width: '100%', borderCollapse: 'collapse', marginTop: 12, fontSize: 14 },
  th: { textAlign: 'left', padding: '8px 12px', color: '#8aa0b8', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #2a3f5a' },
  td: { padding: '10px 12px', borderBottom: '1px solid #2a3f5a', color: '#FAF7F0' },
  tdRight: { padding: '10px 12px', borderBottom: '1px solid #2a3f5a', color: '#FAF7F0', textAlign: 'right' },
  infoBox: { backgroundColor: '#0d1f35', border: '1px solid #2a3f5a', borderRadius: 8, padding: '12px 16px', marginTop: 16, fontSize: 13, color: '#8aa0b8', lineHeight: 1.6 },
  footer: { borderTop: '1px solid #2a3f5a', padding: '20px 24px', textAlign: 'center', fontSize: 11, color: '#8aa0b8', lineHeight: 1.7, marginTop: 20 },
}

function fmt(n) { return '£' + Math.round(n).toLocaleString('en-GB') }
function fmtPct(n) { return n.toFixed(2) + '%' }

function calcMonthlyPayment(principal, annualRate, months) {
  if (annualRate === 0) return principal / months
  const r = annualRate / 100 / 12
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

function calcInterestOnly(principal, annualRate) {
  return (principal * (annualRate / 100)) / 12
}

export default function App() {
  const [form, setForm] = useState({
    propertyPrice: '', deposit: '', interestRate: '', termYears: '25',
    repaymentType: 'repayment', fixedPeriod: '2', svr: '7.5', rateAfterFix: '',
  })
  const [results, setResults] = useState(null)
  const set = useCallback((key, val) => setForm(f => ({ ...f, [key]: val })), [])

  const calculate = useCallback(() => {
    const price = parseFloat(form.propertyPrice)
    const deposit = parseFloat(form.deposit)
    const rate = parseFloat(form.interestRate)
    const term = parseInt(form.termYears)
    const fixYears = parseInt(form.fixedPeriod)
    const svr = parseFloat(form.svr)
    const rateAfterFix = form.rateAfterFix ? parseFloat(form.rateAfterFix) : svr
    if (!price || !deposit || !rate || !term) return
    const loanAmount = price - deposit
    const ltv = (loanAmount / price) * 100
    const months = term * 12
    const isRepayment = form.repaymentType === 'repayment'
    const monthlyFixed = isRepayment ? calcMonthlyPayment(loanAmount, rate, months) : calcInterestOnly(loanAmount, rate)
    const fixedMonths = fixYears * 12
    const r = rate / 100 / 12
    const balanceAfterFix = r > 0
      ? loanAmount * ((Math.pow(1 + r, months) - Math.pow(1 + r, fixedMonths)) / (Math.pow(1 + r, months) - 1))
      : loanAmount
    const remainingMonths = (term - fixYears) * 12
    const monthlyAfterFix = isRepayment ? calcMonthlyPayment(balanceAfterFix, rateAfterFix, remainingMonths) : calcInterestOnly(loanAmount, rateAfterFix)
    const totalPaid = monthlyFixed * fixedMonths + monthlyAfterFix * remainingMonths
    const totalInterest = totalPaid - loanAmount
    const stressTest = calcMonthlyPayment(loanAmount, rate + 3, months)
    const recommendedIncome = (monthlyFixed * 12) / 0.28
    setResults({ loanAmount, ltv, monthlyFixed, monthlyAfterFix, totalInterest, totalPaid, stressTest, recommendedIncome })
  }, [form])

  const ltvColor = results ? (results.ltv <= 60 ? '#4caf7a' : results.ltv <= 75 ? '#C9A84C' : results.ltv <= 85 ? '#e8a84c' : '#e85c4c') : '#C9A84C'
  const ltvLabel = results ? (results.ltv <= 60 ? 'Excellent' : results.ltv <= 75 ? 'Good' : results.ltv <= 85 ? 'Standard' : 'High LTV') : ''

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.logo}>UP</div>
        <div>
          <p style={styles.brandName}>UK Property Pulse</p>
          <p style={styles.brandSub}>Mortgage Planning Tool</p>
        </div>
      </header>

      <div style={styles.disclaimer}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
        <p style={styles.disclaimerText}>
          <strong style={{ color: '#9acd9a' }}>Educational tool only.</strong> This calculator is for informational and planning purposes. It does not constitute financial advice and is not regulated by the FCA. Always consult a qualified mortgage broker before making any mortgage decisions.
        </p>
      </div>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Property & Deposit</h2>
          <div style={styles.grid2}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Property Price</label>
              <input style={styles.input} type="number" placeholder="350000" value={form.propertyPrice} onChange={e => set('propertyPrice', e.target.value)} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Deposit Amount</label>
              <input style={styles.input} type="number" placeholder="35000" value={form.deposit} onChange={e => set('deposit', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Mortgage Details</h2>
          <div style={styles.grid2}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Initial Interest Rate (%)</label>
              <input style={styles.input} type="number" step="0.01" placeholder="4.50" value={form.interestRate} onChange={e => set('interestRate', e.target.value)} />
              <span style={styles.inputHint}>Your fixed or tracker rate</span>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Mortgage Term (years)</label>
              <select style={styles.select} value={form.termYears} onChange={e => set('termYears', e.target.value)}>
                {[10,15,20,25,30,35,40].map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Repayment Type</label>
              <select style={styles.select} value={form.repaymentType} onChange={e => set('repaymentType', e.target.value)}>
                <option value="repayment">Repayment (Capital + Interest)</option>
                <option value="interest">Interest Only</option>
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Fixed Rate Period</label>
              <select style={styles.select} value={form.fixedPeriod} onChange={e => set('fixedPeriod', e.target.value)}>
                <option value="2">2-year fix</option>
                <option value="3">3-year fix</option>
                <option value="5">5-year fix</option>
                <option value="10">10-year fix</option>
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Rate After Fix (%)</label>
              <input style={styles.input} type="number" step="0.01" placeholder={form.svr} value={form.rateAfterFix} onChange={e => set('rateAfterFix', e.target.value)} />
              <span style={styles.inputHint}>Leave blank to use SVR ({form.svr}%)</span>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Lender SVR (%)</label>
              <input style={styles.input} type="number" step="0.01" value={form.svr} onChange={e => set('svr', e.target.value)} />
              <span style={styles.inputHint}>Standard Variable Rate (avg ~7.5%)</span>
            </div>
          </div>
          <button style={styles.button} onClick={calculate}>Calculate My Mortgage →</button>
        </div>

        {results && (
          <>
            <div style={styles.resultsCard}>
              <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>Your Results</h2>
              <p style={{ fontSize: 13, color: '#8aa0b8', margin: 0 }}>Based on a {fmt(results.loanAmount)} mortgage over {form.termYears} years</p>
              <div style={styles.resultsGrid}>
                <div style={styles.resultItem}>
                  <div style={styles.resultLabel}>Monthly (fixed period)</div>
                  <div style={styles.resultValue}>{fmt(results.monthlyFixed)}</div>
                  <div style={styles.resultSub}>per month</div>
                </div>
                <div style={styles.resultItem}>
                  <div style={styles.resultLabel}>Monthly (after fix)</div>
                  <div style={styles.resultValue}>{fmt(results.monthlyAfterFix)}</div>
                  <div style={styles.resultSub}>at {form.rateAfterFix || form.svr}%</div>
                </div>
                <div style={styles.resultItem}>
                  <div style={styles.resultLabel}>Total Interest</div>
                  <div style={styles.resultValue}>{fmt(results.totalInterest)}</div>
                  <div style={styles.resultSub}>over full term</div>
                </div>
                <div style={styles.resultItem}>
                  <div style={styles.resultLabel}>Total Repaid</div>
                  <div style={styles.resultValue}>{fmt(results.totalPaid)}</div>
                  <div style={styles.resultSub}>capital + interest</div>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Loan-to-Value Analysis</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: '#8aa0b8' }}>Your LTV</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: ltvColor }}>{fmtPct(results.ltv)} — {ltvLabel}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, backgroundColor: '#2a3f5a', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(results.ltv, 100)}%`, backgroundColor: ltvColor, borderRadius: 4 }} />
              </div>
              <div style={styles.infoBox}>
                <strong style={{ color: '#FAF7F0' }}>What this means: </strong>
                {results.ltv <= 60 ? 'Excellent position — you have access to the best rates available.' : results.ltv <= 75 ? 'Good position — you\'ll qualify for competitive rates from most mainstream lenders.' : results.ltv <= 85 ? 'Standard LTV — good product choice but you won\'t access the very best rates.' : 'High LTV — product choice is more limited and rates will be higher. Consider a larger deposit if possible.'}
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Affordability Check</h2>
              <table style={styles.breakdownTable}>
                <thead>
                  <tr>
                    <th style={styles.th}>Scenario</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Monthly Payment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>At your rate ({form.interestRate}%)</td>
                    <td style={styles.tdRight}>{fmt(results.monthlyFixed)}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>After fixed period ({form.rateAfterFix || form.svr}%)</td>
                    <td style={styles.tdRight}>{fmt(results.monthlyAfterFix)}</td>
                  </tr>
                  <tr>
                    <td style={{ ...styles.td, color: '#e85c4c' }}>Stress test (+3% → {(parseFloat(form.interestRate) + 3).toFixed(2)}%)</td>
                    <td style={{ ...styles.tdRight, color: '#e85c4c' }}>{fmt(results.stressTest)}</td>
                  </tr>
                </tbody>
              </table>
              <div style={styles.infoBox}>
                <strong style={{ color: '#FAF7F0' }}>Suggested minimum income: </strong>
                {fmt(results.recommendedIncome / 12)}/month gross ({fmt(results.recommendedIncome)}/year) — lenders typically want your mortgage payment to be no more than 28–35% of gross income. Indicative only.
              </div>
            </div>
          </>
        )}
      </main>

      <footer style={styles.footer}>
        <p>
          <a href="https://ukpropertypulse.co.uk" style={{ color: '#C9A84C', textDecoration: 'none' }}>ukpropertypulse.co.uk</a>
          {' · '}This tool is for educational purposes only and does not constitute financial or mortgage advice.
          <br />UK Property Pulse is not authorised or regulated by the Financial Conduct Authority (FCA). Always seek advice from a qualified, FCA-regulated mortgage broker.
        </p>
      </footer>
    </div>
  )
}

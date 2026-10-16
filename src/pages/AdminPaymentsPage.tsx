import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Payment = {
  id: string
  user_id: string | null
  created_at: string
  method: string | null
  tx_id: string | null
  proof_path: string | null
  amount: number | null
  status: string | null
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [planForVerify, setPlanForVerify] = useState<Record<string,string>>({})

  const VERIFY_FN = import.meta.env.VITE_VERIFY_PAYMENT_FN
  const GET_PROOF_FN = import.meta.env.VITE_GET_PROOF_FN

  async function loadPending() {
    setLoading(true)
    const { data, error } = await supabase.from('payments').select('*').eq('status', 'pending').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setPayments(data as Payment[])
    setLoading(false)
  }

  useEffect(() => { loadPending() }, [])

  async function handlePreview(proofPath: string | null) {
    if (!proofPath) { setPreviewUrl(null); return }
    try {
      setPreviewUrl(null)
      setError(null)
      const res = await fetch(GET_PROOF_FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof_path: proofPath })
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setPreviewUrl(json.signedUrl || null)
    } catch (err: any) {
      setError(err.message || String(err))
    }
  }

  async function handleVerify(paymentId: string) {
    setVerifying(paymentId)
    setError(null)
    try {
      const { data: userData } = await supabase.auth.getUser()
      const adminId = userData?.data?.user?.id
      if (!adminId) throw new Error('You must be signed in as admin to verify')
      const plan = planForVerify[paymentId] || 'creator_pro'
      const res = await fetch(VERIFY_FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId, admin_id: adminId, plan })
      })
      if (!res.ok) throw new Error(await res.text())
      await loadPending()
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setVerifying(null)
    }
  }

  return (
    <div className="page p-4">
      <h1 className="title">Admin — Payment Verifications</h1>
      <p className="muted">List of pending payment proofs. Click preview to view uploaded proof (signed URL fetched via server). Then verify and grant credits.</p>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="status">Error: {error}</p>}

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {payments.length === 0 && !loading && <div className="card muted">No pending payments</div>}
        {payments.map(p => (
          <div key={p.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{p.user_id ?? 'Unknown user'}</div>
                <div className="muted">{p.amount ? `₹${p.amount.toFixed(2)}` : 'Amount N/A'} • {p.tx_id ?? 'No TX ID'}</div>
                <div className="muted">{new Date(p.created_at).toLocaleString()}</div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={planForVerify[p.id] ?? 'creator_pro'} onChange={(e) => setPlanForVerify(prev => ({ ...prev, [p.id]: e.target.value }))}>
                  <option value="creator_pro">Creator Pro (20 gen)</option>
                  <option value="creator_plus">Creator Plus (50 gen)</option>
                </select>
                <button className="btn" onClick={() => handlePreview(p.proof_path)}>Preview proof</button>
                <button className="btn" onClick={() => handleVerify(p.id)} disabled={verifying === p.id}>{verifying === p.id ? 'Verifying…' : 'Verify'}</button>
              </div>
            </div>
          </div>
        ))}

        {previewUrl && (
          <div className="card">
            <h3>Proof preview</h3>
            <img src={previewUrl} alt="proof" style={{ width: '100%', borderRadius: 8 }} />
            <a href={previewUrl} target="_blank" rel="noreferrer" className="btn">Open original</a>
          </div>
        )}
      </div>
    </div>
  )
}

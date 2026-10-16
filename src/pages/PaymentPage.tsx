import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import QRCode from "qrcode";

export default function PaymentPage({ user }: { user: { id: string } | null }) {
  const [txId, setTxId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // UPI QR generation state
  const [upiId, setUpiId] = useState("bavithran079@okaxis");
  const [payeeName, setPayeeName] = useState("Bavithran");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("ReelSpot AI subscription");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [upiUri, setUpiUri] = useState<string>("");

  useEffect(() => {
    // Build UPI URI according to UPI intent format
    const pa = encodeURIComponent(upiId.trim());
    const pn = encodeURIComponent(payeeName.trim());
    const am = amount ? encodeURIComponent(amount.trim()) : undefined;
    const tn = note ? encodeURIComponent(note.trim()) : undefined;

    let uri = `upi://pay?pa=${pa}&pn=${pn}&cu=INR`;
    if (am) uri += `&am=${am}`;
    if (tn) uri += `&tn=${tn}`;
    setUpiUri(uri);

    // Generate QR data URL client-side
    async function gen() {
      try {
        const dataUrl = await QRCode.toDataURL(uri, { margin: 1, scale: 6 });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("QR generation failed", err);
        setQrDataUrl(null);
      }
    }
    gen();
  }, [upiId, payeeName, amount, note]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setStatus("Please sign in or continue as guest."); return; }

    setStatus("Uploading proof...");
    let proofPath: string | null = null;
    if (file) {
      const key = `payment-proofs/${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from("payment-proofs")
        .upload(key, file, { cacheControl: "3600", upsert: false });
      if (uploadErr) { setStatus("Upload failed: " + uploadErr.message); return; }
      proofPath = key;
    }

    const { data, error } = await supabase.from("payments").insert([
      {
        user_id: user.id,
        status: "pending",
        tx_id: txId || null,
        proof_path: proofPath,
        method: "upi-qr",
        amount: amount ? parseFloat(amount) : 0
      },
    ]);
    if (error) setStatus("Failed: " + error.message);
    else setStatus("Payment recorded and pending verification. An admin will verify soon.");
  }

  function downloadQr() {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'reelspot-upi-qr.png';
    a.click();
  }

  return (
    <div className="page p-4">
      <h2 className="title">Pay with UPI (Dynamic QR)</h2>
      <div className="card">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="UPI QR" className="qr" />
        ) : (
          <div style={{ width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="muted">Generating QR…</span>
          </div>
        )}
        <p className="muted">Scan with any UPI app or open it directly. UPI ID: {upiId}</p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <a href={upiUri} className="btn" rel="noopener noreferrer">Open in UPI app</a>
          <button className="btn" onClick={downloadQr} type="button">Download QR</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form" style={{ marginTop: 12 }}>
        <label>
          <span>UPI ID</span>
          <input value={upiId} onChange={(e) => setUpiId(e.target.value)} />
        </label>
        <label>
          <span>Payee name</span>
          <input value={payeeName} onChange={(e) => setPayeeName(e.target.value)} />
        </label>
        <label>
          <span>Amount (optional, INR)</span>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
        </label>
        <label>
          <span>Note (optional)</span>
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        <hr style={{ margin: '12px 0', borderColor: '#2b2b2f' }} />

        <label>
          <span>Transaction ID (optional)</span>
          <input value={txId} onChange={(e) => setTxId(e.target.value)} />
        </label>

        <label>
          <span>Upload payment proof (screenshot) — optional</span>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>

        <button type="submit" className="btn">I have paid — submit proof</button>
      </form>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

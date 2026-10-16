import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function PaymentPage({ user }: { user: { id: string } | null }) {
  const [txId, setTxId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

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
        method: "upi-qr"
      },
    ]);
    if (error) setStatus("Failed: " + error.message);
    else setStatus("Payment recorded and pending verification. An admin will verify soon.");
  }

  return (
    <div className="page p-4">
      <h2 className="title">Pay with UPI</h2>
      <div className="card">
        <img src="/assets/payment-qr.svg" alt="UPI QR" className="qr" />
        <p className="muted">Scan with any UPI app. UPI ID: bavithran079@okaxis</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <label>
          <span>Transaction ID (optional)</span>
          <input value={txId} onChange={(e) => setTxId(e.target.value)} />
        </label>

        <label>
          <span>Upload payment proof (screenshot)</span>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>

        <button type="submit" className="btn">I have paid — submit proof</button>
      </form>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

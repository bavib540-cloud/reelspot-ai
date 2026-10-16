@@
   async function handlePreview(proofPath: string | null) {
     if (!proofPath) { setPreviewUrl(null); return }
     try {
       setPreviewUrl(null)
       setError(null)
-      const res = await fetch(GET_PROOF_FN, {
-        method: 'POST',
-        headers: { 'Content-Type': 'application/json' },
-        body: JSON.stringify({ proof_path: proofPath })
-      })
+      const session = await supabase.auth.getSession()
+      const token = session.data.session?.access_token
+      if (!token) throw new Error('You must be signed in as admin to preview proofs')
+      const res = await fetch(GET_PROOF_FN, {
+        method: 'POST',
+        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
+        body: JSON.stringify({ proof_path: proofPath })
+      })
       if (!res.ok) throw new Error(await res.text())
       const json = await res.json()
       setPreviewUrl(json.signedUrl || null)
     } catch (err: any) {
       setError(err.message || String(err))
     }
   }
@@
-    try {
-      const { data: userData } = await supabase.auth.getUser()
-      const adminId = userData?.data?.user?.id
-      if (!adminId) throw new Error('You must be signed in as admin to verify')
-      const plan = planForVerify[paymentId] || 'creator_pro'
-      const res = await fetch(VERIFY_FN, {
-        method: 'POST',
-        headers: { 'Content-Type': 'application/json' },
-        body: JSON.stringify({ payment_id: paymentId, admin_id: adminId, plan })
-      })
-      if (!res.ok) throw new Error(await res.text())
-      await loadPending()
-    } catch (err: any) {
-      setError(err.message || String(err))
-    } finally {
-      setVerifying(null)
-    }
+    try {
+      const session = await supabase.auth.getSession()
+      const token = session.data.session?.access_token
+      if (!token) throw new Error('You must be signed in as admin to verify')
+      const plan = planForVerify[paymentId] || 'creator_pro'
+      const res = await fetch(VERIFY_FN, {
+        method: 'POST',
+        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
+        body: JSON.stringify({ payment_id: paymentId, plan })
+      })
+      if (!res.ok) throw new Error(await res.text())
+      await loadPending()
+    } catch (err: any) {
+      setError(err.message || String(err))
+    } finally {
+      setVerifying(null)
+    }
   }

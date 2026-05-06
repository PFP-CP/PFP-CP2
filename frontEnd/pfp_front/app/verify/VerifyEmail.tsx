'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sendVerificationEmail, verifyEmailCode } from '@/app/(main_page)/actions/profile'
import styles from './verify.module.css'

export default function VerifyEmail({ email }: { email: string }) {
    const router = useRouter()
    const [codeSent, setCodeSent] = useState(false)
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    useEffect(() => {
        const key = `verif_sent:${email}`
        const sentAt = sessionStorage.getItem(key)
        // skip if sent within the last 5 min (matches backend code TTL)
        if (sentAt && Date.now() - parseInt(sentAt) < 5 * 60 * 1000) {
            setLoading(false)
            setCodeSent(true)
            return
        }
        sessionStorage.setItem(key, Date.now().toString())
        sendVerificationEmail(email).then(result => {
            setLoading(false)
            if (result.alreadyVerified) { router.push('/home'); return }
            if (result.success) setCodeSent(true)
            else setError(result.error ?? 'Failed to send email.')
        })
    }, [])

    const handleResend = async () => {
        setLoading(true)
        setError(null)
        sessionStorage.removeItem(`verif_sent:${email}`)
        const result = await sendVerificationEmail(email)
        setLoading(false)
        if (result.alreadyVerified) { router.push('/home'); return }
        if (result.success) setCodeSent(true)
        else setError(result.error ?? 'Failed to resend email.')
    }
    const handleVerify = async () => {
        if (!code.replace(/\s+/g, '')) return
        setLoading(true)
        setError(null)
        const result = await verifyEmailCode(email, code.replace(/\s+/g, ''))
        setLoading(false)
        if (result.success) {
            setSuccess(true)
            setTimeout(() => router.push('/home'), 1500)
        } else {
            setError(result.error ?? 'Invalid code.')
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.icon}>✉️</div>
                <h1 className={styles.title}>Verify your email</h1>
                <p className={styles.subtitle}>
                    {codeSent
                        ? `A verification code was sent to ${email}`
                        : `Could not send to ${email}. Try resending.`}
                </p>

                {success ? (
                    <p className={styles.success_msg}>Email verified! Redirecting…</p>
                ) : (
                    <div className={styles.code_section}>
                        <input
                            className={styles.code_input}
                            placeholder="Enter 8-character code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))}
                            disabled={loading}
                            autoFocus
                        />
                        <button
                            className={styles.primary_btn}
                            onClick={handleVerify}
                            disabled={loading || !code.replace(/\s+/g, '')}
                        >
                            {loading ? 'Verifying…' : 'Verify'}
                        </button>
                        <button
                            className={styles.link_btn}
                            onClick={handleResend}
                            disabled={loading}
                        >
                            Resend code
                        </button>
                    </div>
                )}

                {error && <p className={styles.error_msg}>{error}</p>}
            </div>
        </div>
    )
}

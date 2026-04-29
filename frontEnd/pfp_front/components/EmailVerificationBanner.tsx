'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/email_verification_banner.module.css';
import {
  getMyProfile,
  checkEmailVerified,
  sendVerificationEmail,
  verifyEmailCode,
} from '@/app/(main_page)/actions/profile';

const STORAGE_KEY = 'nook_email_verified';

export default function EmailVerificationBanner() {
  // Start hidden — flip to true only after we confirm user is logged in and unverified
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already know they're verified, do nothing
    if (localStorage.getItem(STORAGE_KEY)) return;

    getMyProfile().then(async (profile) => {
      if (!profile) return; // not logged in

      try {
        const { verified } = await checkEmailVerified(profile.email);
        if (verified) {
          localStorage.setItem(STORAGE_KEY, 'true');
          return; // hide — account already verified
        }
        // Confirmed unverified — show banner and keep it visible
        localStorage.removeItem(STORAGE_KEY);
        setEmail(profile.email);
        setVisible(true);
      } catch {
        // probe failed — show banner anyway so user can try
        setEmail(profile.email);
        setVisible(true);
      }
    });
  }, []);

  if (!visible) return null;

  const handleSend = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const result = await sendVerificationEmail(email);
      if (result.success) {
        setCodeSent(true);
      } else {
        setError(result.error ?? 'Failed to send email.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!email || !code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await verifyEmailCode(email, code.trim());
      if (result.success) {
        localStorage.setItem(STORAGE_KEY, 'true');
        setVisible(false); // only place we hide the banner
      } else {
        setError(result.error ?? 'Invalid code.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.banner}>
      <span className={styles.text}>
        {codeSent
          ? `Code sent to ${email} — enter it below:`
          : 'Please verify your email address to get full access.'}
      </span>

      {!codeSent ? (
        <button className={styles.btn} onClick={handleSend} disabled={loading}>
          {loading ? 'Sending...' : 'Send verification code'}
        </button>
      ) : (
        <>
          <input
            className={styles.input}
            placeholder="Enter 8-char code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={8}
            autoFocus
          />
          <button
            className={styles.btn}
            onClick={handleVerify}
            disabled={loading || !code.trim()}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </>
      )}

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

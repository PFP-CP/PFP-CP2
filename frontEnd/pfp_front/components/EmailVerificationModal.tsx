'use client';

import { useState, useEffect } from 'react';
import {
  getMyProfile,
  checkEmailVerified,
  sendVerificationEmail,
  verifyEmailCode,
} from '@/app/(main_page)/actions/profile';

export default function EmailVerificationBanner() {
  const [visible, setVisible] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile().then(async (profile) => {
      if (!profile) { setVisible(false); return; }
      setEmail(profile.email);
      try {
        const { verified } = await checkEmailVerified(profile.email);
        if (verified) setVisible(false);
      } catch (e) {}
    });
  }, []);

  if (!visible) return null;

  const handleSend = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const result = await sendVerificationEmail(email);
      if (result.success) setCodeSent(true);
      else setError(result.error ?? 'Failed to send email.');
    } catch (e) {
      setError('Something went wrong.');
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
      if (result.success) setVisible(false);
      else setError(result.error ?? 'Invalid code.');
    } catch (e) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      background: '#f0ebff',
      borderBottom: '2px solid #7c5cdb',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      boxSizing: 'border-box',
    }}>
      <p style={{ flex: 1, margin: 0, fontSize: '0.9rem', color: '#220E67', fontWeight: 500, minWidth: 200 }}>
        {codeSent
          ? `A verification code was sent to ${email}`
          : `Please verify your email address${email ? ` (${email})` : ''} to access all features`}
      </p>

      {!codeSent ? (
        <button
          onClick={handleSend}
          disabled={loading || !email}
          style={{ padding: '8px 18px', background: '#220E67', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          {loading ? 'Sending...' : 'Send verification code'}
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <input
            placeholder="Enter 8-character code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={8}
            autoFocus
            style={{ padding: '8px 12px', border: '2px solid #7c5cdb', borderRadius: 8, fontSize: '0.9rem', width: 180 }}
          />
          <button
            onClick={handleVerify}
            disabled={loading || !code.trim()}
            style={{ padding: '8px 18px', background: '#220E67', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            style={{ background: 'none', border: 'none', color: '#7c5cdb', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Resend
          </button>
        </div>
      )}

      {error && <p style={{ width: '100%', color: '#dc2626', fontSize: '0.82rem', margin: 0 }}>{error}</p>}
    </div>
  );
}

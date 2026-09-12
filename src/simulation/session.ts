// ============================================================
// Session / Nonce Management — Replay detection
// ============================================================

import type { SessionInfo, SessionValidation } from '../types/simulation';

/** Generate a random hex string of given length */
function randomHex(length: number): string {
  let result = '';
  const chars = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/** Generate a fresh session with unique nonce */
export function generateSession(): SessionInfo {
  return {
    sessionId: randomHex(8),
    nonce: randomHex(16),
    timestamp: Date.now(),
    signatureId: randomHex(12),
    isReplay: false,
  };
}

/** Create a replay session that reuses the original nonce and signatureId */
export function generateReplaySession(original: SessionInfo): SessionInfo {
  return {
    sessionId: randomHex(8),
    nonce: original.nonce, // reused — this is what makes it a replay
    timestamp: Date.now(),
    signatureId: original.signatureId,
    isReplay: true,
  };
}

/** 
 * Validate a session against used nonces.
 * If the nonce was previously used, it's a replay attack.
 */
export function validateSession(
  current: SessionInfo,
  usedNonces: Set<string>
): SessionValidation {
  if (usedNonces.has(current.nonce)) {
    return {
      isValid: false,
      reason: 'Nonce already used — replay detected',
      currentSession: current,
    };
  }
  return {
    isValid: true,
    reason: 'Session validated — fresh nonce',
    currentSession: current,
  };
}

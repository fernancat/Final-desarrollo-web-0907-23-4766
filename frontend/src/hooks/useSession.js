import { useEffect, useState } from 'react';
import { onSessionRenewed, onUnauthorized } from '../api/client.js';
import * as authApi from '../api/authApi.js';

const EXPIRATION_MARGIN_MS = 1000;

export function useSession() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    onSessionRenewed(setExpiresAt);

    onUnauthorized((message) => {
      setUser(null);
      setExpiresAt(null);
      setNotice(message || 'Tu sesión expiró. Inicia sesión nuevamente.');
    });
  }, []);

  useEffect(() => {
    async function verifySession() {
      try {
        const current = await authApi.getCurrentUser({ silent: true });
        setUser(current);
      } catch (error) {
        if (error.status !== 401) {
          setNotice(error.message);
        }
      } finally {
        setChecking(false);
      }
    }

    verifySession();
  }, []);

  useEffect(() => {
    if (!user || !expiresAt) {
      return;
    }

    async function checkExpiration() {
      try {
        await authApi.getCurrentUser();
      } catch {
        // El manejador de 401 se encarga de cerrar la sesión.
      }
    }

    const remaining = Math.max(expiresAt - Date.now(), 0);
    const timer = setTimeout(checkExpiration, remaining + EXPIRATION_MARGIN_MS);

    return () => clearTimeout(timer);
  }, [user, expiresAt]);

  function startSession(authenticatedUser) {
    setNotice('');
    setUser(authenticatedUser);
  }

  async function endSession() {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setExpiresAt(null);
    }
  }

  return { user, checking, notice, startSession, endSession };
}

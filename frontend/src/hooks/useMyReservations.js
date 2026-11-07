import { useEffect, useState } from 'react';
import { getMyReservations } from '../api/reservationApi.js';

export function useMyReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const list = await getMyReservations();

        if (active) {
          setReservations(list);
          setError('');
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [version]);

  function reload() {
    setVersion((current) => current + 1);
  }

  return { reservations, error, reload };
}

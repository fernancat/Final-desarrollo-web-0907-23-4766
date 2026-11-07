import { useEffect, useState } from 'react';
import { getRooms } from '../api/roomApi.js';
import { getRoomSchedule } from '../api/reservationApi.js';

async function loadSchedules(rooms, date) {
  const entries = await Promise.all(rooms.map(async (room) => {
    const reservations = await getRoomSchedule(room.id, date);

    return [room.id, reservations];
  }));

  return Object.fromEntries(entries);
}

export function useRoomBoard(date) {
  const [rooms, setRooms] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const roomList = await getRooms();
        const roomSchedules = await loadSchedules(roomList, date);

        if (!active) {
          return;
        }

        setRooms(roomList);
        setSchedules(roomSchedules);
        setError('');
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [date, version]);

  function reload() {
    setVersion((current) => current + 1);
  }

  return { rooms, schedules, loading, error, reload };
}

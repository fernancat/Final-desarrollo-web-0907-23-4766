import { useState } from 'react';
import { cancelReservation } from '../api/reservationApi.js';
import { useRoomBoard } from '../hooks/useRoomBoard.js';
import { useMyReservations } from '../hooks/useMyReservations.js';
import { SLOTS, isPast, overlaps, todayInGuatemala } from '../utils/time.js';
import { Header } from './layout/Header.jsx';
import { RoomGrid } from './rooms/RoomGrid.jsx';
import { ReservationForm } from './reservations/ReservationForm.jsx';
import { ReservationList } from './reservations/ReservationList.jsx';
import './Dashboard.css';

const EMPTY_DRAFT = { sala_id: null, hora_inicio: '', hora_fin: '' };

function isSingleSeat(draft, roomId) {
  if (draft.sala_id !== roomId) {
    return false;
  }

  return SLOTS.some((slot) => slot.inicio === draft.hora_inicio && slot.fin === draft.hora_fin);
}

function isRangeAvailable(range, reservations, date) {
  if (isPast(date, range.hora_inicio)) {
    return false;
  }

  return !reservations.some((reservation) => overlaps(reservation, range));
}

export function Dashboard({ user, onLogout }) {
  const [date, setDate] = useState(todayInGuatemala());
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const board = useRoomBoard(date);
  const myReservations = useMyReservations();

  const occupied = board.schedules[draft.sala_id] || [];

  function handleSeatClick(roomId, slot) {
    const singleSeat = isSingleSeat(draft, roomId);

    if (singleSeat && draft.hora_inicio === slot.inicio) {
      setDraft(EMPTY_DRAFT);
      return;
    }

    if (singleSeat) {
      const range = {
        sala_id: roomId,
        hora_inicio: draft.hora_inicio < slot.inicio ? draft.hora_inicio : slot.inicio,
        hora_fin: draft.hora_fin > slot.fin ? draft.hora_fin : slot.fin,
      };

      const reservations = board.schedules[roomId] || [];

      if (isRangeAvailable(range, reservations, date)) {
        setDraft(range);
        return;
      }
    }

    setDraft({ sala_id: roomId, hora_inicio: slot.inicio, hora_fin: slot.fin });
  }

  function handleFieldChange(name, value) {
    if (name === 'fecha') {
      if (value) {
        setDate(value);
      }

      return;
    }

    if (name === 'sala_id') {
      setDraft({ ...draft, sala_id: value ? Number(value) : null });
      return;
    }

    setDraft({ ...draft, [name]: value });
  }

  function handleReserved() {
    setDraft(EMPTY_DRAFT);
    board.reload();
    myReservations.reload();
  }

  async function handleCancel(id) {
    await cancelReservation(id);

    board.reload();
    myReservations.reload();
  }

  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />

      <main className="dashboard__content">
        <section className="dashboard__board">
          <h1 className="dashboard__title">Elige tu horario</h1>

          {board.error ? <p className="alert" role="alert">{board.error}</p> : null}

          {board.loading
            ? <p className="dashboard__loading">Cargando salas…</p>
            : (
              <RoomGrid
                rooms={board.rooms}
                schedules={board.schedules}
                date={date}
                draft={draft}
                onSeatClick={handleSeatClick}
              />
            )}
        </section>

        <aside className="dashboard__side">
          <ReservationForm
            rooms={board.rooms}
            draft={draft}
            date={date}
            occupied={occupied}
            onFieldChange={handleFieldChange}
            onReserved={handleReserved}
          />

          <ReservationList
            reservations={myReservations.reservations}
            error={myReservations.error}
            onCancel={handleCancel}
          />
        </aside>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { ReservationItem } from './ReservationItem.jsx';
import './ReservationList.css';

export function ReservationList({ reservations, error, onCancel }) {
  const [cancelError, setCancelError] = useState('');

  async function handleCancel(id) {
    setCancelError('');

    try {
      await onCancel(id);
    } catch (requestError) {
      setCancelError(requestError.message);
    }
  }

  const visibleError = error || cancelError;
  const isEmpty = reservations.length === 0;

  return (
    <section className="reservations">
      <h2 className="reservations__title">Mis reservas</h2>

      {visibleError ? <p className="alert" role="alert">{visibleError}</p> : null}

      {isEmpty
        ? <p className="reservations__empty">Aún no tienes reservas. Elige un horario en la cuadrícula.</p>
        : (
          <ul className="reservations__list">
            {reservations.map((reservation) => (
              <ReservationItem key={reservation.id} reservation={reservation} onCancel={handleCancel} />
            ))}
          </ul>
        )}
    </section>
  );
}

import { useState } from 'react';
import { formatDate, isPast } from '../../utils/time.js';

function CancelActions({ onConfirm }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" className="button button--ghost" onClick={() => setConfirming(true)}>
        Cancelar
      </button>
    );
  }

  return (
    <div className="ticket__actions">
      <button type="button" className="button button--danger" onClick={onConfirm}>
        Sí, cancelar
      </button>

      <button type="button" className="button button--ghost" onClick={() => setConfirming(false)}>
        No
      </button>
    </div>
  );
}

export function ReservationItem({ reservation, onCancel }) {
  const finished = isPast(reservation.fecha, reservation.hora_fin);

  return (
    <li className="ticket">
      <div className="ticket__info">
        <span className="ticket__room">{reservation.sala?.nombre}</span>
        <span className="ticket__date">{formatDate(reservation.fecha)}</span>
        <span className="ticket__time">{reservation.hora_inicio} – {reservation.hora_fin}</span>
      </div>

      {finished
        ? <span className="ticket__status">Finalizada</span>
        : <CancelActions onConfirm={() => onCancel(reservation.id)} />}
    </li>
  );
}

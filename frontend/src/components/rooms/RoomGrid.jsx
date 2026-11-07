import { SLOTS, formatDate, isPast, overlaps } from '../../utils/time.js';
import './RoomGrid.css';

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const STATE_LABELS = {
  free: 'disponible',
  selected: 'seleccionado',
  occupied: 'ocupado',
  past: 'no disponible',
};

function getSeatState(room, slot, reservations, date, draft) {
  const range = { hora_inicio: slot.inicio, hora_fin: slot.fin };

  const occupied = reservations.some((reservation) => overlaps(reservation, range));

  if (occupied) {
    return 'occupied';
  }

  if (isPast(date, slot.inicio)) {
    return 'past';
  }

  const selected = draft.sala_id === room.id && overlaps(draft, range);

  return selected ? 'selected' : 'free';
}

function Legend() {
  return (
    <ul className="legend" aria-label="Simbología">
      <li><span className="seat seat--free seat--sample" /> Disponible</li>
      <li><span className="seat seat--selected seat--sample" /> Tu selección</li>
      <li><span className="seat seat--occupied seat--sample" /> Ocupado</li>
      <li><span className="seat seat--past seat--sample" /> Hora pasada</li>
    </ul>
  );
}

export function RoomGrid({ rooms, schedules, date, draft, onSeatClick }) {
  return (
    <section className="room-grid" aria-label="Horarios por sala">
      <div className="room-grid__screen">
        <span>Horario del {formatDate(date)}</span>
      </div>

      <div className="room-grid__scroll">
        <div className="room-grid__table" style={{ '--slots': SLOTS.length }}>
          <span className="room-grid__corner" />

          {SLOTS.map((slot) => (
            <span key={slot.inicio} className="room-grid__hour">{slot.inicio}</span>
          ))}

          {rooms.map((room, index) => {
            const reservations = schedules[room.id] || [];

            return (
              <div key={room.id} className="room-grid__row">
                <div className="room-grid__room">
                  <span className="room-grid__letter">{ROW_LETTERS[index]}</span>
                  <span className="room-grid__name" title={room.nombre}>{room.nombre}</span>
                </div>

                {SLOTS.map((slot) => {
                  const state = getSeatState(room, slot, reservations, date, draft);
                  const unavailable = state === 'occupied' || state === 'past';
                  const label = `${room.nombre}, ${slot.inicio} a ${slot.fin}, ${STATE_LABELS[state]}`;

                  return (
                    <button
                      key={slot.inicio}
                      type="button"
                      className={`seat seat--${state}`}
                      disabled={unavailable}
                      aria-pressed={state === 'selected'}
                      aria-label={label}
                      title={`${slot.inicio} – ${slot.fin}`}
                      onClick={() => onSeatClick(room.id, slot)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <Legend />
    </section>
  );
}

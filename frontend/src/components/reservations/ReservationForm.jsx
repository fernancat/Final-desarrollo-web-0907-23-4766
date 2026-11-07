import { useState } from 'react';
import { createReservation } from '../../api/reservationApi.js';
import { reservationDto } from '../../validation/reservationDto.js';
import { serverErrorsToFields } from '../../validation/serverErrors.js';
import { todayInGuatemala } from '../../utils/time.js';
import { FormField } from '../FormField.jsx';
import './ReservationForm.css';

export function ReservationForm({ rooms, draft, date, occupied, onFieldChange, onReserved }) {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setSuccess('');
    onFieldChange(name, value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setSuccess('');

    const { data, errors: validationErrors } = reservationDto({ ...draft, fecha: date }, occupied);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await createReservation(data);

      const room = rooms.find((item) => item.id === data.sala_id);
      setSuccess(`Reservaste ${room?.nombre} de ${data.hora_inicio} a ${data.hora_fin}.`);
      onReserved();
    } catch (error) {
      setErrors(serverErrorsToFields(error));
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form reservation-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__title">Nueva reserva</h2>

      <p className="form__hint">
        Toca un horario libre en la cuadrícula y luego otro de la misma fila para abarcar varias horas.
      </p>

      {message ? <p className="alert" role="alert">{message}</p> : null}
      {success ? <p className="alert alert--success" role="status">{success}</p> : null}

      <label className="field">
        <span className="field__label">Sala</span>

        <select
          className="field__input"
          name="sala_id"
          value={draft.sala_id || ''}
          aria-invalid={errors.sala_id ? 'true' : 'false'}
          onChange={handleChange}
        >
          <option value="">Selecciona una sala</option>

          {rooms.map((room) => (
            <option key={room.id} value={room.id}>{room.nombre}</option>
          ))}
        </select>

        {errors.sala_id ? <span className="field__error">{errors.sala_id}</span> : null}
      </label>

      <FormField
        label="Fecha"
        name="fecha"
        type="date"
        min={todayInGuatemala()}
        value={date}
        error={errors.fecha}
        onChange={handleChange}
      />

      <div className="form__row">
        <FormField
          label="Hora de inicio"
          name="hora_inicio"
          type="time"
          step={300}
          value={draft.hora_inicio}
          error={errors.hora_inicio}
          onChange={handleChange}
        />

        <FormField
          label="Hora de fin"
          name="hora_fin"
          type="time"
          step={300}
          value={draft.hora_fin}
          error={errors.hora_fin}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="button button--primary" disabled={submitting}>
        {submitting ? 'Reservando…' : 'Confirmar reserva'}
      </button>
    </form>
  );
}

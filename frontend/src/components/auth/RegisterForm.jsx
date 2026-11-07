import { useState } from 'react';
import { register } from '../../api/authApi.js';
import { registerDto } from '../../validation/authDto.js';
import { serverErrorsToFields } from '../../validation/serverErrors.js';
import { FormField } from '../FormField.jsx';

const EMPTY_FORM = { nombre: '', apellidos: '', correo: '', contrasena: '' };

export function RegisterForm({ onAuthenticated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    const { data, errors: validationErrors } = registerDto(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const user = await register(data);
      onAuthenticated(user);
    } catch (error) {
      setErrors(serverErrorsToFields(error));
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__title">Crear cuenta</h2>

      {message ? <p className="alert" role="alert">{message}</p> : null}

      <div className="form__row">
        <FormField
          label="Nombre"
          name="nombre"
          autoComplete="given-name"
          maxLength={80}
          value={form.nombre}
          error={errors.nombre}
          onChange={handleChange}
        />

        <FormField
          label="Apellidos"
          name="apellidos"
          autoComplete="family-name"
          maxLength={120}
          value={form.apellidos}
          error={errors.apellidos}
          onChange={handleChange}
        />
      </div>

      <FormField
        label="Correo"
        name="correo"
        type="email"
        autoComplete="email"
        maxLength={254}
        value={form.correo}
        error={errors.correo}
        onChange={handleChange}
      />

      <FormField
        label="Contraseña"
        name="contrasena"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        value={form.contrasena}
        error={errors.contrasena}
        onChange={handleChange}
      />

      <button type="submit" className="button button--primary" disabled={submitting}>
        {submitting ? 'Creando cuenta…' : 'Registrarme'}
      </button>
    </form>
  );
}

import { useState } from 'react';
import { login } from '../../api/authApi.js';
import { loginDto } from '../../validation/authDto.js';
import { serverErrorsToFields } from '../../validation/serverErrors.js';
import { FormField } from '../FormField.jsx';

const EMPTY_FORM = { correo: '', contrasena: '' };

export function LoginForm({ onAuthenticated }) {
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

    const { data, errors: validationErrors } = loginDto(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const user = await login(data);
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
      <h2 className="form__title">Iniciar sesión</h2>

      {message ? <p className="alert" role="alert">{message}</p> : null}

      <FormField
        label="Correo"
        name="correo"
        type="email"
        autoComplete="email"
        value={form.correo}
        error={errors.correo}
        onChange={handleChange}
      />

      <FormField
        label="Contraseña"
        name="contrasena"
        type="password"
        autoComplete="current-password"
        value={form.contrasena}
        error={errors.contrasena}
        onChange={handleChange}
      />

      <button type="submit" className="button button--primary" disabled={submitting}>
        {submitting ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  );
}

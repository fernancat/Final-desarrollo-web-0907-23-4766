const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const MAX_PASSWORD_BYTES = 72;

function validateEmail(correo) {
  if (!EMAIL_PATTERN.test(correo)) {
    return 'Ingresa un correo válido.';
  }

  return null;
}

function validatePassword(contrasena) {
  if (contrasena.length < MIN_PASSWORD) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }

  const bytes = new TextEncoder().encode(contrasena).length;

  if (bytes > MAX_PASSWORD_BYTES) {
    return 'La contraseña no puede superar 72 bytes.';
  }

  return null;
}

function removeEmpty(errors) {
  const entries = Object.entries(errors).filter(([, message]) => message);

  return Object.fromEntries(entries);
}

export function loginDto(form) {
  const data = {
    correo: form.correo.trim().toLowerCase(),
    contrasena: form.contrasena,
  };

  const errors = removeEmpty({
    correo: validateEmail(data.correo),
    contrasena: validatePassword(data.contrasena),
  });

  return { data, errors };
}

export function registerDto(form) {
  const data = {
    nombre: form.nombre.trim(),
    apellidos: form.apellidos.trim(),
    correo: form.correo.trim().toLowerCase(),
    contrasena: form.contrasena,
  };

  const errors = removeEmpty({
    nombre: data.nombre ? null : 'Ingresa tu nombre.',
    apellidos: data.apellidos ? null : 'Ingresa tus apellidos.',
    correo: validateEmail(data.correo),
    contrasena: validatePassword(data.contrasena),
  });

  return { data, errors };
}

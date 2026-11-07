import { useState } from 'react';
import { LoginForm } from './LoginForm.jsx';
import { RegisterForm } from './RegisterForm.jsx';
import './AuthScreen.css';

export function AuthScreen({ notice, onAuthenticated }) {
  const [view, setView] = useState('login');

  const isLogin = view === 'login';

  return (
    <main className="auth">
      <section className="auth__intro">
        <p className="auth__eyebrow">Biblioteca</p>
        <h1 className="auth__title">Reserva tu sala de estudio</h1>
        <p className="auth__text">
          Elige la sala, el día y el horario. Las reservas no se cruzan entre sí.
        </p>
      </section>

      <section className="auth__panel">
        {notice ? <p className="alert" role="alert">{notice}</p> : null}

        {isLogin
          ? <LoginForm onAuthenticated={onAuthenticated} />
          : <RegisterForm onAuthenticated={onAuthenticated} />}

        <p className="auth__switch">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}

          <button
            type="button"
            className="link-button"
            onClick={() => setView(isLogin ? 'register' : 'login')}
          >
            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </p>
      </section>
    </main>
  );
}

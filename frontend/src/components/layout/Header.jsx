import './Header.css';

export function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true" />
        <span>Salas de biblioteca</span>
      </div>

      <div className="header__user">
        <span className="header__name">{user.nombre} {user.apellidos}</span>

        <button type="button" className="button button--ghost" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

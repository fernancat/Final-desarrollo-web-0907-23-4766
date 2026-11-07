import { useSession } from './hooks/useSession.js';
import { AuthScreen } from './components/auth/AuthScreen.jsx';
import { Dashboard } from './components/Dashboard.jsx';

export default function App() {
  const session = useSession();

  if (session.checking) {
    return <p className="splash">Verificando sesión…</p>;
  }

  return session.user
    ? <Dashboard user={session.user} onLogout={session.endSession} />
    : <AuthScreen notice={session.notice} onAuthenticated={session.startSession} />;
}

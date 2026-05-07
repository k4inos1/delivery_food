import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFirebaseConfigured) {
      setError('Configura las variables de entorno de Firebase antes de iniciar sesión.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AdminRoute listens to onAuthStateChanged and will re-render on successful login
    } catch {
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');

    if (!isFirebaseConfigured) {
      setError('Configura las variables de entorno de Firebase antes de iniciar sesión.');
      return;
    }

    setGoogleLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError('No fue posible iniciar sesión con Google. Por favor, inténtalo de nuevo.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">🍕</span>
          <h1>Panel de Administración</h1>
          <p>Accede con Google o con Email/Password habilitado en Firebase Auth.</p>
        </div>

        <button type="button" className="login-google-btn" onClick={handleGoogleLogin} disabled={googleLoading || loading}>
          {googleLoading ? 'Conectando con Google...' : 'Continuar con Google'}
        </button>

        <div className="login-divider" aria-hidden="true">
          <span>o</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión con correo'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

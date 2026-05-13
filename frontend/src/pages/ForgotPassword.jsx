import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/users/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
      <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}>
            🔐
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">¿Olvidaste tu contraseña?</h1>
        <p className="text-neutral-500 text-center mb-8">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>

        {success ? (
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid #22c55e',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>📬</p>
            <p style={{ fontWeight: 700, color: '#16a34a', marginBottom: '8px' }}>
              ¡Correo enviado!
            </p>
            <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6 }}>
              Si <strong>{email}</strong> está registrado, recibirás un enlace en tu bandeja de entrada en los próximos minutos.
            </p>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '12px' }}>
              Revisa también tu carpeta de spam.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="tu@correo.com"
                  required
                  autoFocus
                />
              </div>

              <button
                id="forgot-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg font-bold flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Enviar enlace de recuperación'
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-center text-sm text-neutral-500">
          <Link to="/login" className="text-primary hover:text-primary-dark font-bold transition-colors">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

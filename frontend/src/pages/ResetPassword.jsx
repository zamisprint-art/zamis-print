import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    setLoading(true);
    try {
      await axios.put(`/api/users/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'El enlace no es válido o ha expirado.');
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
            🔑
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">Nueva contraseña</h1>
        <p className="text-neutral-500 text-center mb-8">
          Crea una contraseña segura para tu cuenta.
        </p>

        {success ? (
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid #22c55e',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>✅</p>
            <p style={{ fontWeight: 700, color: '#16a34a', marginBottom: '8px' }}>
              ¡Contraseña actualizada!
            </p>
            <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6 }}>
              Serás redirigido al inicio de sesión en unos segundos...
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
                  Nueva contraseña
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Mínimo 6 caracteres"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Repite tu nueva contraseña"
                  required
                />
              </div>

              <button
                id="reset-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg font-bold flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Restablecer contraseña'
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

export default ResetPassword;

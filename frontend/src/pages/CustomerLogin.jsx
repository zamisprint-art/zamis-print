import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const CustomerLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  
  const { userInfo, setCredentials } = useAuthStore();

  const redirect = new URLSearchParams(search).get('redirect') || '/profile';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data } = await axios.post('/api/users/login', { email, password });
        setCredentials(data);
      } else {
        const { data } = await axios.post('/api/users', { name, email, password });
        setCredentials(data);
      }
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
      <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {isLogin ? 'Bienvenido a ZAMIS Print' : 'Crea tu Cuenta'}
        </h1>
        <p className="text-neutral-500 text-center mb-8">
          {isLogin ? 'Ingresa para ver el estado de tus compras.' : 'Regístrate para guardar tu historial.'}
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Juan Pérez"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
            {isLogin && (
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:text-primary-dark font-medium transition-colors mt-2 inline-block"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            )}
          </div>


          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg font-bold flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Registrarse'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-primary hover:text-primary-dark font-bold transition-colors"
          >
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;

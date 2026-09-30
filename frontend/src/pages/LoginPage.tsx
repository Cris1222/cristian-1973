import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hashPassword } from '../utils/auth';
import '../hooks/Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  balance: number;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    if (!email || !formData.password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setError('No existe una cuenta registrada.');
      return;
    }

    const user: User = JSON.parse(storedUser);
    if (user.email !== email) {
      setError('Correo o contraseña incorrectos.');
      return;
    }

    const passwordHash = await hashPassword(formData.password);
    if (user.password !== passwordHash) {
      setError('Correo o contraseña incorrectos.');
      return;
    }

    // Crear sesión
    const session = {
      userId: user.id,
      email: user.email,
      active: true,
    };

    localStorage.setItem('session', JSON.stringify(session));
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">
            Correo electrónico
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">
            Contraseña
          </label>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="submit-button">
          Entrar
        </button>

        <div className="register-section">
          <span>¿No tienes una cuenta?</span>
          <Link to="/register" className="register-link">
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  );
};
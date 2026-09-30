import React, { useState } from 'react';
import '../hooks/Login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { hashPassword } from '../utils/auth';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

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

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();

    if (!fullName || !email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const existingUser = localStorage.getItem('user');

    if (existingUser) {
      const user = JSON.parse(existingUser);
      if (user.email === email) {
        setError('Ya existe una cuenta con este correo.');
        return;
      }
    }

    const passwordHash = await hashPassword(formData.password);

    const newUser = {
        id: crypto.randomUUID(),
        fullName,
        email,
        password: passwordHash,
        balance: 0,
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    navigate('/login');
    };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Crear Cuenta</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="fullName">Nombre completo</label>

          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Cristian Corona"
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Correo electrónico</label>

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
          <label htmlFor="password">Contraseña</label>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">
            Confirmar contraseña
          </label>

          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="submit-button">
          Crear cuenta
        </button>
        <div className="register-section">
          <span>¿Ya tienes una cuenta?</span>

          <Link to="/login" className="register-link">
            Inicia Sesion
          </Link>
        </div>
      </form>
    </div>
  );
};
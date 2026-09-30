import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BettingChart } from '../components/dashboard/BettingChart';
import { SnailWinsChart } from '../components/dashboard/SnailWinsChart';
import { RechargeModal } from '../components/dashboard/RechargeModal';
import '../hooks/Dashboard.css';

interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  balance: number;
}

export const DashboardPage = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');

  const initialUser: User | null = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState<User | null>(initialUser);

  const [showRechargeModal, setShowRechargeModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('session');
    navigate('/login');
  };

  const handleRechargeSuccess = (amount: number) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      balance: user.balance + amount,
    };

    setUser(updatedUser);

    localStorage.setItem(
      'user',
      JSON.stringify(updatedUser)
    );
  };

  if (!user) return null;
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Panel de apuestas</h1>
        </div>
        <div className="header-user">
          <div>
            <span>Bienvenido</span>
            <strong>{user.fullName}</strong>
          </div>
          <button className="logout-button"  onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main className="dashboard-content">
        <section className="balance-card">
          <div>
            <span className="balance-label">
              Saldo disponible
            </span>
            <h2 className="balance-amount">
              ${user.balance.toFixed(2)}
            </h2>
          </div>
          <button className="recharge-button" onClick={() => setShowRechargeModal(true)}>
            + Cargar saldo
          </button>
        </section>
        <section className="charts-grid">
          <div className="chart-card">
            <BettingChart />
          </div>
          <div className="chart-card">
            <SnailWinsChart />
          </div>
        </section>
      </main>
      {showRechargeModal && (
        <RechargeModal user={user} onClose={() => setShowRechargeModal(false)} onSuccess={handleRechargeSuccess} />
      )}
    </div>
  );
};
import { useState } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  balance: number;
}

interface Props {
  user: User;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

interface FormData {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  fullName: string;
  amount: string;
}

export const RechargeModal = ({ user, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    fullName: user.fullName,
    amount: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
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
    const amount = Number(formData.amount);
    if (!formData.cardNumber || !formData.expirationDate || !formData.cvv || !formData.fullName || !formData.amount) {
      setError('Completa todos los campos.');
      return;
    }

    if (amount <= 0) {
      setError('El monto debe ser mayor que cero.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://localhost:3000/api/snailpay/charge',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            card_number: formData.cardNumber,
            expiration_date: formData.expirationDate,
            cvv: formData.cvv,
            full_name: formData.fullName,
            transaction_amount: amount,
            payer_id: user.id,
            payer_email: user.email,
          }),
        }
      );

      const data = await response.json();

      localStorage.setItem(
        'snailpay_payment_data',
        JSON.stringify({
          card_number: data.card_number,
          cvv: data.cvv,
        })
      );

      if (!response.ok || data.status !== 'approved') {
        if (data.status_detail === 'card_declined') {
          setError('La tarjeta fue rechazada.');
        } else if (data.status_detail === 'invalid_amount') {
          setError('El monto ingresado no es válido.');
        } else if (data.status_detail === 'internal_error') {
          setError('SnailPay no está disponible en este momento.');
        } else {
          setError('No fue posible procesar la transacción.');
        }
        return;
      }

      onSuccess(amount);
      setSuccess(`Operación aprobada. Se agregaron $${amount.toFixed(2)} a tu saldo.`);
      setFormData((prev) => ({
        ...prev,
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        amount: '',
      }));

    } catch {
      setError('No se pudo conectar con SnailPay.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="recharge-modal">
        <div className="modal-header">
          <div>
            <h2>Cargar saldo</h2>
            <p>Pago simulado mediante SnailPay</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}
        {success && (
          <div className="payment-success">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="payment-input">
            <label>Número de tarjeta</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234123412341234"
              maxLength={16}
            />
          </div>

          <div className="payment-row">
            <div className="payment-input">
              <label>Vencimiento</label>
              <input
                type="text"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                placeholder="12/26"
                maxLength={5}
              />
            </div>

            <div className="payment-input">
              <label>CVV</label>
              <input
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="543"
                maxLength={3}
              />
            </div>
          </div>

          <div className="payment-input">
            <label>Nombre completo</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="payment-input">
            <label>Monto de recarga</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="500"
              min="1"
              step="0.01"
            />
          </div>

          {success ? (
            <button type="button" className="pay-button" onClick={onClose}>
                Cerrar
            </button>
            ) : (
            <button type="submit" className="pay-button" disabled={loading}>
                {loading ? 'Procesando...' : 'Cargar saldo'}
            </button>
            )}
        </form>
      </div>
    </div>
  );
};
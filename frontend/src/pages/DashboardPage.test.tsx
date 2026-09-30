import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';
describe('Dashboard - SnailPay', () => {
  beforeEach(() => {
    localStorage.clear();

    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 'user_1',
        fullName: 'Usuario Prueba',
        email: 'correo@ejemplo.com',
        password: 'hash',
        balance: 0,
      })
    );

    localStorage.setItem(
      'session',
      JSON.stringify({
        userId: 'user_1',
        email: 'correo@ejemplo.com',
        active: true,
      })
    );

    vi.restoreAllMocks();
  });

  it('debe aumentar el saldo cuando SnailPay aprueba la recarga', async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'txn_test_1',
        status: 'approved',
        status_detail: 'accredited',
        transaction_amount: 500,
        date_created: new Date().toISOString(),
        authorization_code: 'AUTH_TEST',
        reference: 'SNAIL_TEST',
        payer_id: 'user_1',
        payer_email: 'correo@ejemplo.com',
        card_number: '1234123412341234',
        cvv: '543',
      }),
    } as Response);

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('$0.00')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cargar saldo/i }));

    await user.type(screen.getByPlaceholderText('1234123412341234'),'1234123412341234');

    await user.type(screen.getByPlaceholderText('12/26'),'12/26');

    await user.type(screen.getByPlaceholderText('543'),'543');

    await user.type(screen.getByPlaceholderText('500'),'500');

    const buttons = screen.getAllByRole('button', { name: /^cargar saldo$/i });

    await user.click(buttons[buttons.length - 1]);

    await waitFor(() => {expect(screen.getByText('$500.00')).toBeInTheDocument();});

    const storedUser = JSON.parse(localStorage.getItem('user')!);

    expect(storedUser.balance).toBe(500);
  });

});
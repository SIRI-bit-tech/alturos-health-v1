import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/auth/login/page';

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams('redirect=/dashboard'),
}));

// Mock useAuth hook
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    login: jest.fn(async () => ({ success: true })),
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('LoginPage', () => {
  it('renders and submits login form', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'user1' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
    });
  });
});

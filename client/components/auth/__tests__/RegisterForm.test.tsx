import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useRegister } from '@/lib/auth';

// Mock the auth hook
jest.mock('@/lib/auth');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;

describe('RegisterForm', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
  });

  const renderRegisterForm = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );
  };

  it('renders register form fields', () => {
    mockUseRegister.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({}),
      isPending: false,
    } as any);

    renderRegisterForm();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    
    mockUseRegister.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({}),
      isPending: false,
    } as any);

    renderRegisterForm();

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/display name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for password mismatch', async () => {
    const user = userEvent.setup();
    
    mockUseRegister.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({}),
      isPending: false,
    } as any);

    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(usernameInput, 'testuser');
    await user.type(displayNameInput, 'Test User');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockRegister = jest.fn().mockResolvedValue({});
    
    mockUseRegister.mockReturnValue({
      mutateAsync: mockRegister,
      isPending: false,
    } as any);

    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(usernameInput, 'testuser');
    await user.type(displayNameInput, 'Test User');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'password123',
        locale: 'en',
      });
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    
    mockUseRegister.mockReturnValue({
      mutateAsync: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))),
      isPending: true,
    } as any);

    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(usernameInput, 'testuser');
    await user.type(displayNameInput, 'Test User');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('shows error message on registration failure', async () => {
    const user = userEvent.setup();
    const mockRegister = jest.fn().mockRejectedValue(new Error('Email already exists'));
    
    mockUseRegister.mockReturnValue({
      mutateAsync: mockRegister,
      isPending: false,
    } as any);

    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(emailInput, 'existing@example.com');
    await user.type(usernameInput, 'testuser');
    await user.type(displayNameInput, 'Test User');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// Mock the auth hook
jest.mock('@/contexts/AuthContext');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('ProtectedRoute', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  const renderProtectedRoute = (children: React.ReactNode = <div>Protected Content</div>) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ProtectedRoute>{children}</ProtectedRoute>
      </QueryClientProvider>
    );
  };

  it('shows loader when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: undefined,
      isLoading: true,
      error: null,
      refreshAuth: jest.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      isLoading: false,
      error: null,
      refreshAuth: jest.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders nothing when user is not authenticated (will redirect)', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      refreshAuth: jest.fn(),
    });

    const { container } = renderProtectedRoute();

    expect(container.firstChild).toBeNull();
  });
});
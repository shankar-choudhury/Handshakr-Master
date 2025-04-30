import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../app/register/page';
import UserRegistrationForm from '@/_ui/user-registration-form';
import { registerNewUser } from '@/_lib/userAuthService';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock the UserRegistrationForm component
jest.mock('@/_ui/user-registration-form', () => {
  const UserRegistrationForm = () => (
    <form data-testid="user-registration-form">
      <div>Mock Registration Form</div>
    </form>
  );
  return UserRegistrationForm;
});

// Mock the userAuthService
jest.mock('@/_lib/userAuthService', () => ({
  registerNewUser: jest.fn(),
}));

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the banner image with correct attributes', () => {
    render(<RegisterPage />);
    
    const bannerImg = screen.getByAltText('handshakr banner');
    expect(bannerImg).toBeInTheDocument();
    expect(bannerImg).toHaveAttribute('src', '/handshakr-banner.png');
    expect(bannerImg).toHaveAttribute('width', '1153');
    expect(bannerImg).toHaveAttribute('height', '370');
  });

  it('renders the user registration form', () => {
    render(<RegisterPage />);
    
    const form = screen.getByTestId('user-registration-form');
    expect(form).toBeInTheDocument();
    expect(screen.getByText('Mock Registration Form')).toBeInTheDocument();
  });

  it('matches the basic component structure', () => {
    const { container } = render(<RegisterPage />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toBeInTheDocument();
    
    const cardContainer = mainContainer?.firstChild;
    expect(cardContainer).toBeInTheDocument();
    
    expect(cardContainer?.firstChild).toBe(screen.getByAltText('handshakr banner'));
    expect(cardContainer?.childNodes[1]).toBe(screen.getByTestId('user-registration-form'));
  });

  describe('Form Submission Responses', () => {
    it('displays success message after successful registration', async () => {
      // Mock successful registration response
      (registerNewUser as jest.Mock).mockResolvedValueOnce({
        success: true
      });

      render(<UserRegistrationForm />);
      
      // Simulate form submission
      fireEvent.submit(screen.getByTestId('user-registration-form'));
      
      // Wait for state update
      await waitFor(() => {
        expect(screen.getByText(/registration successful!/i)).toBeInTheDocument();
        expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument();
      });
    });

    it('displays field validation errors', async () => {
      // Mock validation error response
      (registerNewUser as jest.Mock).mockResolvedValueOnce({
        errors: {
          username: ['Username must be at least 5 characters'],
          email: ['Invalid email format'],
          password: [
            'Password must be at least 8 characters',
            'Must contain a number'
          ]
        }
      });

      render(<UserRegistrationForm />);
      
      fireEvent.submit(screen.getByTestId('user-registration-form'));
      
      await waitFor(() => {
        expect(screen.getByText(/username must be at least 5 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/must contain a number/i)).toBeInTheDocument();
      });
    });

    it('displays server error message', async () => {
      // Mock server error response
      (registerNewUser as jest.Mock).mockResolvedValueOnce({
        message: 'Username already exists'
      });

      render(<UserRegistrationForm />);
      
      fireEvent.submit(screen.getByTestId('user-registration-form'));
      
      await waitFor(() => {
        expect(screen.getByText(/username already exists/i)).toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      // Mock a delayed response to test pending state
      (registerNewUser as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000))
      );

      render(<UserRegistrationForm />);
      
      fireEvent.submit(screen.getByTestId('user-registration-form'));
      
      // Check if loading state appears
      expect(screen.getByText(/signing up.../i)).toBeInTheDocument();
      
      await waitFor(() => {
        // After submission completes, loading should disappear
        expect(screen.queryByText(/signing up.../i)).not.toBeInTheDocument();
      });
    });
  });
});
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

jest.mock('@/_ui/login-form', () => {
  const LoginForm = () => <div data-testid="login-form">Login Form</div>;
  return LoginForm;
});

jest.mock('@/_ui/create-new-account-button', () => {
  const CreateNewAccountButton = () => (
    <button data-testid="create-account-button">Create New Account</button>
  );
  return CreateNewAccountButton;
});

describe('Home Page', () => {
  it('renders all main components correctly', () => {
    render(<Home />);

    // Verify the banner image is rendered with correct attributes
    const bannerImg = screen.getByAltText('handshakr banner');
    expect(bannerImg).toBeInTheDocument();
    expect(bannerImg).toHaveAttribute('src', '/handshakr-banner.png');
    expect(bannerImg).toHaveClass('w-full h-auto');

    // Verify login form is rendered
    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    // Verify the divider with "or" text
    const dividerText = screen.getByText('or');
    expect(dividerText).toBeInTheDocument();
    expect(dividerText).toHaveClass('text-neutral');

    // Verify create account button is rendered
    const createAccountButton = screen.getByTestId('create-account-button');
    expect(createAccountButton).toBeInTheDocument();
    expect(createAccountButton).toHaveTextContent('Create New Account');
  });

  it('has correct layout structure', () => {
    const { container } = render(<Home />);
    
    // Check main container classes
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass(
      'flex flex-col items-center justify-start min-h-screen'
    );


    // Check content container classes
    const contentContainer = screen.getByTestId('login-form').parentElement;
    expect(contentContainer).toHaveClass('p-4');
  });
});
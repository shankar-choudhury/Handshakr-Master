import { render, screen, waitFor } from '@testing-library/react';
import Page from '../app/received-handshakes/page';
import { Handshake } from '@/_lib/definitions';

// Mock child components with proper TypeScript typing
jest.mock('@/_ui/page-header', () => ({ title, subTitle }: { 
  title: string, 
  subTitle: string 
}) => (
  <div data-testid="page-header">
    <h1>{title}</h1>
    <p>{subTitle}</p>
  </div>
));

jest.mock('@/_ui/handshake-card', () => (props: Handshake) => (
  <div data-testid="handshake-card">
    {props.handshakeName} - {props.signedDate}
    {props.handshakeStatus && <span data-testid="status-badge">{props.handshakeStatus}</span>}
  </div>
));

// Mock service functions to match userDataAccess implementation
jest.mock('@/_lib/userDataAccess', () => ({
  fetchUserProfile: jest.fn(),
  fetchReceivedHandshakes: jest.fn(),
}));

import {
  fetchUserProfile,
  fetchReceivedHandshakes,
} from '@/_lib/userDataAccess';

describe('Received Handshakes Page', () => {
  const mockHandshake: Handshake = {
    handshakeName: 'Test Handshake',
    encryptedDetails: 'Encrypted Data',
    signedDate: '2023-01-01',
    completedDate: '2023-01-02',
    handshakeStatus: 'Completed',
    initiatorUsername: 'alice',
    acceptorUsername: 'bob',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock sessionStorage for CSRF token
    Storage.prototype.getItem = jest.fn(() => 'mock-csrf-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    (fetchUserProfile as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<Page />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByTestId('handshake-card')).not.toBeInTheDocument();
  });

  it('displays authentication error when no CSRF token', async () => {
    Storage.prototype.getItem = jest.fn(() => null);
    
    render(<Page />);
    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    });
  });

  it('displays error when profile fetch fails', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Profile load failed',
    });

    render(<Page />);
    await waitFor(() => {
      expect(screen.getByText('Profile load failed')).toBeInTheDocument();
    });
  });

  it('displays authentication error when profile fetch returns 401', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Authentication Error',
    });

    render(<Page />);
    await waitFor(() => {
      expect(screen.getByText('Authentication Error')).toBeInTheDocument();
    });
  });

  it('displays error when no username is returned', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { data: {} }, // No username
    });

    render(<Page />);
    await waitFor(() => {
      expect(screen.getByText('Failed to get user profile')).toBeInTheDocument();
    });
  });

  it('renders handshake cards when data is fetched successfully', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { data: { username: 'bob' } },
    });
    (fetchReceivedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: [mockHandshake],
    });

    render(<Page />);
    
    await waitFor(() => {
      const card = screen.getByTestId('handshake-card');
      expect(card).toHaveTextContent('Test Handshake - 2023-01-01');
      expect(screen.getByTestId('status-badge')).toHaveTextContent('Completed');
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { data: { username: 'bob' } },
    });
    (fetchReceivedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Failed to get received handshakes',
    });

    render(<Page />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to get received handshakes')).toBeInTheDocument();
    });
  });

  it('shows empty state when no handshakes found', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { data: { username: 'bob' } },
    });
    (fetchReceivedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: [],
    });

    render(<Page />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('handshake-card')).not.toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  it('handles network errors', async () => {
    (fetchUserProfile as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<Page />);
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
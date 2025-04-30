import { render, screen, waitFor } from '@testing-library/react';
import Page from '../app/history/page';
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
  fetchInitiatedHandshakes: jest.fn(),
  fetchReceivedHandshakes: jest.fn(),
}));

import {
  fetchUserProfile,
  fetchInitiatedHandshakes,
  fetchReceivedHandshakes,
} from '@/_lib/userDataAccess';

describe('Handshakes History Page', () => {
  const mockInitiatedHandshakes: Handshake[] = [
    {
      handshakeName: 'Handshake A',
      encryptedDetails: 'Encrypted A',
      signedDate: '2023-01-01',
      completedDate: '2023-01-02',
      handshakeStatus: 'Completed',
      initiatorUsername: 'alice',
      acceptorUsername: 'bob',
    }
  ];

  const mockReceivedHandshakes: Handshake[] = [
    {
      handshakeName: 'Handshake B',
      encryptedDetails: 'Encrypted B',
      signedDate: '2023-01-03',
      completedDate: '2023-01-04',
      handshakeStatus: 'Pending',
      initiatorUsername: 'charlie',
      acceptorUsername: 'alice',
    }
  ];

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

  it('renders handshakes in descending order by signed date', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { data: { username: 'alice' } },
    });
    (fetchInitiatedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockInitiatedHandshakes,
    });
    (fetchReceivedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockReceivedHandshakes,
    });

    render(<Page />);
    
    await waitFor(() => {
      const cards = screen.getAllByTestId('handshake-card');
      expect(cards).toHaveLength(2);
      expect(cards[0]).toHaveTextContent('Handshake B - 2023-01-03');
      expect(cards[1]).toHaveTextContent('Handshake A - 2023-01-01');
    });
  });

  it('handles API errors gracefully', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { data: { username: 'alice' } },
    });
    (fetchInitiatedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Failed to get initiated handshakes',
    });
    (fetchReceivedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Failed to get received handshakes',
    });

    render(<Page />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to get initiated handshakes')).toBeInTheDocument();
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

  it('shows empty state when no handshakes found', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { data: { username: 'alice' } },
    });
    (fetchInitiatedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: [],
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

  it('shows handshake status badges', async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { data: { username: 'alice' } },
    });
    (fetchInitiatedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockInitiatedHandshakes,
    });
    (fetchReceivedHandshakes as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockReceivedHandshakes,
    });

    render(<Page />);
    
    await waitFor(() => {
      const statusBadges = screen.getAllByTestId('status-badge');
      expect(statusBadges).toHaveLength(2);
      expect(statusBadges[0]).toHaveTextContent('Pending');
      expect(statusBadges[1]).toHaveTextContent('Completed');
    });
  });
});
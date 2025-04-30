import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '../app/price-analyzer/page';
import { PriceStats } from '@/_lib/definitions';

// Mock child components with proper props
jest.mock('@/_ui/page-header', () => () => (
  <div data-testid="page-header">Price Analyzer</div>
));

jest.mock('@/_ui/price-input-form', () => ({ onSubmit, loading }: { 
  onSubmit: (itemName: string) => void, 
  loading: boolean 
}) => (
  <form data-testid="price-input-form" onSubmit={(e) => {
    e.preventDefault();
    onSubmit('Test Item');
  }}>
    <input data-testid="item-input" name="itemName" />
    <button 
      data-testid="submit-button" 
      type="submit" 
      disabled={loading}
    >
      {loading ? 'Analyzing...' : 'Get Analysis'}
    </button>
  </form>
));

jest.mock('@/_ui/price-stats-card', () => ({ 
  itemName, max, mean, median, min 
}: { 
  itemName: string,
  max: number,
  mean: number,
  median: number,
  min: number
}) => (
  <div data-testid="price-stats-card">
    {itemName} - Max: {max}, Min: {min}
  </div>
));

jest.mock('@/_ui/price-graphs', () => ({ 
  histogramUrl, medianGraphUrl 
}: { 
  histogramUrl?: string, 
  medianGraphUrl?: string 
}) => (
  <div data-testid="price-graphs">
    {histogramUrl && <div data-testid="histogram">{histogramUrl}</div>}
    {medianGraphUrl && <div data-testid="median-graph">{medianGraphUrl}</div>}
  </div>
));

// Mock service functions
jest.mock('@/_lib/priceAnalyzerService', () => ({
  fetchPriceStats: jest.fn(),
  fetchPriceHistogram: jest.fn(),
  fetchMedianPriceGraph: jest.fn(),
}));

import {
  fetchPriceStats,
  fetchPriceHistogram,
  fetchMedianPriceGraph,
} from '@/_lib/priceAnalyzerService';

describe('Price Analyzer Page', () => {
  const mockStats: PriceStats = {
    max: 100,
    mean: 60,
    median: 55,
    min: 20,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial UI with form and header', () => {
    render(<Page />);
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('price-input-form')).toBeInTheDocument();
  });

  it('shows loading state during form submission', async () => {
    (fetchPriceStats as jest.Mock).mockImplementation(() => 
      new Promise(() => {})
    );

    render(<Page />);
    fireEvent.submit(screen.getByTestId('price-input-form'));
    
    expect(screen.getByTestId('submit-button')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Analyzing...');
  });

  it('handles error from fetchPriceStats', async () => {
    (fetchPriceStats as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Failed to fetch stats',
    });

    render(<Page />);
    fireEvent.submit(screen.getByTestId('price-input-form'));

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch stats')).toBeInTheDocument();
      expect(screen.queryByTestId('price-stats-card')).not.toBeInTheDocument();
    });
  });

  it('handles malformed stats data', async () => {
    (fetchPriceStats as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: ['Test Item', null], // Malformed data
    });

    render(<Page />);
    fireEvent.submit(screen.getByTestId('price-input-form'));

    await waitFor(() => {
      expect(screen.getByText('Malformed stats object.')).toBeInTheDocument();
    });
  });

  it('handles partial success with failed histogram', async () => {
    (fetchPriceStats as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: ['Test Item', mockStats],
    });
    (fetchPriceHistogram as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Histogram failed',
    });

    render(<Page />);
    fireEvent.submit(screen.getByTestId('price-input-form'));

    await waitFor(() => {
      expect(screen.getByText('Histogram failed')).toBeInTheDocument();
      expect(screen.getByTestId('price-stats-card')).toBeInTheDocument();
      expect(screen.queryByTestId('histogram')).not.toBeInTheDocument();
    });
  });

  it('displays all data on successful fetches', async () => {
    (fetchPriceStats as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: ['Test Item', mockStats],
    });
    (fetchPriceHistogram as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: 'histogram.png',
    });
    (fetchMedianPriceGraph as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: 'median.png',
    });

    render(<Page />);
    fireEvent.submit(screen.getByTestId('price-input-form'));

    await waitFor(() => {
      expect(screen.getByTestId('price-stats-card')).toHaveTextContent('Test Item - Max: 100, Min: 20');
      expect(screen.getByTestId('histogram')).toHaveTextContent('histogram.png');
      expect(screen.getByTestId('median-graph')).toHaveTextContent('median.png');
      expect(screen.queryByText(/failed/i)).not.toBeInTheDocument();
    });
  });

  it('clears previous data on new submission', async () => {
    // First successful response
    (fetchPriceStats as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: ['First Item', mockStats],
    });
    (fetchPriceHistogram as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: 'first-histogram.jpg',
    });

    // Second failing response
    (fetchPriceStats as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Second attempt failed',
    });

    render(<Page />);
    
    // First submission
    fireEvent.submit(screen.getByTestId('price-input-form'));
    await waitFor(() => {
      expect(screen.getByTestId('price-stats-card')).toBeInTheDocument();
    });

    // Second submission
    fireEvent.submit(screen.getByTestId('price-input-form'));
    await waitFor(() => {
      expect(screen.getByText('Second attempt failed')).toBeInTheDocument();
      expect(screen.queryByTestId('price-stats-card')).not.toBeInTheDocument();
    });
  });
});
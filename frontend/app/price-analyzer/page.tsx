'use client';

import { useState } from 'react';
import { fetchPriceStats, fetchMedianPriceGraph, fetchPriceHistogram } from '@/_lib/priceAnalyzerService';
import PriceInputForm from '@/_ui/price-input-form';
import PriceStatsCard from '@/_ui/price-stats-card';
import PriceGraphs from '@/_ui/price-graphs';
import { PriceStats } from '@/_lib/definitions';
import PageHeader from "@/_ui/page-header";
import { userAuthRedirect } from '@/_lib/userAuthService';

/**
 * Price Analyzer Page
 * 
 * A page where users can input an item name and view price statistics, 
 * a histogram of prices, and a median price graph for that item.
 * 
 * Handles loading, error, and state management for fetching price stats, 
 * histogram, and median graph data.
 * 
 * @returns A component that displays price analysis results.
 */
export default function Page() {

  //auth check
  userAuthRedirect();

  /** Holds the price statistics (max, mean, median, min) of the item */
  const [priceData, setPriceData] = useState<PriceStats | null>(null);

  /** Holds the URL for the price histogram graph */
  const [histogramUrl, setHistogramUrl] = useState('');

  /** Holds the URL for the median price graph */
  const [medianGraphUrl, setMedianGraphUrl] = useState('');

  /** Whether data is being loaded */
  const [loading, setLoading] = useState(false);

  /** Holds any error message encountered during data fetching */
  const [error, setError] = useState('');

  /** Holds the name of the item being analyzed */
  const [itemName, setItemName] = useState('');

  /**
   * Handles form submission to fetch price analysis data for a given item.
   * 
   * Fetches price stats, histogram, and median price graph for the item name.
   * Updates component state based on the fetched data or errors.
   * 
   * @param inputItemName - The name of the item to fetch price data for.
   */
  async function handleSubmit(inputItemName: string) {
    setLoading(true);
    setError('');
    setItemName(inputItemName);
    setPriceData(null);
    setHistogramUrl('');
    setMedianGraphUrl('');
  
    try {
      // Fetch price stats
      const statsRes = await fetchPriceStats(inputItemName);
      if (!statsRes.success || !Array.isArray(statsRes.data)) {
        throw new Error(statsRes.error || 'Failed to fetch price stats.');
      }
  
      const [resolvedName, stats] = statsRes.data;
      if (!stats || typeof stats !== 'object') {
        throw new Error('Malformed stats object.');
      }
  
      setItemName(resolvedName);
      setPriceData({
        max: stats.max,
        mean: stats.mean,
        median: stats.median,
        min: stats.min,
      });
  
      // Fetch histogram
      const histRes = await fetchPriceHistogram(inputItemName);
      if (!histRes.success) {
        throw new Error(histRes.error || 'Failed to fetch histogram graph.');
      }
      setHistogramUrl(histRes.data || '');
  
      // Fetch median price graph
      const medianRes = await fetchMedianPriceGraph(inputItemName);
      if (!medianRes.success) {
        throw new Error(medianRes.error || 'Failed to fetch median graph.');
      }
      setMedianGraphUrl(medianRes.data || '');
  
    } catch (err) {
      // console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col flex-start items-center gap-4 px-4">
      <PageHeader title = "Price Analyzer" subTitle="Get statistics about the price of an item"/>
      <PriceInputForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <p className="text-warning text-center mt-4 font-semibold">
          {error}
        </p>
      )}

      {priceData && (
        <PriceStatsCard
          itemName={itemName}
          max={priceData.max}
          mean={priceData.mean}
          median={priceData.median}
          min={priceData.min}
        />
      )}

      <PriceGraphs
        histogramUrl={histogramUrl}
        medianGraphUrl={medianGraphUrl}
      />
    </div>
  );
}

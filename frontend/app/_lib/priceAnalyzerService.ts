import { API } from './definitions'
/**
 * priceAnalyzerService
 *
 * This service provides utility functions for analyzing item price statistics.
 * It may include operations such as calculating mean, median, min, max, and other
 * data aggregation or normalization methods related to item pricing.
 *
 * Used throughout the application to support data visualization, historical price tracking,
 * and item value estimation in the UI.
 *
 * @module priceAnalyzerService
 */


/**
 * Fetches the price statistics for a given item.
 * 
 * @param itemName - The name of the item whose price statistics are being fetched.
 * @returns A result object containing either a success flag and data or an error message.
 */
export async function fetchPriceStats(itemName: string) {
    try {
      const response = await fetch(`${API.BASE}/${API.GET_PRICE_STATS}/${encodeURIComponent(itemName)}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        return { 
          success: false, 
          error: "Authentication Error" 
        };
      }
  
      if (!response.ok) {
        try {
          const errorData = await response.json();
          return { 
            success: false, 
            error: errorData.message || "Failed to fetch Price Stats" 
          };
        } catch {
          return {
            success: false,
            error: "Failed to fetch Price Stats"
          };
        }
      }
  
      const rawData = await response.json(); 
      console.log("[fetchPriceStats] rawData:", rawData);
      return { success: true, data: rawData };
    } catch (error) {
      console.error("fetchPriceStats() error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      };
    }
  }
  
  /**
   * Fetches the price histogram for a given item.
   * 
   * @param itemName - The name of the item whose price histogram is being fetched.
   * @returns A result object containing either a success flag and the image URL or an error message.
   */
  export async function fetchPriceHistogram(itemName: string) {
    try {
      const response = await fetch(`${API.BASE}/${API.GET_PRICE_HISTOGRAM}/${encodeURIComponent(itemName)}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "image/png",
        }
      });
  
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: "Authentication Error",
        };
      }
  
      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch price histogram (Status: ${response.status})`,
        };
      }
  
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      console.log("[fetchPriceHistogram] blob:", blob);
      console.log("[fetchPriceHistogram] imageURL:", imageUrl);
  
      return { success: true, data: imageUrl };
    } catch (error) {
      console.error("fetchPriceHistogram() error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }
  
  /**
   * Fetches the median price graph for a given item.
   * 
   * @param itemName - The name of the item whose median price graph is being fetched.
   * @returns A result object containing either a success flag and the image URL or an error message.
   */
  export async function fetchMedianPriceGraph(itemName: string) {
    try {
      const response = await fetch(`${API.BASE}/${API.GET_WEEKLY_MEDIAN_PRICE}/${encodeURIComponent(itemName)}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "image/png",
        }
      });
  
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: "Authentication Error",
        };
      }
  
      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch median price graph (Status: ${response.status})`,
        };
      }
  
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      console.log("[fetchMedianPriceGraph] blob:", blob);
      console.log("[fetchMedianPriceGraph] imageURL:", imageUrl);
  
      return { success: true, data: imageUrl };
    } catch (error) {
      console.error("fetchMedianPriceGraph() error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }
  
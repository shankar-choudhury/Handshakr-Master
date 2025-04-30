import { API } from './definitions'
import axios from 'axios'

/**
 * userDataAccess
 *
 * This module handles API calls related to user profiles and handshakes.
 * It includes functions to:
 * - Fetch the user's own profile data
 * - Retrieve handshakes initiated or received by the user
 *
 * All requests include CSRF token handling and basic authentication error checks.
 * Each function returns a standardized result object indicating success or failure.
 *
 * @module userDataAccess
 */

/**
 * Fetches the user's profile data from the server.
 * 
 * @returns A result object containing either a success flag and data or an error message.
 */
export async function fetchUserProfile() {
  const csrfToken = sessionStorage.getItem("X-XSRF-TOKEN");

  // Basic auth check for CSRF token
  if (!csrfToken) {
    return { 
      success: false, 
      error: "Not authenticated" 
    };
  }

  try {
    const response = await fetch(`${API.BASE}/${API.PROFILE}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
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
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || "Failed to get profile" 
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("fetchUserProfile error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

/**
 * Fetches the user's profile data using Axios.
 * 
 * @returns A result object containing either a success flag and data or an error message.
 */
export async function getUserProfileAxiosRequest() {
  const csrfToken = sessionStorage.getItem("X-XSRF-TOKEN");

  if (!csrfToken) {
    return { 
      success: false, 
      error: "Not authenticated" 
    };
  }

  try {
    const response = await axios.get(`${API.BASE}/${API.PROFILE}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
      }
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { 
          success: false, 
          error: "Authentication Error" 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to get profile" 
      };
    }
    
    console.error("fetchUserProfile error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

/**
 * Fetches the handshakes initiated by a user.
 * 
 * @param username - The username of the user whose initiated handshakes are being fetched.
 * @returns A result object containing either a success flag and data or an error message.
 */
export async function fetchInitiatedHandshakes(username: string) {
  const csrfToken = sessionStorage.getItem("X-XSRF-TOKEN");

  // Basic check if user is authenticated
  if (!csrfToken) {
    return { 
      success: false, 
      error: "Not authenticated" 
    };
  }

  try {
    const response = await fetch(`${API.BASE}/${API.GET_MY_INITIATED_HS}/${username}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
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
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || "Failed to get my initiated handshakes" 
      };
    }

    const rawData = await response.json();
    return { success: true, data: rawData.data };
  } catch (error) {
    console.error("fetchInitiatedHandshakes() error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

/**
 * Fetches the handshakes received by a user.
 * 
 * @param username - The username of the user whose received handshakes are being fetched.
 * @returns A result object containing either a success flag and data or an error message.
 */
export async function fetchReceivedHandshakes(username: string) {
  const csrfToken = sessionStorage.getItem("X-XSRF-TOKEN");

  // Basic check if user is authenticated
  if (!csrfToken) {
    return { 
      success: false, 
      error: "Not authenticated" 
    };
  }

  try {
    const response = await fetch(`${API.BASE}/${API.GET_MY_RECEIVED_HS}/${username}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
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
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || "Failed to get my received handshakes" 
      };
    }

    const rawData = await response.json();
    return { success: true, data: rawData.data };
  } catch (error) {
    console.error("fetchReceivedHandshakes() error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}


'use client'
/**
 * Handshake creation functions for making requests to the backend API
 * These functions handle handshake creation
 * and also provide error handling and CSRF token management.
 * 
 * @module handshakeService
 */

import { API, HandshakeFormSchema, HandshakeFormState } from './definitions';
import axios  from 'axios'

//******* HANDSHAKE CREATION *********//

/**
 * Sends a POST request to create a handshake using the `fetch` API.
 * 
 * @param handshakeName - The name of the handshake.
 * @param encryptedDetails - The encrypted details of the handshake.
 * @param receiverUsername - The username of the receiver.
 * @returns A promise that resolves to an object indicating success or failure, along with an optional error message.
 */
export async function createHandshakeFetchRequest(
  handshakeName: string,
  encryptedDetails: string,
  receiverUsername: string
) {

  // Retrieve the CSRF token from sessionStorage to protect against cross-site request forgery
  const csrfToken = sessionStorage.getItem("X-XSRF-TOKEN");

  try {
    // Perform a POST request to the API endpoint to create a handshake
    const response: Response = await fetch(`${API.BASE}/${API.CREATE_HANDSHAKE}`, {
      method: "POST", // HTTP method
      credentials: "include", // Include credentials (cookies) with the request
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
        "X-XSRF-TOKEN": csrfToken ?? "NO X-XSRF-TOKEN", // Include the CSRF token in the header
      },
      body: JSON.stringify({
        handshakeName, // Handshake name
        encryptedDetails, // Encrypted details of the handshake
        receiverUsername // Receiver's username
      })
    });

    // Check if the response is OK (status 200-299), otherwise handle the error
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Handshake creation failed:", errorData);
      return { success: false, error: errorData.message || "Handshake Creation failed" };
    }

    return { success: true }; // Return success if the handshake creation is successful
  } catch (err) {
    // Catch any error during the fetch request
    console.error("Handshake creation error:", err);
    return { success: false, error: "An error occurred while creating handshake" };
  }
}

/**
 * Sends a POST request to create a handshake using the `axios` library.
 * 
 * @param handshakeName - The name of the handshake.
 * @param encryptedDetails - The encrypted details of the handshake.
 * @param receiverUsername - The username of the receiver.
 * @returns A promise that resolves to an object indicating success or failure, along with an optional error message.
 */
export async function createHandshakeAxiosRequest(
  handshakeName: string,
  encryptedDetails: string,
  receiverUsername: string
) {
  // Retrieve the CSRF token from sessionStorage
  const csrfToken = sessionStorage.getItem("X-XSRF-TOKEN");
  console.log("[createHandshakeAxiosRequest] current X-XSRF-TOKEN: ", csrfToken);

  // If CSRF token is missing, return an error
  if (!csrfToken) {
    return { 
      success: false, 
      error: "Missing X-XSRF-token" 
    };
  }

  try {
    // Use axios to send a POST request to create the handshake
    await axios.post(
      `${API.BASE}/${API.CREATE_HANDSHAKE}`,
      {
        handshakeName, // Handshake name
        encryptedDetails, // Encrypted details
        receiverUsername // Receiver's username
      },
      {
        withCredentials: true, // Include credentials (cookies) with the request
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          "X-XSRF-TOKEN": csrfToken ?? "NO X-XSRF-TOKEN", // Include the CSRF token in the header
        }
      }
    );

    return { success: true }; // Return success if the handshake is created
  } catch (error) {
    // If an error occurs during the axios request, handle it
    if (axios.isAxiosError(error)) {
      console.error("Handshake creation failed:", error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.message || "Handshake Creation failed" 
      };
    }

    console.error("Handshake creation error:", error);
    return { 
      success: false, 
      error: "An error occurred while creating handshake" 
    };
  }
}

/**
 * Handles the entire handshake creation flow by validating the form data and making the appropriate request.
 * 
 * @param state - The current state of the handshake form.
 * @param formData - The form data submitted by the user.
 * @returns A promise that resolves to an object containing either the validation errors or success message.
 */
export async function createHandshake(state: HandshakeFormState, formData: FormData) {
  // Validate handshake fields according to the defined schema
  const validatedFields = HandshakeFormSchema.safeParse({
    handshakeName: formData.get("handshakeName"),
    encryptedDetails: formData.get("encryptedDetails"),
    receiverUsername: formData.get("receiverUsername")
  });

  // If validation fails, return the field validation errors to display in the form
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  };

  // Destructure validated data for further use
  const { handshakeName, receiverUsername, encryptedDetails } = validatedFields.data;

  // Call the fetch request function to create the handshake
  const result = await createHandshakeFetchRequest(
    handshakeName,
    encryptedDetails,
    receiverUsername
  );

  // If handshake creation fails, log the error and return a failure message
  if (!result.success) {
    console.log("failed to create handshake. error: ", result.error);
    return { message: result.error || "Error creating new handshake" };
  }

  // Return success if handshake creation was successful
  return { success: true };
}

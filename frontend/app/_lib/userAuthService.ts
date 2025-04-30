import { UserRegisterFormSchema, UserAuthFormState, API, LoginFormSchema } from './definitions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * User authentication and registration helper functions for making requests to the backend API
 * These functions handle user creation, login, and logout,
 * and also provide error handling and CSRF token management.
 * 
 * @module userAuthService
 */

/**
 * Sends a user registration request using `fetch`.
 * 
 * @param {string} email - The email address of the user.
 * @param {string} username - The username chosen by the user.
 * @param {string} password - The password chosen by the user.
 * 
 * @returns {Promise<{ success: boolean, error?: string }>} - The result of the registration attempt.
 */
export async function createUserFetchRequest(
  email: string,
  username: string,
  password: string
) {
  try {
    const response = await fetch(`${API.BASE}/${API.REGISTER}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Account creation failed. Please try again.",
      };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("createUserRequest error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred." 
    };
  }
}



/**
 * Registers a new user after validating form data using `UserRegisterFormSchema`.
 * 
 * @param {UserAuthFormState} state - The form state, containing the user's input.
 * @param {FormData} formData - The form data from the registration form.
 * 
 * @returns {Promise<{ success: boolean, errors?: any, message?: string }>} - The result of the registration attempt.
 */
export async function registerNewUser(state: UserAuthFormState, formData: FormData) {
  const validatedFields = UserRegisterFormSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!validatedFields.success) {
    console.log("userFormSchema errors: ")
    console.log(validatedFields.error.flatten().fieldErrors);
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username, email, password } = validatedFields.data;
  
  // const result = await createUserAxiosRequest(email, username, password);
  const result = await createUserFetchRequest(email, username, password);
  
  if (!result.success) {
    console.log("user registration failed");
    return { message: result.error };
  }

  console.log("User successfully created"); // FOR TESTING ONLY

  return { success: true }; 
}

//********** LOGIN FUNCTIONS *********************/

/**
 * Authenticates a user login request using `fetch`.
 * 
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * 
 * @returns {Promise<{ success: boolean, error?: string, data?: any }>} - The result of the login attempt.
 */
export async function loginFetchRequest(username: string, password: string) {
  try {
    const response = await fetch(`${API.BASE}/${API.LOGIN}`, {
      method: "POST",
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || "Failed to login" 
      };
    }

    // Extract CSRF Token from response headers
    const csrfToken = response.headers.get("x-csrf-token");
    if (csrfToken) {
      sessionStorage.setItem("X-XSRF-TOKEN", csrfToken);
      console.log("CSRF token stored:", csrfToken);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    console.error("authLoginDataRequest error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}



/**
 * Handles user login by validating form input and calling the login function.
 * 
 * @param {UserAuthFormState} state - The form state, containing the user's input.
 * @param {FormData} formData - The form data from the login form.
 * 
 * @returns {Promise<{ success: boolean, errors?: any, message?: string }>} - The result of the login attempt.
 */
export async function loginUser(state: UserAuthFormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username, password } = validatedFields.data;

  const result = await loginFetchRequest(username, password);

  if (!result.success) {
    return { message: result.error };
  }

  console.log("User successfully logged in"); // FOR TESTING ONLY

  return { success: true }; 
}

/**
 * Logs out the user by sending a logout request.
 * 
 * @returns {Promise<{ success: boolean, error?: string }>} - The result of the logout attempt.
 */
export async function logoutUserRequest() {
  const csrfToken = sessionStorage.getItem("X-XSRF-TOKEN");

  try {
    const response = await fetch(`${API.BASE}/${API.LOGOUT}`, {
      method: "POST",
      credentials: "include", // send cookies like jwtCookie, XSRF-TOKEN
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken ?? "", // send header value explicitly
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Logout failed:", errorData);
      return { success: false, error: errorData.message || "Logout failed" };
    }

    sessionStorage.clear();
    
    return { success: true };
  } catch (err) {
    console.error("Logout error:", err);
    return { success: false, error: "An error occurred while logging out" };
  }
}




/**
 * Custom hook to check if the user is authenticated based on sessionStorage.
 * If the user is not authenticated, they are redirected to the login page.
 * This hook checks for the existence of the X-XSRF-TOKEN in sessionStorage.
 * 
 * @returns {void} No return value.
 */
export function userAuthRedirect(): void {
  const router = useRouter();

  useEffect(() => {
    // Check for XSRF token in sessionStorage
    const xsrfToken = sessionStorage.getItem('X-XSRF-TOKEN');

    // If no XSRF token is found, redirect to the login page
    if (!xsrfToken) {
      router.push('/');
    }
  }, [router]); // Re-run the effect when the router changes
}
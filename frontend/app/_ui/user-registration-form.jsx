"use client";

import { registerNewUser } from "@/_lib/userAuthService"; // Import the registerNewUser function to handle user registration
import { useActionState } from "react"; // Import useActionState hook for managing state transitions
import { useEffect } from "react"; // Import useEffect hook to manage side effects
import { useRouter } from "next/navigation"; // Import useRouter hook to manage page navigation
import Link from 'next/link'; // Import Link component for navigation between pages

/**
 * UserRegistrationForm component for registering a new user.
 * 
 * This component handles the registration form, including username, email,
 * password, and confirm password fields, and displays success or error messages 
 * based on the registration outcome.
 *
 * @returns {JSX.Element}  The rendered user registration form component.
 */
export default function UserRegistrationForm() {
  const router = useRouter(); // Initialize the router for page redirection
  const [state, action, pending] = useActionState(registerNewUser, undefined); // Hook to manage action state

  /**
   * Effect to handle redirection after successful registration.
   * 
   * If registration is successful, the user is redirected to the home page
   * after a 2-second delay.
   */
  useEffect(() => {
    if (state?.success === true) {
      const timeout = setTimeout(() => {
        router.push("/"); // Redirect to the homepage
      }, 2000); // Wait 2 seconds before redirecting

      return () => clearTimeout(timeout); // Clear the timeout on component unmount
    }
  }, [state, router]); // Dependency on state and router

  return (
    <div className="p-4">
      {/* Registration success message */}
      {state?.success && (
        <div className="flex flex-col justify-center align-center">
          <p className="text-primary font-bold text-md mb-2">
            Registration successful! Redirecting to login...
          </p>
          <p className="italic text-neutral text-xs">
              Not redirected?{" "}
              <Link href="/"
                className="text-primary hover:text-primary-dark not-italic font-bold"
                aria-label="Log in to your account"
              >Click to log in</Link>
          </p>
        </div>
      )}

      {/* Registration form if registration is not successful */}
      {!state?.success && (
        <div>
          <div className="flex flex-col items-center">
            <h1 className="text-primary text-2xl font-bold">
              Create new account
            </h1>

            {/* Prompt to redirect to login page if the user already has an account */}
            <p className="italic text-neutral text-xs">
              already have an account?{" "}
              <Link href="/"
                className="text-primary hover:text-primary-dark not-italic font-bold"
                aria-label="Log in to your account"
              >Log in</Link>
            </p>
          </div>

          {/* Form to collect user data */}
          <form action={action} className="bg-white px-8 pt-6 pb-8 mb-4">

            {/* Username field */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                id="username"
                name="username"
                required
              />
              {/* Username error message */}
              {state?.errors?.username && (
                <p className="text-warning italic mt-1">{state.errors.username}</p>
              )}
            </div>

            {/* Email field */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                id="email"
                name="email"
                required
              />
              {/* Email error message */}
              {state?.errors?.email && (
                <p className="text-warning italic mt-1">{state.errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                id="password"
                name="password"
                type="password"
                required
              />
              {/* Password error messages */}
              {state?.errors?.password && (
                <div className="mt-1">
                  <p className="text-warning italic">Password must:</p>
                  <ul className="text-sm italic">
                    {state.errors.password.map((error) => (
                      <li key={error}>- {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
              {/* Confirm Password error message */}
              {state?.errors?.confirmPassword && (
                <p className="text-warning italic mt-1">{state.errors.confirmPassword}</p>
              )}
            </div>

            {/* Registration failure error message */}
            <div className="flex justify-center">
              {state?.message && (
                <p className="text-warning font-bold text-sm mb-4">
                  {state.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                className="w-full bg-primary text-white py-4 px-4 font-bold text-sm rounded cursor-pointer focus:outline-none focus:shadow-outline hover:bg-primary-dark"
                disabled={pending}
                type="submit"
              >
                {pending ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

'use client';

import { logoutUserRequest } from '@/_lib/userAuthService';
import { useTransition, useState } from 'react';
import { LogOut } from 'lucide-react';

/**
 * LogoutButton component
 *
 * A button to log the user out of the application. Upon logout, it clears session storage, deletes cookies, 
 * and redirects the user to the homepage. If the logout request fails, an error message is displayed.
 *
 * @returns {JSX.Element} The button for logging out with a loading state and potential error message.
 */

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const [hasError, setHasError] = useState(false);

  /**
   * handleLogout function
   * 
   * This function handles the process of logging the user out. It sends a request to the logout API, 
   * clears session storage and cookies, and then redirects the user to the homepage. If there is an 
   * error during the logout process, an error message is displayed.
   */
  const handleLogout = async () => {
    setHasError(false);

    const { success, error } = await logoutUserRequest();

    if (success) {
      // Clear session storage and cookies
      sessionStorage.clear()
      document.cookie.split(';').forEach(c => {
        document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
      });

      // Transition to the homepage
      startTransition(() => {
        window.location.href = '/';
      });
    } else {
      setHasError(true);
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="w-full flex items-center justify-center md:justify-start gap-2 p-2 text-white bg-primary hover:bg-warning transition-colors text-sm font-semibold disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        <span>{isPending ? 'Logging out...' : 'Log Out'}</span>
      </button>

      {hasError && (
        <p className="text-warning text-sm text-center mt-2">
          Logout failed. Please try again.
        </p>
      )}
    </div>
  );
}

'use client'

/**
 * CreateNewAccountButton component
 *
 * This button navigates the user to the "/register" page when clicked.
 * It is styled with a primary border and changes colors on hover.
 *
 * @returns {JSX.Element} A button that navigates to the account creation page.
 */


import { useRouter } from 'next/navigation';

export default function CreateNewAccountButton() {
  const router = useRouter();
   
  return (
    <div className="w-full max-w-xs">
      <div className="px-8">  {/* Add padding to match the form padding */}
        <button
          onClick={() => router.push("/register")}
          className="w-full bg-white border-solid border-primary border-2 text-primary py-4 px-4 font-bold text-sm rounded cursor-pointer focus:outline-none focus:shadow-outline hover:bg-primary-dark hover:border-primary-dark hover:text-white"
          aria-label="Create a new account"
          >
          Create New Account
        </button>
      </div>
    </div>
  );
}
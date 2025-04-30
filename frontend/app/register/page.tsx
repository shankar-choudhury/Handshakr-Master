import Image from 'next/image';
import UserRegistrationForm from '@/_ui/user-registration-form';

/**
 * Renders the user registration page.
 * 
 * Displays the Handshakr banner and the user registration form
 * within a styled container.
 * 
 * @returns The registration page layout component.
 */
export default function Page() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <div className="w-full max-w-xs bg-white rounded-lg shadow-md overflow-hidden mt-10">
        <Image
          src="/handshakr-banner.png"
          width={1153}
          height={370}
          alt="handshakr banner"
          className="w-full h-auto"
        />
        <UserRegistrationForm />
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './nav-links';
import LogoutButton from './logout-button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

/**
 * `SideNav` component renders the sidebar navigation layout used throughout the app.
 * 
 * - Includes branding/logo for both desktop and mobile views.
 * - Shows a hamburger menu toggle on smaller screens.
 * - Renders navigation links and a logout button.
 *
 * @returns {JSX.Element}  The rendered sidebar navigation component.
 */
export default function SideNav() {
  const router = useRouter(); // For potential navigation control
  const [menuOpen, setMenuOpen] = useState(false); // Controls mobile menu toggle state

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo area with mobile and desktop variants */}
      <div className="flex items-center justify-between p-4 md:h-40">
        <Link href="/dashboard">
          {/* Desktop logo (hidden on small screens) */}
          <Image
            src="/hs_icon.png"
            width={1250}
            height={625}
            alt="handshake desktop logo"
            className="hidden md:block object-scale-down h-10 md:h-20"
          />

          {/* Mobile logo (hidden on medium and larger screens) */}
          <Image
            src="/handshakr-banner.png"
            width={1600}
            height={512}
            alt="handshake mobile logo"
            className="block md:hidden object-scale-down h-10"
          />
        </Link>

        {/* Hamburger menu toggle (visible only on small screens) */}
        <button
          className="md:hidden text-neutral-dark focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation links - collapsible on mobile */}
      <div
        className={`flex-col space-y-2 px-4 md:flex md:flex-grow md:space-y-2 md:px-0 ${
          menuOpen ? 'flex' : 'hidden'
        }`}
      >
        {/* NavLinks component with click handler to close menu on navigation (mobile) */}
        <NavLinks clickHandler={() => setMenuOpen(false)} />

        {/* Empty growable space to push LogoutButton to bottom on desktop */}
        <div className="hidden h-auto w-full grow md:block"></div>

        {/* Logout button */}
        <LogoutButton />
      </div>
    </div>
  );
}

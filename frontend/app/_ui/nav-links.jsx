'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Handshake,
  ArrowRightFromLine,
  ArrowLeftFromLine,
  GalleryVerticalEnd,
  BadgeDollarSign
} from 'lucide-react';

/**
 * List of navigation links used in the side navigation bar.
 */
const links = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Handshake', href: '/create', icon: Handshake },
  { name: 'Initiated Handshakes', href: '/initiated-handshakes', icon: ArrowRightFromLine },
  { name: 'Received Handshakes', href: '/received-handshakes', icon: ArrowLeftFromLine },
  { name: 'History', href: '/history', icon: GalleryVerticalEnd },
  { name: 'Price Analyzer', href: '/price-analyzer', icon: BadgeDollarSign },
];

/**
 * NavLinks component
 *
 * Renders navigation links with icons, highlighting the active route.
 *
 * @param {Object} props - Component props
 * @param {Function} [props.clickHandler] - Optional function to call when a link is clicked (e.g. to close mobile nav)
 * @returns {JSX.Element} Navigation links
 */
export default function NavLinks({ clickHandler }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={clickHandler}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 text-sm font-medium hover:bg-blue-100 md:flex-none md:justify-start md:p-2 md:px-3',
              { 'bg-primary-light': isActive }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="block pl-1 md:pl-5">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

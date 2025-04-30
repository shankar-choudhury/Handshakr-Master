/**
 * NavButton component
 *
 * Renders a clickable navigation link.
 *
 * @param {Object} linkData - The data for the navigation link
 * @param {string} linkData.pathName - The path the link should navigate to
 * @param {string} linkData.linkName - The name displayed for the link
 * @returns {JSX.Element} A navigation button
 */
export default function NavButton({ linkData }) {
    return (
      <Link href={linkData.pathName}>
        {linkData.linkName}
      </Link>
    );
  }
  
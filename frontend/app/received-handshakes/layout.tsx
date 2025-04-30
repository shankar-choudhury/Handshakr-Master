import SideNav from '@/_ui/sidenav';

/**
 * Layout component for the main app layout.
 * 
 * Displays a sidebar navigation (`SideNav`) on larger screens and renders the
 * provided children content in a flex container.
 * 
 * @param children - The content to render within the main area, typically a page.
 * @returns A layout component that includes the side navigation and main content area.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

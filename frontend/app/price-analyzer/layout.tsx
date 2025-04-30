import SideNav from '@/_ui/sidenav';

/**
 * Layout component for the app's main structure.
 * 
 * Displays a sidebar navigation (`SideNav`) on larger screens and renders the 
 * provided `children` content in a flexible main content area.
 * 
 * This layout component is designed for a responsive layout that switches 
 * from a single-column layout on smaller screens to a two-column layout 
 * with a sidebar on larger screens.
 * 
 * @param children - The content to be rendered within the main content area.
 * @returns A layout component that includes the sidebar and main content area.
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

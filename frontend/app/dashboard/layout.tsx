import SideNav from '../_ui/sidenav';

/**
 * Layout component that wraps the main content area with a sidebar navigation.
 * 
 * This component provides a responsive layout where the sidebar (`SideNav`) is visible
 * on larger screens and the main content area is displayed flexibly with padding. 
 * On smaller screens, the layout switches to a single-column design.
 * 
 * @param children - The content to be rendered inside the main content area.
 * @returns A layout component containing a sidebar and a dynamic content area.
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
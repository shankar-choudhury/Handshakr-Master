/**
 * Register page layout component.
 * 
 * Wraps pages  with a centered layout
 * that fills the viewport height.
 *
 * @param children - The page content to render inside the layout.
 * @returns A layout container with centered children.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen">
        <main className="flex justify-center items-center">
          {children}
        </main>
      </div>
    </>
  );
}

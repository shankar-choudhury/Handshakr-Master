import type { Metadata } from "next";
import "./globals.css";

/**
 * Global metadata for the Handshakr application.
 * 
 * Used by Next.js to populate the document `<head>`.
 */
export const metadata: Metadata = {
  title: "Handshakr",
  description: "Handshakr, the secure handshake agreement app",
};

/**
 * Root layout component that wraps all pages.
 * 
 * This layout is applied to every page of the app and includes global styles.
 * 
 * @param children - The content to render within the layout.
 * @returns The HTML structure containing the application's body and children.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="appearance-none">
        {children}
      </body>
    </html>
  );
}

// client/src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "MeetMind - Your AI Meeting Copilot",
  description: "A complete AI-powered meeting copilot.",
};

// The typo was in the type definition for 'children'. This is the corrected version.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
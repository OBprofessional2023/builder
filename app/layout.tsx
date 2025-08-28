import './globals.css';
import { Suspense } from 'react';
import RootSidebar from './RootSidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Suspense fallback={<div className="w-64 bg-gray-800" />}>
          <RootSidebar />
        </Suspense>
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </body>
    </html>
  );
}

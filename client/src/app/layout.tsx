import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { TRPCProvider } from '@/components/trpc-provider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Analytics dashboard with interactive charts and data visualization',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <TRPCProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </TRPCProvider>
      </body>
    </html>
  );
}

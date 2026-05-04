import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SolanaWalletProvider from '@/providers/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SolSense — Smart Wallet Intelligence',
  description: 'Real-time Solana portfolio analytics powered by Birdeye & Solflare',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { GlobalProvider } from '@/context/GlobalContext';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Software Portfolio Tracker',
  description: 'Track and manage software used by the City Of Rocky Mount',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}

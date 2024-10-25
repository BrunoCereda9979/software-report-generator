import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { GlobalProvider } from '@/context/GlobalContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Enhanced Software Dashboard',
  description: 'Track and manage software used by the company',
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
          </ThemeProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}

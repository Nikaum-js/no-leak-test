import { AppProps } from 'next/app';
import { Inter as FontSans } from 'next/font/google';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

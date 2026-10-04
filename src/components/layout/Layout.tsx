import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTopButton from './BackToTopButton';
import WhatsAppButton from './WhatsAppButton';
import ScrollProgressBar from './ScrollProgressBar';
import ScrollToTop from './ScrollToTop';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink-900/60">
      <ScrollProgressBar />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <BackToTopButton />
      <WhatsAppButton />
    </div>
  );
}

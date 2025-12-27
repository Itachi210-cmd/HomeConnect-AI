import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter } from 'next/font/google';
import './globals.css';
import { PropertyProvider } from '@/context/PropertyContext';
import { LeadProvider } from '@/context/LeadContext';
import { ThemeProvider } from "@/context/ThemeContext";
import AIChatbot from "@/components/AIChatbot";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HomeConnect - Real Estate CRM',
  description: 'Find your dream home or manage your real estate business.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <PropertyProvider>
            <LeadProvider>
              <Providers>
                <Navbar />
                <main style={{ flex: 1 }}>
                  {children}
                  <AIChatbot />
                </main>
                <Footer />
              </Providers>
            </LeadProvider>
          </PropertyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

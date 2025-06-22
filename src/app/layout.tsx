// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/Sidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner'; // 1. IMPORTE O TOASTER

const fontSans = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans', 
});

export const metadata: Metadata = {
  title: 'OftalmoGest',
  description: 'Sistema de Gestão para Clínicas Oftalmológicas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-muted/40 font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid min-h-screen w-full md:grid-cols-[80px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
              <AppHeader />
              <main className="flex-1 p-6">
                {children}
              </main>
            </div>
          </div>
          
          {/* 2. ADICIONE O TOASTER AQUI */}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
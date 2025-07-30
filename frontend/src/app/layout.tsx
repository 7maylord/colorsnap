import type { Metadata } from "next";
import { headers } from 'next/headers'
import './globals.css';
import ContextProvider from '@/context'
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "ColorSnap - Somnia Color Matching Game",
  description: "A fun and interactive color bottle matching game built on Somnia blockchain",
  keywords: ["Somnia", "blockchain", "game", "DApp", "Cairo", "Web3"],
  authors: [{ name: "ColorSnap Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    <html lang="en" data-theme="light">
        <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-gray-50 to-somnia-50`}>
        <ContextProvider cookies={cookies}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-gray-100 border-t border-gray-200 py-2">
              <div className="container mx-auto px-4 text-center text-sm text-gray-600">
                <p>
                  Built with ❤️ on{" "}
                  <a 
                    href="https://testnet.somnia.network/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-somnia-600 hover:text-somnia-700 font-medium"
                  >
                    Somnia
                  </a>
                  {" | "}
                  <a 
                    href="https://github.com/7maylord/colorsnap" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-somnia-600 hover:text-somnia-700 font-medium"
                  >
                    GitHub
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </ContextProvider>
      </body>
    </html>
  );
}

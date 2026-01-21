import type { Metadata } from "next";
import {Inter, Roboto } from "next/font/google";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BMI Calculator",
  description: "An app to calculate Body Mass Index",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  const handleHydrationMismatch = () => {
                    const body = document.body;
                    if (body && body.hasAttribute('cz-shortcut-listen')) {
                      body.removeAttribute('cz-shortcut-listen');
                    }
                  };

                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', handleHydrationMismatch);
                  } else {
                    handleHydrationMismatch();
                  }
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

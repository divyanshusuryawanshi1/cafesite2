import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saffron & Spice | Premium Indian Café',
  description: 'Authentic Indian flavors in a modern, cozy setting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

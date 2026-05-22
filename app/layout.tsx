import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planexa - Planification de rendez-vous",
  description: "Planifiez vos rendez-vous facilement avec Planexa, un outil de planification en français.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

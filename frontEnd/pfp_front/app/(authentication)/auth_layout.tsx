import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "authentication page",
  description: "This is an authentication page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}

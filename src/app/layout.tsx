import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nitin Jangid | Full Stack Engineer",
  description: "Personal portfolio of Nitin Jangid, Full Stack Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body
        className={`${firaCode.variable} font-mono antialiased bg-black text-white selection:bg-green-500/30 selection:text-green-200`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { UIProvider } from "../lib/context";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AI-HRMS - Enterprise Human Resource Management System",
  description: "Next-generation Human Resource Management Platform powered by Local LLMs, LangGraph workflows, and advanced enterprise analytics.",
  keywords: ["HRMS", "Human Resources", "AI HR Assistant", "Employee Directory", "Attendance Tracking", "Payroll Management"],
  authors: [{ name: "AI-HRMS Engineering Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-background font-sans antialiased text-foreground`}
        id="hrms-root-body"
      >
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}

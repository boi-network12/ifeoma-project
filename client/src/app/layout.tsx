import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Acadex | Student Result Management System",
    template: "%s | Acadex",
  },
  description:
    "Acadex is a web-based student result processing and management system that helps educational institutions manage student records, process academic results, and generate reports.",
  applicationName: "Acadex",
  authors: [{ name: "Ifeoma" }],
  creator: "Ifeoma",
  publisher: "Ifeoma",
  keywords: [
    "Acadex",
    "Student Result Processing",
    "Student Result Management",
    "Academic Records",
    "Educational Management",
  ],
  category: "Education",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <UserProvider>
          <main className="flex-1">{children}</main>
        </UserProvider>
        <footer className="py-4 text-center text-sm text-muted">
          Powered by Ifeoma
        </footer>
      </body>
    </html>
  );
}
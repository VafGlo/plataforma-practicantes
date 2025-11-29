import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata = {
  title: "PracticeHub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

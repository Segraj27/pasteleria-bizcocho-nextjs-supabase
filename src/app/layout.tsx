import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import "@/styles/custom.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Playfair_Display, Poppins } from "next/font/google";
import { CartProvider } from "@/context/CartContext";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['800'], // Usamos 800 para que sea bien gruesa como  ejemplo
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Pastelería El Bizcocho",
  description: "Sistema de pedidos de pasteles personalizados",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={jakarta.className}>
        <CartProvider>
          <Navbar />
          <main className="container min-vh-100">
            {children}
          </main>
          <Footer />
        </CartProvider>

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

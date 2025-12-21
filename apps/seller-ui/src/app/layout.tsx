import "./global.css";
import { Poppins, Roboto } from "next/font/google";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Jibruk E-Shop",
  description: "Jibruk E-Shop",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable}`}>
        <Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2000,
            }}
          />

          {children}
        </Providers>
      </body>
    </html>
  );
}

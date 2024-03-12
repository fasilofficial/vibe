import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "../providers/AuthProvider";
import StoreProvider from "../providers/StoreProvider";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@/providers/SocketProvider";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "VIBE",
  description: "Vibe social media app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <StoreProvider>
          <SocketProvider>
            <body
              className={`${poppins.className} dark:bg-gray-900 dark:text-white bg-gray-100 text-gray-900`}
            >
              <Toaster />
              <div>{children}</div>
            </body>
          </SocketProvider>
        </StoreProvider>
      </AuthProvider>
    </html>
  );
}

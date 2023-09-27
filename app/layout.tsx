import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import clsx from "clsx";
import "@fortawesome/fontawesome-svg-core/styles.css";




export default function RootLayout({
  
  children,
}: {
  children: React.ReactNode;
  }) {
    const googleAPIKey = process.env.GOOGLE_MAP_API_KEY;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(cal.variable, inter.variable)}>
        
        <Providers>
        <script src={googleAPIKey} async />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}

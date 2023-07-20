import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import clsx from "clsx";

// export const metadata: Metadata = {
//   title: "ForHosts",
//   description:
//     "Create a dynamic website for your customers looking to book your properties!",
//   icons: ["logo.png"],
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en" suppressHydrationWarning>
    //   <body className={clsx(cal.variable, inter.variable)}>
    <Providers>
      {children}
      <Analytics />
    </Providers>
    //   </body>
    // </html>
  );
}

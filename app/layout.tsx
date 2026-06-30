import { Toaster } from "sonner";
import Script from "next/script";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nanyAi",
  description: "Platform bertenaga AI untuk persiapan wawancara kerja",
  icons: {
    icon: "/logo-nnyai.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          id="cleanup-ext-attrs"
          strategy="beforeInteractive"
        >{`(function(){
            var attrs = ['bis_skin_checked', 'bis_register'];
            document.querySelectorAll(attrs.map(function(a){return '['+a+']'}).join(',')).forEach(function(el){
              attrs.forEach(function(a){el.removeAttribute(a)});
            });
            var observer = new MutationObserver(function(mutations){
              mutations.forEach(function(m){
                if(m.type==='attributes' && attrs.indexOf(m.attributeName)!==-1){
                  m.target.removeAttribute(m.attributeName);
                }
              });
            });
            observer.observe(document.documentElement, {attributes:true, subtree:true, attributeFilter:attrs});
          })()`}</Script>
      </head>
      <body className={`${monaSans.className} antialiased pattern`} suppressHydrationWarning>
        {children}

        <Toaster />
      </body>
    </html>
  );
}

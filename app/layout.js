import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/globals.scss";
import "./css/premium.scss";
import "./css/elevated.scss";

export const metadata = {
  title: "Aman Kumar — Full Stack Developer",
  description:
    "Explore Aman Kumar's full stack development portfolio: responsive interfaces, research tools, and practical web applications built with React, Next.js, Node.js, and SQL.",
  applicationName: "Aman Kumar Portfolio",
  authors: [{ name: "Aman Kumar" }],
  openGraph: {
    title: "Aman Kumar | Full Stack Developer",
    description: "Thoughtful code. Meaningful digital experiences. Explore my work and let's build something together.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Aman Kumar | Full Stack Developer",
    description: "Web applications built with purpose and crafted with care.",
  },
};

export default function RootLayout({ children }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM;

  return (
    <html lang="en">
      <body>
        <noscript><style>{".motion-reveal,.cinematic-copy>*,.headline-line>span,.portrait-stage{opacity:1!important;transform:none!important}"}</style></noscript>
        {gtmId ? (
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        ) : null}
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}

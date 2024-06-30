import "./global.css";

import AuthProvider from "../components/AuthProvider";

export const metadata = {
  title: "TRACK",
  description:
    "Track is a Web Application to make attendance tracking in organisations easy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <head>
          <link rel="icon" href="/T.png" type="image/png" />
        </head>
        <body style={{ backgroundColor: "#E6F3F3" }}>{children}</body>
      </AuthProvider>
    </html>
  );
}

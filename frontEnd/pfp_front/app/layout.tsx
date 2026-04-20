import "@/styles/global.css"
import "leaflet/dist/leaflet.css"
import { html } from "motion/react-client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
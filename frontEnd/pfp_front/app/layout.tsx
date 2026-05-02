import "@/styles/global.css"
import "leaflet/dist/leaflet.css"
import { html } from "motion/react-client";
import { NavigationLoaderProvider } from "@/lib/navigation-loader-context"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <html>
      <body>
        <NavigationLoaderProvider>
          {children}
        </NavigationLoaderProvider>
      </body>
    </html>
  )
}
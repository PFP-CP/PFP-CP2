'use client'
import ComputerNav from "@/components/navs/computer_nav";
import Mobile_nav from "@/components/navs/mobile_nav";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import { useMediaQuery } from "@mui/material";
import { usePathname } from "next/navigation";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname()
  const isPost = path.startsWith('/post')

  const computer_nav = useMediaQuery('(min-width:1100px)')
  const mobile_nav_and_post = useMediaQuery('(min-width:700px) and (max-width:1100px)')
  const mobile_nav_no_post = useMediaQuery('(max-width:1100px)')

  return (
    <>
      {computer_nav && <ComputerNav/>}
      { isPost && mobile_nav_and_post && <Mobile_nav/>}
      { !isPost && mobile_nav_no_post && <Mobile_nav/>}
      <EmailVerificationBanner />
      {children}
    </>
  );
}

'use client'
import ComputerNav from "@/components/navs/computer_nav";
import Mobile_nav from "@/components/navs/mobile_nav";
import { usePathname } from "next/navigation";
import { useState,useEffect } from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const isPost = path.startsWith('/post')
  
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
      useEffect(()=>{
        setScreenWidth(window.innerWidth);
        let timeId : NodeJS.Timeout | null = null;;
        const handleResize = ()=> {
          
          if(timeId) return;
    
          timeId =  setTimeout(()=>{
            setScreenWidth(window.innerWidth);
            timeId = null;
    
          },300)
        }
        window.addEventListener('resize', handleResize);
        return ()=> {
          removeEventListener('resize', handleResize);
          if(timeId) clearTimeout(timeId);
        }
      },[])

  console.log(isPost)
  return (
    <>  
      {screenWidth>=1100 && <ComputerNav/>}
      {screenWidth>=700&& screenWidth<1100 && <Mobile_nav/>}
      {children}    
    </>
  );
}

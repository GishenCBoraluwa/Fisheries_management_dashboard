import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { ThemeProvider } from "../theme-provider"
import NavBar from "./Navbar"

interface MainLayoutProps {
  children: React.ReactNode;
  pageName?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  pageName,
}) => {
  return (
    // <div className="w-screen h-screen overflow-hidden">
    //   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    //   <SidebarProvider>
    //   <AppSidebar />
    //   <main>
    //     <SidebarTrigger className="m-0"/>
    //     {children}
    //   </main>
    // </SidebarProvider>
    // </ThemeProvider>
    // </div>
    <html lang="en">
      <body className="w-screen h-screen overflow-hidden antialiased flex ">
        <div className="w-screen h-screen">
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger className="m-0"/>
              {children}
            </main>
            </SidebarProvider>
          </ThemeProvider>
        </div>
      </body> 
    </html>
    

  )
}

export default MainLayout
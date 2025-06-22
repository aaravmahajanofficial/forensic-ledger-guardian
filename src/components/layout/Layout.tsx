import React, { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion as m, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on mobile devices
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const mainVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar collapsed={sidebarCollapsed} toggleCollapsed={toggleSidebar} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <AnimatePresence mode="wait">
          <m.main
            key={window.location.pathname} // Re-trigger animation on route change
            initial="initial"
            animate="animate"
            exit="exit"
            variants={mainVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 overflow-y-auto p-6 md:p-8"
          >
            <div className="max-w-full mx-auto space-y-6">{children}</div>
          </m.main>
        </AnimatePresence>

        <m.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-card border-t border-border py-4 px-6 text-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center max-w-full mx-auto">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">
                Forensic Ledger Guardian
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Forensic Ledger Guardian. All rights
              reserved.
            </div>
          </div>
        </m.footer>
      </div>
    </div>
  );
};

export default Layout;

import { Menu } from "lucide-react";
import { ThemeSwitcher } from "../theme/theme-switcher";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";

const MobileNav = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-4 mx-auto my-2">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </Button>

          <Logo />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default MobileNav;

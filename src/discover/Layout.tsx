import { Outlet } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

interface LayoutProps {
  isLoggedIn: boolean;
}

export function Layout({ isLoggedIn }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory-50">
      <Nav isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
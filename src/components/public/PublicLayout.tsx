import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-site">
      <Header />
      <main id="main" className="route-shell">{children}</main>
      <Footer />
    </div>
  );
}

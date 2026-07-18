import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="route-shell">{children}</main>
      <Footer />
    </>
  );
}

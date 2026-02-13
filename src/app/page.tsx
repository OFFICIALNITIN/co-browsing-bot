
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WindowsDesktop from '../components/WindowsDesktop';
import Contact from '../components/Contact';
import CoBrowsingWidget from '../components/CoBrowsingWidget';
import Background3D from '../components/Background3D';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-green-500/30 selection:text-green-200">
      <Background3D />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <WindowsDesktop />
          <Contact />
        </main>

        <footer className="border-t border-white/10 py-8 text-center text-sm text-neutral-500 bg-black font-mono">
          <p>© {new Date().getFullYear()} Nitin Jangid. All rights reserved.</p>
        </footer>

        <CoBrowsingWidget />
      </div>
    </div>
  );
}

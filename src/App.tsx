import { Suspense } from 'react';
import HeroScene from './components/HeroScene';
import GalleryScene from './components/GalleryScene';
import TimelineScene from './components/TimelineScene';
import OptimizedScene from './components/OptimizedScene';

function App() {
  return (
    <main className="w-full min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white">
      <Suspense fallback={<div className="flex items-center justify-center h-screen bg-black text-white font-black italic tracking-tighter">INITIALIZING LEGACY...</div>}>
        <section id="hero"><HeroScene /></section>
        <section id="gallery"><GalleryScene /></section>
        <section id="timeline"><TimelineScene /></section>
        <section id="core"><OptimizedScene /></section>
      </Suspense>

      {/* Overlay UI or Navbar could go here */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-bold tracking-tighter">CR7 LEGACY</div>
        <div className="flex gap-4 text-xs font-black tracking-[0.2em]">
          <a href="#hero" className="hover:text-pink-500 transition-colors uppercase">Hero</a>
          <a href="#gallery" className="hover:text-pink-500 transition-colors uppercase">Gallery</a>
          <a href="#timeline" className="hover:text-pink-500 transition-colors uppercase">Timeline</a>
          <a href="#core" className="hover:text-pink-500 transition-colors uppercase">Core</a>
        </div>
      </nav>
    </main>
  );
}

export default App;


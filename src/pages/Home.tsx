import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Process from '@/components/Process';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <Features />
        <Process />
      </main>
      <Footer />
    </div>
  );
}

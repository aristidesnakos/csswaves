import Header from '@/components/Header';
import Hero from '@/components/Hero';
import GradientBackground from '@/components/Gradient/GradientBackground';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
        <Header />
        <Hero />
        <GradientBackground theme="dark" />
      <Footer />
    </>
  );
}
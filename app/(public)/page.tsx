import styles from './page.module.css';
import Hero from '@/components/home/Hero';
import Story from '@/components/home/Story';
import MenuSection from '@/components/home/MenuSection';
import Gallery from '@/components/home/Gallery';
import ContactSection from '@/components/home/ContactSection';
import RevealWrapper from '@/components/ui/RevealWrapper';

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <RevealWrapper>
        <Story />
      </RevealWrapper>
      <RevealWrapper>
        <MenuSection />
      </RevealWrapper>
      <RevealWrapper>
        <Gallery />
      </RevealWrapper>
      <RevealWrapper>
        <ContactSection />
      </RevealWrapper>
    </main>
  );
}

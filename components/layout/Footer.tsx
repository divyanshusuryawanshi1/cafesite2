import Link from 'next/link';
import { FacebookLogo, InstagramLogo, TwitterLogo } from '@phosphor-icons/react/dist/ssr';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo}>Saffron & Spice</Link>
                    <p className={styles.tagline}>Authentic flavors, timeless memories.</p>
                </div>

                <div className={styles.links}>
                    <div className={styles.column}>
                        <h4>Explore</h4>
                        <ul>
                            <li><Link href="#story">Our Story</Link></li>
                            <li><Link href="#menu">Menu</Link></li>
                            <li><Link href="#gallery">Gallery</Link></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h4>Legal</h4>
                        <ul>
                            <li><Link href="#">Privacy Policy</Link></li>
                            <li><Link href="#">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.social}>
                    <Link href="#"><InstagramLogo size={24} /></Link>
                    <Link href="#"><FacebookLogo size={24} /></Link>
                    <Link href="#"><TwitterLogo size={24} /></Link>
                </div>
            </div>
            <div className={styles.copyright}>
                &copy; {new Date().getFullYear()} Saffron & Spice. All rights reserved.
            </div>
        </footer>
    );
}

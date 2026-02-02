'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { List, X, ShoppingCart } from '@phosphor-icons/react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Saffron & Spice
                </Link>

                {/* Desktop Menu */}
                <ul className={styles.desktopMenu}>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="#story">Our Story</Link></li>
                    <li><Link href="#menu">Menu</Link></li>
                    <li><Link href="#gallery">Gallery</Link></li>
                    <li><Link href="#contact">Contact</Link></li>
                </ul>

                <div className={styles.actions}>
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X size={28} /> : <List size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
                <button
                    className={styles.closeMenuBtn}
                    onClick={() => setIsOpen(false)}
                >
                    <X size={32} />
                </button>
                <ul>
                    <li><Link href="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li><Link href="#story" onClick={() => setIsOpen(false)}>Our Story</Link></li>
                    <li><Link href="#menu" onClick={() => setIsOpen(false)}>Menu</Link></li>
                    <li><Link href="#gallery" onClick={() => setIsOpen(false)}>Gallery</Link></li>
                    <li><Link href="#contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
                </ul>
            </div>
        </nav>
    );
}

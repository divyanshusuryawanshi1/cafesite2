'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.bgContainer}>
                <Image
                    src="/cafe_hero_new.png"
                    alt="Luxury Cafe Interior"
                    fill
                    priority
                    className={styles.bgImage}
                    onLoad={() => setLoaded(true)}
                />
                <div className={styles.overlay} />
            </div>

            <div className={`${styles.content} ${loaded ? styles.visible : ''}`}>
                <div className={styles.badge}>Est. 2024 • Mumbai</div>
                <h1 className={styles.headline}>
                    <span className={styles.line1}>Culinary</span>
                    <span className={styles.line2}>Artistry</span>
                </h1>
                <div className={styles.separator} />
                <p className={styles.subtext}>
                    Where heritage meets modern luxury. Experience the finest Indian fusion cuisine in a setting designed for the soul.
                </p>
                <div className={styles.ctaWrapper}>
                    <a href="#menu" className={styles.secondaryBtn}>Explore Menu</a>
                </div>
            </div>
        </section>
    );
}

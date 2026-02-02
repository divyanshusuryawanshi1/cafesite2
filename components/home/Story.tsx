'use client';

import Image from 'next/image';
import styles from './Story.module.css';

export default function Story() {
    return (
        <section className={styles.story} id="story">
            <div className={styles.container}>
                <div className={styles.colText}>
                    <span className={styles.eyebrow}>Our Philosophy</span>
                    <h2 className={styles.heading}>Rooted in Tradition,<br />Brewed for Today</h2>
                    <p className={styles.text}>
                        At Saffron & Spice, we believe that food is more than just sustenance—it’s a memory, a culture, and a love language.
                        Born from the bustling streets of Mumbai and refined for the modern palate, our menu celebrates the authentic flavors of India.
                    </p>
                    <p className={styles.text}>
                        We source our spices directly from heritage farms in Kerala and grind them fresh daily.
                        Whether it's the warmth of our Masala Chai or the zest of our Chaat, every bite tells a story.
                    </p>
                    <div className={styles.signature}>
                        <p className={styles.sigName}>Aarav & Diya</p>
                        <p className={styles.sigTitle}>Founders</p>
                    </div>
                </div>

                <div className={styles.colImage}>
                    <div className={styles.imgWrapperMain}>
                        <Image
                            src="/cafe_story_img.png"
                            alt="Spices and Chai"
                            width={600}
                            height={800}
                            className={styles.mainImg}
                        />
                    </div>
                    {/* Decorative element could go here */}
                </div>
            </div>
        </section>
    );
}

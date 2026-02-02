'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import styles from './Gallery.module.css';

const DEFAULT_IMAGES = [
    { src: '/cafe_gallery_1.png', alt: 'Street Food' },
    { src: '/cafe_gallery_2.png', alt: 'Latte Art' },
    { src: '/cafe_food_1.png', alt: 'Pani Puri' },
    { src: '/cafe_food_2.png', alt: 'Butter Chicken' },
    { src: '/cafe_interior_1.png', alt: 'Reading Corner' },
    { src: '/cafe_hero_bg.png', alt: 'Ambiance' },
];

export default function Gallery() {
    const [images, setImages] = useState<{ src: string; alt: string }[]>(DEFAULT_IMAGES);

    useEffect(() => {
        async function fetchGallery() {
            const { data } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
            if (data && data.length > 0) {
                setImages(data.map(img => ({ src: img.image_url, alt: img.alt_text || 'Gallery Image' })));
            }
        }
        fetchGallery();
    }, []);
    return (
        <section className={styles.gallery} id="gallery">
            <div className={styles.header}>
                <span className={styles.eyebrow}>Visual Diary</span>
                <h2 className={styles.heading}>Glimpses of Goodness</h2>
            </div>

            <div className={styles.marqueeContainer}>
                <div className={styles.track}>
                    {/* First Set */}
                    {images.map((img, i) => (
                        <div key={`orig-${i}`} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 60vw, 300px"
                                />
                            </div>
                        </div>
                    ))}
                    {/* Duplicate Set 1 */}
                    {images.map((img, i) => (
                        <div key={`dup1-${i}`} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 60vw, 300px"
                                />
                            </div>
                        </div>
                    ))}
                    {/* Duplicate Set 2 */}
                    {images.map((img, i) => (
                        <div key={`dup2-${i}`} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 60vw, 300px"
                                />
                            </div>
                        </div>
                    ))}
                    {/* Duplicate Set 3 */}
                    {images.map((img, i) => (
                        <div key={`dup3-${i}`} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 60vw, 300px"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.instructions}>
                <span>&larr; Drag to Pause &rarr;</span>
            </div>
        </section>
    );
}

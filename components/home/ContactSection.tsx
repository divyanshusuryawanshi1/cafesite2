'use client';

import { MapPin, Clock, Phone, Envelope } from '@phosphor-icons/react';
import styles from './ContactSection.module.css';

export default function ContactSection() {
    return (
        <section className={styles.section} id="contact">
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.eyebrow}>Visit Us</span>
                    <h2 className={styles.heading}>Find Your Corner</h2>

                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <MapPin size={32} className={styles.icon} />
                            <h3 className={styles.infoTitle}>Location</h3>
                            <p className={styles.infoText}>123, Heritage Lane,<br />Kala Ghoda, Mumbai - 400001</p>
                        </div>

                        <div className={styles.infoItem}>
                            <Clock size={32} className={styles.icon} />
                            <h3 className={styles.infoTitle}>Hours</h3>
                            <p className={styles.infoText}>Mon-Sun: 8:00 AM - 10:00 PM</p>
                        </div>

                        <div className={styles.infoItem}>
                            <Phone size={32} className={styles.icon} />
                            <h3 className={styles.infoTitle}>Contact</h3>
                            <p className={styles.infoText}>+91 98765 43210<br />hello@saffronspice.in</p>
                        </div>
                    </div>
                </div>

                <div className={styles.mapWrapper}>
                    {/* Placeholder for Map - Using an image or iframe would be typical */}
                    <div className={styles.mapPlaceholder}>
                        <span>Map Integration</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import styles from './MenuSection.module.css';

type Category = {
    id: string;
    name: string;
    slug: string;
};

type MenuItem = {
    id: string;
    category_id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    is_available: boolean;
};

// Expanded Demo Data
const DEMO_CATEGORIES = [
    { id: 'cat_1', name: 'Small Plates', slug: 'small-plates' },
    { id: 'cat_2', name: 'Mains', slug: 'mains' },
    { id: 'cat_3', name: 'Beverages', slug: 'beverages' },
    { id: 'cat_4', name: 'Desserts', slug: 'desserts' },
];

const DEMO_ITEMS: MenuItem[] = [
    // Small Plates
    { id: '1', category_id: 'cat_1', name: 'Pani Puri Shots', description: 'Crispy semolina shells filled with spiced potatoes and sprouts, served with mint and tamarind water shots.', price: 295, is_available: true, image_url: '/cafe_food_1.png' },
    { id: '2', category_id: 'cat_1', name: 'Avocado Papdi Chaat', description: 'Modern twist on classic street food with spiced avocado mousse and pomegranate.', price: 345, is_available: true, image_url: '/cafe_food_chaat.png' },
    { id: '3', category_id: 'cat_1', name: 'Truffle Mushroom Kulcha', description: 'Mini stuffed breads with earthy truffle mushrooms and goat cheese.', price: 425, is_available: true, image_url: '/cafe_food_2.png' },

    // Mains
    { id: '4', category_id: 'cat_2', name: 'Old Delhi Butter Chicken', description: 'Smoked tandoori chicken simmered in a rich tomato and cashew gravy.', price: 595, is_available: true, image_url: '/cafe_food_dessert.png' },
    { id: '5', category_id: 'cat_2', name: 'Dal Bukhara', description: 'Black lentils slow-cooked overnight with cream and butter.', price: 495, is_available: true, image_url: '/cafe_food_2.png' },
    { id: '6', category_id: 'cat_2', name: 'Paneer Makhani', description: 'Cottage cheese cubes in a velvety tomato gravy.', price: 545, is_available: true, image_url: '/cafe_food_2.png' },
    { id: '7', category_id: 'cat_2', name: 'Garlic Naan Basket', description: 'Assorted naan breads brushed with garlic butter.', price: 195, is_available: true, image_url: '/cafe_food_2.png' },

    // Beverages
    { id: '8', category_id: 'cat_3', name: 'Masala Chai', description: 'Traditional indian tea brewed with aromatic spices.', price: 145, is_available: true, image_url: '/cafe_beverage_chai.png' },
    { id: '9', category_id: 'cat_3', name: 'Saffron Latte', description: 'Espresso with steamed milk and kashmiri saffron infusion.', price: 245, is_available: true, image_url: '/cafe_gallery_2.png' },
    { id: '10', category_id: 'cat_3', name: 'Nimbu Soda', description: 'Fresh lime soda with a pinch of rock salt.', price: 125, is_available: true, image_url: '/cafe_food_1.png' },

    // Desserts
    { id: '11', category_id: 'cat_4', name: 'Rose Falooda', description: 'Layers of vermicelli, basil seeds, and rose syrup with vanilla ice cream.', price: 325, is_available: true, image_url: '/cafe_food_dessert.png' },
    { id: '12', category_id: 'cat_4', name: 'Gulab Jamun Cheesecake', description: 'Fusion dessert combining classic gulab jamun with creamy cheesecake.', price: 375, is_available: true, image_url: '/cafe_food_dessert.png' },
];

export default function MenuSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // Try fetching from Supabase, fallback to Demo
            const { data: catData } = await supabase.from('categories').select('*').order('sort_order');
            const { data: itemData } = await supabase.from('menu_items').select('*').eq('is_available', true);

            if (catData && catData.length > 0) setCategories(catData);
            else setCategories(DEMO_CATEGORIES);

            if (itemData && itemData.length > 0) setItems(itemData);
            else setItems(DEMO_ITEMS);

            setLoading(false);
        }
        fetchData();
    }, []);

    const filteredItems = activeCategory === 'all'
        ? items
        : items.filter(item => item.category_id === activeCategory);

    return (
        <section className={styles.section} id="menu">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.eyebrow}>Our Offerings</span>
                    <h2 className={styles.heading}>A Culinary Journey through India</h2>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeCategory === 'all' ? styles.active : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`${styles.tab} ${activeCategory === cat.id ? styles.active : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className={styles.loading}>Curating menu...</div>
                ) : (
                    <div className={styles.grid}>
                        {filteredItems.map(item => (
                            <div key={item.id} className={styles.card}>
                                {item.image_url && (
                                    <div className={styles.cardImage}>
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 300px"
                                            className={styles.img}
                                        />
                                    </div>
                                )}
                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        <span className={styles.price}>₹{item.price}</span>
                                    </div>
                                    <p className={styles.description}>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

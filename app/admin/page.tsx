'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    SquaresFour,
    Plus,
    PencilSimple,
    Trash,
    SignOut,
    Coffee,
    List,
    Image as ImageIcon,
    UploadSimple
} from '@phosphor-icons/react';
import styles from './admin.module.css';

// Types
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
    image_url: string;
    is_available: boolean;
};

type GalleryItem = {
    id: string;
    image_url: string;
    alt_text: string;
};

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'menu' | 'categories' | 'gallery'>('menu');

    // Forms
    const [showItemForm, setShowItemForm] = useState(false);
    const [showCatForm, setShowCatForm] = useState(false);
    const [showGalleryForm, setShowGalleryForm] = useState(false);

    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [editingCat, setEditingCat] = useState<Category | null>(null);

    // Form States
    const [itemForm, setItemForm] = useState({
        name: '', description: '', price: '', category_id: '', image_url: ''
    });
    const [catForm, setCatForm] = useState({ name: '', slug: '' });
    const [galleryForm, setGalleryForm] = useState({ image_url: '', alt_text: '' });

    // Upload State
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function init() {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || { email: 'admin@saffron.com' });
            await fetchData();
            setLoading(false);
        }
        init();
    }, []);

    async function fetchData() {
        const { data: itemData } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
        const { data: catData } = await supabase.from('categories').select('*').order('name');
        const { data: galleryData } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });

        if (itemData) setItems(itemData);
        if (catData) setCategories(catData);
        if (galleryData) setGalleryImages(galleryData);
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        let { error: uploadError } = await supabase.storage.from('menu-images').upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image: ' + uploadError.message);
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('menu-images').getPublicUrl(filePath);
        setUploading(false);
        return publicUrl;
    };

    // --- MENU ITEM LOGIC ---
    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemForm.name || !itemForm.price || !itemForm.category_id) return alert('Name, Price, and Category are required');

        const payload = {
            name: itemForm.name,
            description: itemForm.description,
            price: parseInt(itemForm.price),
            category_id: itemForm.category_id,
            image_url: itemForm.image_url,
            is_available: true
        };

        let error;
        if (editingItem) {
            ({ error } = await supabase.from('menu_items').update(payload).eq('id', editingItem.id));
        } else {
            ({ error } = await supabase.from('menu_items').insert([payload]));
        }

        if (!error) {
            setShowItemForm(false);
            setEditingItem(null);
            setItemForm({ name: '', description: '', price: '', category_id: '', image_url: '' });
            fetchData();
        } else {
            alert('Error saving item: ' + error.message);
        }
    };

    const deleteItem = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        const { error } = await supabase.from('menu_items').delete().eq('id', id);
        if (!error) fetchData();
    };

    const openItemEdit = (item: MenuItem) => {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            description: item.description || '',
            price: item.price.toString(),
            category_id: item.category_id,
            image_url: item.image_url || ''
        });
        setShowItemForm(true);
    };

    // --- CATEGORY LOGIC ---
    const handleSaveCat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catForm.name || !catForm.slug) return alert('Name and Slug are required');

        const payload = { name: catForm.name, slug: catForm.slug };
        let error;

        if (editingCat) {
            ({ error } = await supabase.from('categories').update(payload).eq('id', editingCat.id));
        } else {
            ({ error } = await supabase.from('categories').insert([payload]));
        }

        if (!error) {
            setShowCatForm(false);
            setEditingCat(null);
            setCatForm({ name: '', slug: '' });
            fetchData();
        } else {
            alert('Error saving category: ' + error.message);
        }
    };

    const deleteCat = async (id: string) => {
        if (!confirm('Delete category? Items in this category will also be deleted.')) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (!error) fetchData();
    };

    const openCatEdit = (cat: Category) => {
        setEditingCat(cat);
        setCatForm({ name: cat.name, slug: cat.slug });
        setShowCatForm(true);
    };

    // --- GALLERY LOGIC ---
    const handleSaveGallery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!galleryForm.image_url) return alert('Image is required');

        const { error } = await supabase.from('gallery_images').insert([{
            image_url: galleryForm.image_url,
            alt_text: galleryForm.alt_text
        }]);

        if (!error) {
            setShowGalleryForm(false);
            setGalleryForm({ image_url: '', alt_text: '' });
            fetchData();
        } else {
            alert('Error saving gallery image: ' + error.message);
        }
    };

    const deleteGallery = async (id: string) => {
        if (!confirm('Delete this image?')) return;
        const { error } = await supabase.from('gallery_images').delete().eq('id', id);
        if (!error) fetchData();
    };

    if (loading) return <div className={styles.container}><div style={{ margin: 'auto' }}>Loading Dashboard...</div></div>;

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <Coffee size={32} weight="fill" className={styles.brandIcon} />
                    <span>Saffron Admin</span>
                </div>

                <nav className={styles.nav}>
                    <button className={`${styles.navItem} ${activeTab === 'menu' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('menu')}>
                        <List size={20} />
                        <span>Menu Items</span>
                    </button>
                    <button className={`${styles.navItem} ${activeTab === 'categories' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('categories')}>
                        <SquaresFour size={20} />
                        <span>Categories</span>
                    </button>
                    <button className={`${styles.navItem} ${activeTab === 'gallery' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('gallery')}>
                        <ImageIcon size={20} />
                        <span>Moodboard</span>
                    </button>
                </nav>

                <div className={styles.userProfile}>
                    <div className={styles.avatar}>A</div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Admin</span>
                        <span className={styles.userRole}>Dashboard</span>
                    </div>
                    <button onClick={handleLogout} className={styles.iconBtn} title="Logout">
                        <SignOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.topBar}>
                    <div>
                        <h1 className={styles.pageTitle}>Dashboard</h1>
                        <p style={{ color: '#9ca3af', marginTop: '0.25rem' }}>Welcome back, {user?.email}</p>
                    </div>

                    {activeTab === 'menu' && (
                        <button className={styles.actionBtn} onClick={() => { setEditingItem(null); setItemForm({ name: '', description: '', price: '', category_id: categories[0]?.id || '', image_url: '' }); setShowItemForm(true); }}>
                            <Plus size={18} weight="bold" />
                            <span>Add Item</span>
                        </button>
                    )}
                    {activeTab === 'categories' && (
                        <button className={styles.actionBtn} onClick={() => { setEditingCat(null); setCatForm({ name: '', slug: '' }); setShowCatForm(true); }}>
                            <Plus size={18} weight="bold" />
                            <span>Add Category</span>
                        </button>
                    )}
                    {activeTab === 'gallery' && (
                        <button className={styles.actionBtn} onClick={() => { setGalleryForm({ image_url: '', alt_text: '' }); setShowGalleryForm(true); }}>
                            <Plus size={18} weight="bold" />
                            <span>Add Image</span>
                        </button>
                    )}
                </header>

                {/* MENU TAB */}
                {activeTab === 'menu' && (
                    <>
                        {showItemForm && (
                            <div className={styles.sectionBlock}>
                                <div className={styles.blockHeader}>
                                    <h3 className={styles.blockTitle}>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                                    <button onClick={() => setShowItemForm(false)} className={styles.iconBtn}><Trash size={20} /></button>
                                </div>
                                <form onSubmit={handleSaveItem} className={styles.formGrid}>
                                    <input className={styles.inputField} placeholder="Item Name" value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} required />
                                    <input className={styles.inputField} placeholder="Price (₹)" type="number" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} required />

                                    <select className={styles.inputField} value={itemForm.category_id} onChange={e => setItemForm({ ...itemForm, category_id: e.target.value })} required>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>

                                    <div className={styles.inputField} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <input type="text" placeholder="Image URL (or upload)" value={itemForm.image_url} onChange={e => setItemForm({ ...itemForm, image_url: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'white', flex: 1 }} />
                                        <label style={{ cursor: 'pointer', color: '#8b5cf6' }}>
                                            <UploadSimple size={20} />
                                            <input type="file" hidden accept="image/*" onChange={async (e) => {
                                                const url = await uploadImage(e);
                                                if (url) setItemForm(prev => ({ ...prev, image_url: url }));
                                            }} />
                                        </label>
                                        {uploading && <span style={{ fontSize: '0.8rem' }}>Uploading...</span>}
                                    </div>

                                    <textarea
                                        className={`${styles.inputField} ${styles.fullWidth}`}
                                        placeholder="Description"
                                        value={itemForm.description}
                                        onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                                        style={{ gridColumn: '1/-1', minHeight: '80px', fontFamily: 'inherit' }}
                                    />

                                    <div style={{ gridColumn: '1/-1', display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className={styles.actionBtn}>Save Item</button>
                                        <button type="button" onClick={() => setShowItemForm(false)} className={styles.iconBtn} style={{ border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className={styles.sectionBlock}>
                            <div className={styles.tableHeader}>
                                <span>Name</span>
                                <span>Category</span>
                                <span>Price</span>
                                <span>Image</span>
                                <span>Actions</span>
                            </div>
                            <div className={styles.tableBody}>
                                {items.map(item => {
                                    const catName = categories.find(c => c.id === item.category_id)?.name || 'Uncategorized';
                                    return (
                                        <div key={item.id} className={styles.tableRow}>
                                            <div className={styles.itemName}>{item.name}</div>
                                            <div style={{ opacity: 0.7 }}>{catName}</div>
                                            <div className={styles.itemPrice}>₹{item.price}</div>
                                            <div>
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt="mini" style={{ width: 40, height: 30, borderRadius: 4, objectFit: 'cover' }} />
                                                ) : <ImageIcon size={20} color="#666" />}
                                            </div>
                                            <div className={styles.rowActions}>
                                                <button className={styles.iconBtn} onClick={() => openItemEdit(item)} title="Edit"><PencilSimple size={18} /></button>
                                                <button className={`${styles.iconBtn} ${styles.iconBtnDelete}`} onClick={() => deleteItem(item.id)} title="Delete"><Trash size={18} /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {items.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No items found. Add one!</div>}
                            </div>
                        </div>
                    </>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === 'categories' && (
                    <>
                        {showCatForm && (
                            <div className={styles.sectionBlock}>
                                <div className={styles.blockHeader}>
                                    <h3 className={styles.blockTitle}>{editingCat ? 'Edit Category' : 'Add Category'}</h3>
                                </div>
                                <form onSubmit={handleSaveCat} className={styles.formGrid}>
                                    <input className={styles.inputField} placeholder="Category Name" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required />
                                    <input className={styles.inputField} placeholder="Slug (e.g. small-plates)" value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })} required />
                                    <div style={{ gridColumn: '1/-1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="submit" className={styles.actionBtn}>Save Category</button>
                                        <button type="button" onClick={() => setShowCatForm(false)} className={styles.iconBtn} style={{ border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className={styles.sectionBlock}>
                            <div className={styles.tableHeader} style={{ gridTemplateColumns: '2fr 2fr 100px' }}>
                                <span>Name</span>
                                <span>Slug</span>
                                <span>Actions</span>
                            </div>
                            <div className={styles.tableBody}>
                                {categories.map(cat => (
                                    <div key={cat.id} className={styles.tableRow} style={{ gridTemplateColumns: '2fr 2fr 100px' }}>
                                        <div className={styles.itemName}>{cat.name}</div>
                                        <div style={{ opacity: 0.7 }}>{cat.slug}</div>
                                        <div className={styles.rowActions}>
                                            <button className={styles.iconBtn} onClick={() => openCatEdit(cat)} title="Edit"><PencilSimple size={18} /></button>
                                            <button className={`${styles.iconBtn} ${styles.iconBtnDelete}`} onClick={() => deleteCat(cat.id)} title="Delete"><Trash size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* GALLERY TAB */}
                {activeTab === 'gallery' && (
                    <>
                        {showGalleryForm && (
                            <div className={styles.sectionBlock}>
                                <div className={styles.blockHeader}>
                                    <h3 className={styles.blockTitle}>Add Moodboard Image</h3>
                                </div>
                                <form onSubmit={handleSaveGallery} className={styles.formGrid}>
                                    <div className={styles.inputField} style={{ display: 'flex', alignItems: 'center', gap: '1rem', gridColumn: '1/-1' }}>
                                        <input type="text" placeholder="Image URL (or upload)" value={galleryForm.image_url} onChange={e => setGalleryForm({ ...galleryForm, image_url: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'white', flex: 1 }} />
                                        <label style={{ cursor: 'pointer', color: '#8b5cf6' }}>
                                            <UploadSimple size={20} />
                                            <input type="file" hidden accept="image/*" onChange={async (e) => {
                                                const url = await uploadImage(e);
                                                if (url) setGalleryForm(prev => ({ ...prev, image_url: url }));
                                            }} />
                                        </label>
                                        {uploading && <span style={{ fontSize: '0.8rem' }}>Uploading...</span>}
                                    </div>

                                    <input className={`${styles.inputField} ${styles.fullWidth}`} placeholder="Alt Text" value={galleryForm.alt_text} onChange={e => setGalleryForm({ ...galleryForm, alt_text: e.target.value })} style={{ gridColumn: '1/-1' }} />

                                    <div style={{ gridColumn: '1/-1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="submit" className={styles.actionBtn}>Save Image</button>
                                        <button type="button" onClick={() => setShowGalleryForm(false)} className={styles.iconBtn} style={{ border: '1px solid #374151', borderRadius: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className={styles.sectionBlock}>
                            <div className={styles.grid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                {galleryImages.map(img => (
                                    <div key={img.id} style={{ position: 'relative', height: '200px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #374151' }}>
                                        <img src={img.image_url} alt={img.alt_text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            onClick={() => deleteGallery(img.id)}
                                            style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.6)', color: '#ef4444', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {galleryImages.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No visuals yet. Add some!</div>}
                        </div>
                    </>
                )}

            </main>
        </div>
    );
}

// Shared data layer: localStorage + BroadcastChannel => live updates across tabs
const KEY = 'rmm_menu_v1';
const bc = 'BroadcastChannel' in window ? new BroadcastChannel('rmm') : null;
const seed = {
  categories: ['Starters', 'Main Course', 'Desserts', 'Drinks'],
  items: [
    { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 220, desc: 'Charcoal-grilled paneer, mint chutney.', veg: true, available: true },
    { id: 2, name: 'Hara Bhara Kebab', category: 'Starters', price: 180, desc: 'Spinach and green pea patties.', veg: true, available: true },
    { id: 3, name: 'Butter Chicken', category: 'Main Course', price: 340, desc: 'Creamy tomato gravy, served with naan.', veg: false, available: true },
    { id: 4, name: 'Dal Makhani', category: 'Main Course', price: 260, desc: 'Black lentils slow-cooked overnight.', veg: true, available: true },
    { id: 5, name: 'Gulab Jamun', category: 'Desserts', price: 90, desc: 'Two pieces, warm sugar syrup.', veg: true, available: true },
    { id: 6, name: 'Masala Chai', category: 'Drinks', price: 40, desc: 'Ginger and cardamom.', veg: true, available: true },
    { id: 7, name: 'Fresh Lime Soda', category: 'Drinks', price: 70, desc: 'Sweet or salted.', veg: true, available: false }
  ]
};
const Store = {
  get() {
    try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.items) return d; } catch (e) {}
    this.set(seed, true); return structuredClone(seed);
  },
  set(data, silent) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    if (!silent && bc) bc.postMessage('update');
  },
  onChange(fn) {
    window.addEventListener('storage', e => { if (e.key === KEY) fn(); });
    if (bc) bc.onmessage = fn;
  }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rupee = n => '₹' + Number(n).toLocaleString('en-IN');

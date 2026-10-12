import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (pID: number) => void;
  updateQuantity: (pID: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const getStoredCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem('doc_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: getStoredCart(),
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.product.pID === product.pID);
      let updated: CartItem[];
      if (existing) {
        updated = state.items.map((item) =>
          item.product.pID === product.pID
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...state.items, { product, quantity }];
      }
      localStorage.setItem('doc_cart', JSON.stringify(updated));
      return { items: updated };
    });
  },
  removeFromCart: (pID) => {
    set((state) => {
      const updated = state.items.filter((item) => item.product.pID !== pID);
      localStorage.setItem('doc_cart', JSON.stringify(updated));
      return { items: updated };
    });
  },
  updateQuantity: (pID, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(pID);
      return;
    }
    set((state) => {
      const updated = state.items.map((item) =>
        item.product.pID === pID ? { ...item, quantity } : item
      );
      localStorage.setItem('doc_cart', JSON.stringify(updated));
      return { items: updated };
    });
  },
  clearCart: () => {
    localStorage.removeItem('doc_cart');
    set({ items: [] });
  },
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
      return total + (isNaN(price) ? 0 : price) * item.quantity;
    }, 0);
  },
}));

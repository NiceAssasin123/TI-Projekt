import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CART_STORAGE_KEY = 'tactical-store-cart';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantityToAdd = 1) =>
        set((state) => {
          if (!product || !product.id || product.in_stock <= 0) {
            return state;
          }

          const safeIncrement = Math.max(1, Number(quantityToAdd) || 1);
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            const maxStock = product.in_stock ?? existingItem.in_stock;
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      in_stock: maxStock,
                      quantity: Math.min(item.quantity + safeIncrement, maxStock),
                    }
                  : item
              ),
            };
          }

          const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url ?? null,
            requires_permit: Boolean(product.requires_permit),
            in_stock: product.in_stock,
            quantity: Math.min(safeIncrement, product.in_stock),
          };

          return { items: [...state.items, newItem] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId, newQuantity) =>
        set((state) => {
          const parsedQuantity = Number(newQuantity);

          if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== productId),
            };
          }

          return {
            items: state.items.map((item) => {
              if (item.id !== productId) return item;
              const maxStock = item.in_stock > 0 ? item.in_stock : parsedQuantity;
              return {
                ...item,
                quantity: Math.min(Math.floor(parsedQuantity), maxStock),
              };
            }),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
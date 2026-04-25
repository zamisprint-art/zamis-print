import { create } from 'zustand';

export const useCartStore = create((set) => ({
    cartItems: [],
    addItem: (item) => set((state) => {
        const existItem = state.cartItems.find((x) => x.product === item.product);

        if (existItem) {
            return {
                cartItems: state.cartItems.map((x) =>
                    x.product === existItem.product ? item : x
                ),
            };
        } else {
            return {
                cartItems: [...state.cartItems, item],
            };
        }
    }),
    removeItem: (id) => set((state) => ({
        cartItems: state.cartItems.filter((x) => x.product !== id),
    })),
    clearCart: () => set({ cartItems: [] }),
}));

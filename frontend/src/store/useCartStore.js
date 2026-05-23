import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set) => ({
            cartItems: [],
            isDrawerOpen: false, // Nuevo estado para el Mini-Cart
            toggleDrawer: (isOpen) => set({ isDrawerOpen: isOpen }), // Función para abrir/cerrar
            addItem: (item) => set((state) => {
                const existItem = state.cartItems.find((x) => x.product === item.product && x.selectedColor === item.selectedColor);

                if (existItem) {
                    return {
                        cartItems: state.cartItems.map((x) =>
                            (x.product === existItem.product && x.selectedColor === existItem.selectedColor) ? item : x
                        ),
                        isDrawerOpen: true,
                    };
                } else {
                    return {
                        cartItems: [...state.cartItems, item],
                        isDrawerOpen: true,
                    };
                }
            }),
            removeItem: (id, selectedColor = undefined) => set((state) => ({
                cartItems: state.cartItems.filter((x) => !(x.product === id && x.selectedColor === selectedColor)),
            })),
            clearCart: () => set({ cartItems: [] }),
        }),
        {
            name: 'zamis-cart-storage', // name of item in localStorage
            partialize: (state) => ({ cartItems: state.cartItems }), // solo guarda cartItems, ignora isDrawerOpen
        }
    )
);

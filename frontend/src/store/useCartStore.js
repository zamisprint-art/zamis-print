import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set) => ({
            cartItems: [],
            isDrawerOpen: false, // Nuevo estado para el Mini-Cart
            toggleDrawer: (isOpen) => set({ isDrawerOpen: isOpen }), // Función para abrir/cerrar
            addItem: (item) => set((state) => {
                const existItem = state.cartItems.find((x) => x.product === item.product);

                if (existItem) {
                    return {
                        cartItems: state.cartItems.map((x) =>
                            x.product === existItem.product ? item : x
                        ),
                        isDrawerOpen: true, // Se abre automáticamente al añadir
                    };
                } else {
                    return {
                        cartItems: [...state.cartItems, item],
                        isDrawerOpen: true, // Se abre automáticamente al añadir
                    };
                }
            }),
            removeItem: (id) => set((state) => ({
                cartItems: state.cartItems.filter((x) => x.product !== id),
            })),
            clearCart: () => set({ cartItems: [] }),
        }),
        {
            name: 'zamis-cart-storage', // name of item in localStorage
            partialize: (state) => ({ cartItems: state.cartItems }), // solo guarda cartItems, ignora isDrawerOpen
        }
    )
);

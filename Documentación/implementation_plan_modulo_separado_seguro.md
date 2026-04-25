# ZAMIS Print - Módulos Separados y Seguros 🛡️

Hemos rediseñado la arquitectura de la aplicación para separar completamente la experiencia de tus clientes de la experiencia administrativa de tu negocio, tal como lo pediste.

## ¿Qué cambió estructuralmente?

### 1. Dos Mundos Aislados
- **La Tienda (`/`, `/shop`, `/checkout`):** Ahora vive dentro de un `StoreLayout`. Aquí tus clientes ven el logo, la barra de navegación y el carrito de compras.
- **El Panel (`/admin/login`, `/admin`):** Ahora vive dentro de un `AdminLayout` completamente independiente. No tiene carrito ni enlaces a la tienda pública. Es una herramienta de software interna y privada.

### 2. Seguridad Reforzada en Frontend
Aunque tu backend de Node.js ya estaba fuertemente protegido con validación de roles y cookies encriptadas, configuramos tu frontend (Vite/Axios) para que respete esas reglas de seguridad.
- Ahora Axios envía automáticamente `withCredentials: true` en cada petición.
- La ruta `/admin` en React valida que quien intente entrar sea administrador (`isAdmin === true`). De lo contrario, los expulsa.

### 3. "Guest Checkout" (Compras sin Registro)
Eliminamos el bloqueo que obligaba a los clientes a iniciar sesión antes de pagar.
- Ahora, cualquier persona puede entrar, diseñar su Funko 3D, añadirlo al carrito e ir directamente a pagar (Checkout) sin crear una cuenta.
- Tu base de datos aceptará estos "Guest Orders" (Órdenes de Invitado) guardándolas correctamente para que tú las veas en el panel.

## ¿Cómo verlo en acción?

Tus servidores ya aplicaron los cambios en tiempo real.

1. **Prueba como Cliente:**
   Entra a **[http://localhost:5173/shop](http://localhost:5173/shop)**. Intenta hacer una compra, verás que el botón "Pagar" ya no te pide iniciar sesión.
   
2. **Prueba como Dueño (Admin):**
   Entra directamente a **[http://localhost:5173/admin/login](http://localhost:5173/admin/login)**. Verás que ya no hay menús de la tienda estorbando, solo tu panel de control enfocado en métricas y ventas.

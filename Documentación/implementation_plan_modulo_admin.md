# Separación del Módulo Administrador

Actualmente, si entras a `/login` o `/admin`, sigues viendo la barra de navegación de la tienda (Catálogo, Carrito, etc.). Entiendo perfectamente tu punto comercial: **el área de clientes y el área de administración deben sentirse como dos mundos completamente distintos**, tal como funciona Shopify.

Para lograr esto sin complicar el despliegue creando un servidor nuevo, propongo reestructurar el "enrutador" (Router) de la aplicación para crear **Layouts Independientes**.

## Cambios Propuestos

### 1. Crear Layouts de Interfaz
Crearemos dos contenedores visuales separados:
- **[NEW] `frontend/src/layouts/StoreLayout.jsx`**: Tendrá el `Navbar` de ZAMIS Print, el Carrito, y envolverá las páginas de `/`, `/shop`, `/product/:id` y `/checkout`.
- **[NEW] `frontend/src/layouts/AdminLayout.jsx`**: Un contenedor limpio, oscuro y enfocado solo en herramientas de negocio. No tendrá carrito ni enlaces a la tienda pública. Envolverá `/admin` y `/login`.

### 2. Refactorizar el Enrutador Principal
- **[MODIFY] `frontend/src/App.jsx`**: Quitaremos el `Navbar` global y agruparemos las rutas.
  - El grupo "Store" usará el `StoreLayout`.
  - El grupo "Admin" usará el `AdminLayout`.

### 3. Ajuste en el Flujo de Clientes
Actualmente, si un cliente intentaba comprar sin iniciar sesión, lo mandábamos a `/login`. Como ahora el Login será *exclusivo* para ti (el administrador), cambiaremos el **Checkout** para que los clientes normales puedan comprar como **"Invitados"** sin necesidad de crearse una cuenta (lo cual aumenta muchísimo las tasas de conversión en e-commerce).
- **[MODIFY] `frontend/src/pages/Checkout.jsx`**: Remover el bloqueo de `if (!userInfo)` para permitir compras de invitados.

## Resultado
A nivel de código, seguirá siendo un solo proyecto fácil de subir a internet, pero a nivel visual y de experiencia de usuario:
- El cliente entra a `zamisprint.com` y ve una tienda pura. Compra rápido como invitado.
- Tú entras a `zamisprint.com/admin`, ves una pantalla de Login exclusiva de empleados, y accedes a un panel de control que no tiene nada que ver con el diseño público de la tienda.

# Separación y Seguridad del Módulo Administrador

Tienes toda la razón en exigir rigor en la seguridad y en la estructura de URLs. La propuesta anterior se centró demasiado en lo visual, pero un e-commerce real requiere protección a nivel servidor y cliente. 

Aclarando: **La protección en el backend (Node.js) ya existe en tu código actual** (middlewares `protect` para validar JWT y `admin` para validar el rol), pero necesitamos estructurar correctamente el Frontend para consumir esto de forma aislada y segura.

## Cambios Estructurales y de Seguridad Propuestos

### 1. Reestructuración de URLs (Módulo Aislado)
- **`/admin/login`**: Será la única puerta de entrada. Si un cliente normal intenta entrar, solo verá este login (sin menú de tienda).
- **`/admin`**: El dashboard protegido. Cualquier intento de entrar aquí sin un token de administrador válido será rechazado.

### 2. Layouts Independientes (Frontend)
- **`StoreLayout.jsx`**: Envolverá la tienda pública (`/`, `/shop`, `/checkout`). Incluirá tu Navbar comercial.
- **`AdminLayout.jsx`**: Envolverá `/admin`. No tendrá Navbar comercial, se sentirá como un software interno privado.

### 3. Protección de Rutas (Frontend + Backend)
- **Validación de Cookies HTTP-Only**: Tu backend ya está configurado para emitir un JWT seguro (vía `utils/generateToken.js`) que se guarda en una cookie inaccesible para hackers. 
- **Componente `AdminRoute` (Frontend)**: Evaluará el estado global (`useAuthStore`) para verificar que el usuario tenga `isAdmin === true`. Si es falso o no existe, lo patea a `/admin/login`.
- **Axios Interceptors / Credentials**: Aseguraremos que el frontend (Vite) envíe siempre la cabecera `withCredentials: true` en cada petición de `axios` hacia `/api/orders` y `/api/products` para que el middleware `protect` y `admin` del backend te deje pasar. Sin esto, la API bloquea la llamada (Error 401).

### 4. Checkout para Invitados
Como mencionamos antes, sacaremos el requisito de "Estar logueado" para poder comprar. El flujo de compra será libre, enviando simplemente la información del pedido a MongoDB sin atarlo forzosamente a una cuenta de usuario, maximizando la conversión de ZAMIS Print.

## Resultado Final
Tendrás un "Shopify local":
- **Público:** Entra, navega y compra sin trabas.
- **Dueño:** Entra a `/admin/login`, el backend valida su rol `isAdmin`, le otorga una cookie JWT encriptada, y el frontend le da acceso al `AdminLayout` privado.

> [!IMPORTANT]
> **Revisión Requerida:** ¿Estás de acuerdo con este enfoque de seguridad integral y la nueva estructura de rutas (`/admin/login`)? Si lo apruebas, procederé con la separación estricta.

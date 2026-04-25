# ZAMIS Print - Plataforma E-commerce

Hemos completado exitosamente la creación de la arquitectura completa y el diseño visual de tu nueva plataforma de ventas para impresiones 3D. El proyecto está dividido en un Frontend altamente interactivo y un Backend robusto para procesar pagos y datos.

## 🌟 Características Implementadas

### Frontend (React + Vite + Tailwind v4 + Zustand)
- **Tema Visual Moderno:** Sistema de diseño oscuro (*Dark Mode*) con acentos violetas y azules, aplicando efectos de cristal ahumado (*Glassmorphism*) en las tarjetas y barra de navegación.
- **Catálogo de Productos (`/shop`):** Grilla responsiva para mostrar el inventario, con sistema de filtrado visual.
- **Visor 3D Interactivo:** Integración de **React Three Fiber**. Los productos con modelos `.glb` o `.gltf` se renderizan en 3D directamente en la web. Los clientes pueden girarlos y hacer zoom.
- **Personalización de Producto (`/product/:id`):** Si un producto requiere personalización (ej. Funko), el sistema pide subir una foto. Si requiere texto (ej. Llavero), muestra un campo de texto obligatorio antes de añadir al carrito.
- **Carrito de Compras y Checkout (`/cart`, `/checkout`):** Gestión de estado global con Zustand para calcular totales instantáneamente. Formulario de envío y **simulación de conexión con MercadoPago**.
- **Panel de Administrador (`/admin`):** Dashboard exclusivo para gestionar productos, ver las órdenes entrantes, cambiar su estado (Pendiente, En Producción, Enviado) y revisar integraciones de API.

### Backend (Node.js + Express + MongoDB)
- **API REST Protegida:** Rutas aseguradas con JSON Web Tokens (JWT) guardados en cookies seguras (HttpOnly).
- **Esquemas de Base de Datos:**
  - `User`: Administradores y clientes con contraseñas encriptadas con `bcryptjs`.
  - `Product`: Soporte para rutas de imágenes, archivos de modelos 3D y banderas lógicas (`requiresTextPersonalization`, `requiresImagePersonalization`).
  - `Order`: Registro completo de la dirección de envío, estado de pago de MercadoPago, estado de envío y los campos personalizados que el usuario escribió/subió al momento de la compra.
- **Integraciones Listas:** Controladores base estructurados para recibir los webhooks reales de MercadoPago (`/api/payments/webhook`) y espacios listos para inyectar el SDK de Resend para correos transaccionales al cambiar el estado de las órdenes.

## 🚀 Cómo ejecutar el proyecto localmente

> [!IMPORTANT]
> Debes tener **Node.js** y **MongoDB** instalados (o usar MongoDB Atlas).

Abre dos terminales diferentes en la carpeta principal de tu proyecto (`D:\Workspace Agentes Antigravity`).

### 1. Iniciar el Backend
En la primera terminal, entra a la carpeta `backend` e inicia el servidor.
```bash
cd backend
npm install
npm run dev
```
*(Nota: Asegúrate de tener tu archivo `.env` configurado con tu `MONGO_URI` y `MERCADOPAGO_ACCESS_TOKEN` para que arranque sin errores).*

### 2. Iniciar el Frontend
En la segunda terminal, entra a la carpeta `frontend` e inicia Vite.
```bash
cd frontend
npm install
npm run dev
```
Haz clic en el enlace local que te dará Vite (usualmente `http://localhost:5173`) para ver tu tienda en el navegador.

## 📈 Siguientes Pasos para Producción

1. **Reemplazar Credenciales:** Ve al archivo `backend/.env` y reemplaza el `MERCADOPAGO_ACCESS_TOKEN` con tu token real de producción (o el de pruebas de MercadoPago).
2. **Subir Modelos 3D:** En el Panel Admin, cuando crees un producto nuevo, tendrás que subir el archivo `.glb` del diseño real para que React Three Fiber lo renderice.
3. **Despliegue (Hosting):**
   - El código de `frontend` está listo para ser arrastrado a **Vercel** o **Netlify**.
   - El código de `backend` está listo para ser subido a **Render** o **Railway**.

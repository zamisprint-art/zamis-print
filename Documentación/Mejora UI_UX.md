# Mejora de Diseño Visual y Flujo de Compra (UI/UX) 🎨

Actualmente el sistema funciona de maravilla en su lógica interna (Base de datos, 3D, Carrito), pero la "fachada" (la página principal y el proceso de pago) todavía se siente un poco rígida y usa datos falsos en la portada. 

El objetivo de esta fase es darle a **ZAMIS Print** ese aspecto de tienda "Premium" y "Moderna" que incite al cliente a comprar.

## Cambios Propuestos

### 1. Página de Inicio (Home.jsx) Real y Dinámica
- **Conectar con la BD:** Reemplazaremos las 3 tarjetas "esqueleto" (con texto "Producto de Ejemplo") por llamadas reales a tu base de datos para mostrar los últimos productos que has subido.
- **Hero Section (Portada):** Mejoraremos el diseño de la portada, añadiendo micro-interacciones (efectos al pasar el ratón) para que se sienta más "viva".

### 2. Flujo de Compra Mejorado (Checkout.jsx)
Actualmente todo está en un solo bloque. Lo dividiremos visualmente para reducir la fricción (ansiedad) de compra del cliente.
- **Indicador de Pasos (Stepper):** Añadiremos una barra superior en el Checkout que indique: `1. Carrito ➔ 2. Envío ➔ 3. Pago Seguro`.
- **Pulido Visual:** Mejoraremos los campos del formulario de envío, haciéndolos más grandes, legibles y amigables.

### 3. Sistema de Diseño (index.css & Componentes)
- Integraremos **Framer Motion** (una librería estándar en React) para añadir animaciones suaves cuando la página carga y cuando el cliente hace scroll. *(Nota: requerirá instalar la librería)*.
- Mejoraremos las tarjetas de producto en `ProductCard.jsx` para que el efecto "Glassmorphism" (cristal oscuro) se vea más nítido.

## Resultado Visual
Cuando el cliente entre a la página, verá animaciones fluidas. En la portada aparecerán directamente tus Funkos y modelos reales. Al darle a "Añadir al Carrito" y luego a "Pagar", pasará por un proceso guiado paso a paso, dándole una sensación de extrema seguridad y confianza antes de enviarlo a MercadoPago.

> [!IMPORTANT]
> **Revisión Requerida:** Para lograr las animaciones premium, necesito instalar `framer-motion` en tu proyecto frontend. ¿Estás de acuerdo con este rediseño y con la instalación de esta librería? Si apruebas, crearé la hoja de tareas y comenzaré a codificar.

# 📋 ZAMIS Print — Documentación del Proyecto
**Versión:** 2.0 · **Fecha:** 30 de Abril de 2026  
**Repositorio:** `github.com/zamisprint-art/zamis-print`  
**Frontend:** https://zamis-print.vercel.app  
**Backend API:** https://zamis-print.onrender.com

---

## 🏗️ Infraestructura y Stack Tecnológico

| Capa | Tecnología | Servicio |
|---|---|---|
| Frontend | React + Vite + Framer Motion | Vercel (auto-deploy desde GitHub) |
| Backend | Node.js + Express | Render.com (auto-deploy desde GitHub) |
| Base de datos | MongoDB Atlas | Cluster `ZamisCluster` |
| Imágenes | Cloudinary | Cloud: `dispke76s` |
| Pagos | MercadoPago | Token configurado en Render |
| CI/CD | GitHub → Vercel + Render | Auto-deploy en cada `git push` |

> [!IMPORTANT]
> El despliegue es **completamente automático**. Cualquier `git push` a `main` actualiza producción en ~2 minutos sin intervención manual.

---

## 🛒 Módulos Implementados

### 1. Sistema de Catálogo y Productos

**Modelo de Datos del Producto (`Product.js`):**

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | String | Nombre del producto |
| `image` | String | URL imagen principal (Cloudinary) |
| `gallery[]` | String[] | Hasta 4 imágenes adicionales |
| `model3D` | String | URL archivo .GLB para visor 3D |
| `category` | String | Categoría principal |
| `subcategory` | String | Subcategoría (menú jerárquico) |
| `price` | Number | Precio base |
| `salePrice` | Number | Precio de oferta |
| `countInStock` | Number | Stock disponible |
| `material` | String | PLA / PETG / ABS / Resina / Nylon / TPU |
| `size` | String | Pequeño / Mediano / Grande / Extra Grande |
| `color` | String | Color principal |
| `measurements` | String | Dimensiones en cm |
| `personalizationLevel` | String | Ninguna / Básica / Avanzada / Premium |
| `isCustomizable` | Boolean | Activa el Configurador Premium |
| `isFeatured` | Boolean | Aparece en sección Destacados del Home |
| `isNewArrival` | Boolean | Aparece en sección Novedades del Home |
| `isOnSale` | Boolean | Aparece en sección Ofertas del Home |
| `totalSold` | Number | Unidades vendidas (para ranking Más Vendidos) |
| `rating` / `numReviews` | Number | Sistema de calificaciones |

---

### 2. Configurador Premium ⚡

Activado por producto con el flag `isCustomizable`. Es un flujo por pasos en la página del producto.

**Funcionalidades:**
- **Upsells dinámicos:** Material Premium, Tamaño 150%, Acabado pintado a mano → cada opción suma automáticamente al precio
- **Previsualización en tiempo real:** El texto grabado aparece sobre la imagen del producto con estilos dinámicos (neón, sombra, etc.)
- **Drag & Drop:** El cliente arrastra el texto dentro de la imagen para elegir la ubicación exacta del grabado
- **Sticky CTA móvil:** Barra adhesiva en la parte inferior en celular para no perder el botón de compra
- **Integración al carrito:** Los detalles de personalización (opciones elegidas + posición del grabado) se guardan en el campo `personalizationText` de la orden

---

### 3. Tienda con Filtros Avanzados (`/shop`)

**Filtros disponibles en el sidebar:**
- 🏷️ Toggle "Solo Ofertas"
- 📂 Categorías jerárquicas con subcategorías (acordeón animado)
- 💰 Deslizador de precio máximo
- 🧱 Material (chips dinámicos según productos existentes)
- 📏 Tamaño (chips dinámicos)
- ✨ Nivel de Personalización (Ninguna / Básica / Avanzada / Premium)
- 🔄 Botón "Limpiar filtros" con contador de filtros activos

**Ordenamiento:**
- Más Recientes / ⭐ Más Vendidos / Precio ↑ / Precio ↓ / Mejor Calificados

**Sincronización con URL:** Todos los filtros se reflejan en la URL, permitiendo compartir búsquedas exactas.

---

### 4. Home con Secciones Estratégicas

Orden basado en **psicología de ventas (Anclaje de Precio)**:

```
HERO SLIDER
    ↓
⭐ DESTACADOS   → Ancla el precio (producto más premium)
    ↓
🏷️ OFERTAS     → El gancho (fondo rojo suave, urgencia)
    ↓
🆕 NOVEDADES   → FOMO (trae clientes de vuelta)
    ↓
¿Por qué ZAMIS Print?  (Trust badges)
```

- Las secciones se pueblan automáticamente según los flags de los productos
- Si ningún producto tiene flag activo, las secciones muestran los productos más recientes como fallback (sin páginas vacías)

---

### 5. Tarjeta de Producto (ProductCard)

**Badges visuales automáticos:**
| Badge | Condición |
|---|---|
| ⭐ Destacado (ámbar) | `isFeatured: true` |
| 🆕 Nuevo (verde) | `isNewArrival: true` o creado hace < 14 días |
| -X% OFF (rojo) | `isOnSale: true` con `salePrice` definido |
| ⚡ PRO (morado) | `isCustomizable: true` |
| 🔷 3D (azul) | `model3D` disponible |

**Precio con tachado:** Cuando hay oferta activa, se muestra el precio original tachado.

**Material + Tamaño:** Chips informativos bajo el nombre del producto.

---

### 6. Navegación con Subcategorías

El menú lateral de la tienda es un árbol jerárquico:
- Nivel 1: Categorías (extraídas automáticamente de los productos)
- Nivel 2: Subcategorías con icono `↳` visual, acordeón animado con Framer Motion

**Estructura de categorías recomendada:**

| Categoría | Subcategorías |
|---|---|
| Figuras & Colección | Funkos, Anime & Gaming, Superhéroes, Miniaturas |
| Decoración & Hogar | Macetas, Lámparas, Porta Objetos, Arte 3D |
| Accesorios Personales | Llaveros, Joyería, Porta Tarjetas |
| Mascotas | Figuras, Accesorios Pet, Memorial |
| Regalos & Eventos | Cumpleaños, Bodas, Empresarial, Amor & Pareja |
| Premium ZAMIS | Bustos & Esculturas, Pintado a Mano, Resina HD |

---

### 7. Panel de Administrador (`/admin`)

**Gestión de Productos:**
- CRUD completo (Crear / Editar / Eliminar)
- Upload de imagen principal a Cloudinary
- Upload de galería (hasta 4 fotos)
- Upload de modelo 3D (.GLB)
- Nuevos campos de atributos: Material, Tamaño, Color, Medidas, Nivel de Personalización, Precio de Oferta
- Merchandising con 4 checkboxes: ⭐ Destacado · 🆕 Nueva llegada · 🏷️ En Oferta · ⚡ Configurador Premium

**Gestión de Órdenes:**
- Vista de todos los pedidos con datos del cliente
- Cambio de estado de la orden
- Detalle de personalización incluida en el pedido

---

### 8. Integración de Pagos (MercadoPago)

- Integrado en el flujo de Checkout
- Genera link de pago de MercadoPago al confirmar la orden
- Redirige al cliente al checkout seguro de MercadoPago
- Las variables de entorno están configuradas en Render.com

---

### 9. Identidad Visual y Branding

- **Logo oficial** ZAMIS Print en Header, Drawer móvil y Footer
- `mix-blend-multiply` CSS para renderizar el logo sin fondo blanco sobre cualquier superficie
- Navbar con altura ampliada (`h-24`) para dar más presencia al logo
- Paleta de colores morada/brand activa en toda la interfaz

---

### 10. Contacto por WhatsApp

- Botón flotante persistente en toda la tienda
- Número: **+57 310 787 8192**
- Mensaje predeterminado: *"¡Hola! Tengo una consulta sobre un producto de ZAMIS Print 🖨️"*
- Animación pulse verde + tooltip al hover

---

## 🔄 Flujo de la Plataforma (End-to-End)

```
Cliente → Llega al Home
         → Ve Destacados (precio ancla)
         → Ve Oferta → Entra al producto
         → Configura personalización (texto/imagen, opciones upsell)
         → Agrega al carrito con detalles de personalización
         → Checkout → Paga con MercadoPago
         → Admin recibe la orden con todos los detalles
         → Admin cambia estado y gestiona entrega
```

---

## 📁 Archivos Clave del Proyecto

| Archivo | Propósito |
|---|---|
| `backend/models/Product.js` | Schema completo con todos los campos |
| `backend/controllers/productController.js` | CRUD y lógica de productos |
| `frontend/src/pages/Home.jsx` | Secciones dinámicas del home |
| `frontend/src/pages/Shop.jsx` | Catálogo con filtros avanzados |
| `frontend/src/pages/ProductDetail.jsx` | Configurador Premium |
| `frontend/src/pages/AdminDashboard.jsx` | Panel de gestión |
| `frontend/src/components/ProductCard.jsx` | Tarjeta con todos los badges |
| `frontend/src/components/Navbar.jsx` | Navegación con logo y subcategorías |
| `frontend/src/components/WhatsAppButton.jsx` | Botón flotante WhatsApp |
| `frontend/public/images/logo.png` | Logo oficial de la marca |

---

## ✅ Estado Actual en Producción (30 Abr 2026)

- [x] Backend API respondiendo correctamente en Render
- [x] Frontend desplegado y visible en Vercel
- [x] Base de datos MongoDB Atlas conectada
- [x] Imágenes subiendo a Cloudinary
- [x] Productos con flags configurados (Destacado, Oferta, Nuevo)
- [x] Secciones del Home con orden estratégico activo
- [x] Filtros avanzados funcionando en la tienda
- [x] Logo de marca mostrándose correctamente
- [x] WhatsApp con número real
- [x] Configurador Premium disponible en productos habilitados

---

## 🚀 Próximos Pasos Sugeridos

1. **Testing E2E de pago:** Realizar una compra completa con tarjeta de prueba de MercadoPago
2. **Poblar el catálogo:** Agregar más productos con categorías/subcategorías de la estructura recomendada
3. **Reseñas de clientes:** Incentivar primeras reseñas para activar el rating en las tarjetas
4. **Email de confirmación:** Configurar la clave de Resend en Render para emails transaccionales
5. **SEO:** Agregar meta-descripciones únicas por categoría en Shop

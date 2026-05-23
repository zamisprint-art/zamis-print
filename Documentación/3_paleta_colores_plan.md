# Transformar Campo de Color a Paleta de Selección Interactiva

Actualmente el sistema tiene un campo de texto libre para "color". Como sugieres, reemplazar esto por una paleta de colores predefinida mejora dramáticamente la experiencia de usuario (tanto tuya como administrador, como la del cliente que compra).

## Propuesta de Funcionalidad

1. **Panel de Administrador (Tu lado):**
   - Eliminaremos el campo de texto libre "Color principal".
   - En su lugar, aparecerá una cuadrícula de opciones (con círculos o recuadros de colores).
   - Podrás seleccionar **varios colores** (ej: Negro, Azul, Multicolor) para indicar en qué colores está disponible ese producto.

2. **Detalle de Producto (Lado del cliente):**
   - Si el producto tiene colores configurados, aparecerá una sección "Selecciona un Color".
   - El usuario verá círculos con los colores disponibles y **deberá elegir uno** antes de añadir al carrito.

3. **Carrito y Pedidos:**
   - El carrito registrará el color elegido.
   - Si un cliente quiere el mismo producto en Rojo y en Azul, el carrito lo tratará como dos items separados para que no haya confusiones.
   - El color elegido aparecerá en tu panel de administrador, en los correos y en la orden.

## Proposed Changes

### Backend & Database
#### [MODIFY] `backend/models/Product.js`
- Cambiar el campo `color: String` a `colors: [{ type: String }]`.
- Mantendremos compatibilidad con los datos viejos migrándolos al vuelo o ignorando el campo `color` viejo.

#### [MODIFY] `backend/models/Order.js`
- Añadir el campo `selectedColor: String` dentro de la estructura de `orderItems` para saber qué color eligió el cliente en esa orden.

---

### Frontend

#### [MODIFY] `frontend/src/components/admin/ProductsTab.jsx`
- Reemplazar el `<input>` de texto por un componente de selección múltiple (botones/círculos) con la paleta de colores: `['Negro', 'Blanco', 'Gris', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Café', 'Multicolor', 'Transparente']`.
- Actualizar el estado `currentProduct.colors` al guardar.

#### [MODIFY] `frontend/src/store/useCartStore.js`
- Modificar la lógica de `addItem` para que la búsqueda de items existentes en el carrito sea por `product ID + selectedColor`. Así, añadir un producto Rojo no sobreescribe al mismo producto si ya estaba en Azul.

#### [MODIFY] `frontend/src/pages/ProductDetail.jsx`
- Añadir un estado local `selectedColor`.
- Renderizar la paleta de colores disponibles basándonos en `product.colors`.
- Validar que el usuario elija un color antes de llamar a `handleAddToCart`.

#### [MODIFY] `frontend/src/components/CartDrawer.jsx` & `frontend/src/pages/Cart.jsx`
- Mostrar el color seleccionado debajo del nombre del producto en el carrito.

## User Review Required
> [!IMPORTANT]
> - ¿Estás de acuerdo con la lista de colores propuesta (`Negro, Blanco, Gris, Rojo, Azul, Verde, Amarillo, Café, Multicolor, Transparente`) o quieres añadir/quitar alguno específico como "Dorado" o "Plateado"?
> - Revisa este plan y si todo suena bien, dame la confirmación para empezar a programar.

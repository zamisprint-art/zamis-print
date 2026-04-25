# ZAMIS Print - Portal de Clientes ("Mi Cuenta") 👤

Hemos añadido exitosamente el módulo público para tus compradores, dándoles una experiencia profesional de seguimiento sin comprometer tu Panel de Administrador.

## Características Añadidas

### 1. Botón "Mi Cuenta" en la Tienda
- Añadimos de vuelta el ícono de usuario al menú principal (junto al carrito de compras), pero ahora apunta a `/profile` y tiene el texto "Mi Cuenta".
- Esto encaja perfectamente en el diseño "StoreLayout" que armamos antes, sin mezclar los flujos.

### 2. Login y Registro Unificado
- Creamos la pantalla `CustomerLogin.jsx` (disponible en **`/login`**).
- Permite a clientes nuevos crear una cuenta (pidiendo Nombre, Correo y Contraseña).
- Permite a clientes existentes iniciar sesión.
- Si intentan entrar a `/profile` sin haber iniciado sesión, son redirigidos automáticamente aquí.

### 3. Panel "Mi Cuenta" (Trazabilidad)
- Creamos la pantalla `MyAccount.jsx`.
- **Datos del Cliente:** Muestra el nombre y correo del usuario a la izquierda, junto con el botón de "Cerrar Sesión".
- **Historial de Compras:** A la derecha, muestra una lista elegante de todas las compras realizadas por ese cliente.
- **Trazabilidad:** Muestra de forma clara (con los colores que ya definimos) el `Estado del Pedido` (Pendiente, En Producción, Enviado). Así el cliente puede entrar a revisar cómo va su Funko sin enviarte mensajes preguntando.

### 4. Backend Seguro
- Añadimos la ruta **`GET /api/orders/mine`** en Node.js.
- Esta ruta tiene un "candado" (`protect middleware`) que garantiza que un cliente solo pueda descargar de la base de datos sus propias compras, bloqueando cualquier intento de ver datos de otros clientes.

## ¿Cómo probarlo?

Tus servidores ya se actualizaron automáticamente.

1. Ve a **[http://localhost:5173/](http://localhost:5173/)** (La Tienda Pública).
2. Verás el botón **"Mi Cuenta"** arriba a la derecha. Dale clic.
3. Te pedirá iniciar sesión. Haz clic en el botón de **"Regístrate"** para crear un usuario de prueba (ej. `cliente@test.com`).
4. Al registrarte, entrarás al panel "Mis Compras". Como eres nuevo, te dirá que no tienes pedidos y te invitará a la tienda.
5. Haz una compra (agrega un producto y haz el Checkout).
6. Regresa a **"Mi Cuenta"**. ¡Verás tu pedido reflejado inmediatamente con estado "Pendiente"!

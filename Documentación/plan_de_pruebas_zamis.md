# 🧪 Plan de Pruebas Integrales — ZAMIS Print

Para asegurar que la plataforma sea 100% confiable antes de recibir tráfico masivo, debemos ejecutar **Pruebas End-to-End (E2E)**. Esto significa probar flujos completos simulando a un usuario real, en lugar de probar botones aislados.

Te propongo dividir las pruebas en **4 Flujos Críticos**:

---

## 1️⃣ Flujo del Cliente (E-commerce Core)
*Objetivo: Garantizar que un cliente puede navegar, elegir y comprar sin bloqueos.*

- [ ] **Navegación y Catálogo:**
  - [ ] Buscar un producto específico en la barra superior.
  - [ ] Filtrar productos por categorías en la página "Tienda".
  - [ ] Entrar al detalle de un producto y verificar que la galería de imágenes y el modelo 3D (si aplica) carguen correctamente.
- [ ] **Carrito de Compras:**
  - [ ] Agregar un producto normal al carrito.
  - [ ] Agregar un producto **personalizable** (asegurando que el texto/imagen adjunto se guarde).
  - [ ] Modificar cantidades en el carrito (sumar, restar, eliminar).
- [ ] **Checkout:**
  - [ ] Completar el formulario de envío validando campos obligatorios (nombre, dirección, ciudad).
  - [ ] Verificar que los costos de envío se sumen correctamente al total.
  - [ ] Confirmar la creación del pedido y verificar que llega el correo de "Pedido Confirmado" (Resend).

---

## 2️⃣ Flujo del Administrador (Backoffice)
*Objetivo: Validar que el panel de control permite operar el negocio sin errores.*

- [ ] **Inventario de Productos:**
  - [ ] Crear un producto de prueba con stock 2 y mínimo 5.
  - [ ] Verificar que aparezca la "Alerta Roja de Bajo Stock" en el panel.
  - [ ] Ajustar el stock manualmente y revisar si el historial de movimientos guarda quién lo hizo y por qué.
- [ ] **Materias Primas:**
  - [ ] Crear una materia prima (ej. "Filamento Negro").
  - [ ] Registrar un uso (salida) de material y verificar el saldo.
- [ ] **Gestión de Órdenes y Cobros:**
  - [ ] Entrar a la orden creada en el *Flujo 1*.
  - [ ] Cambiar el estado del pedido a "Enviado" (Debe llegar correo al cliente).
  - [ ] Cambiar el estado de cobro a "Pagado" (Debe reducir automáticamente el stock del producto vendido).
- [ ] **Reportes:**
  - [ ] Hacer clic en "Exportar Reporte" en la pestaña Cobros y verificar que el archivo CSV/Excel se descargue con los datos correctos.

---

## 3️⃣ Flujo de Pasarela de Pago (MercadoPago)
*Objetivo: Comprobar que el dinero entra y la orden se actualiza automáticamente.*

- [ ] **Pago Exitoso:**
  - [ ] Generar un pedido usando la credencial de `Test` de MercadoPago.
  - [ ] Pagar con tarjeta de prueba aprobada.
  - [ ] Validar que la orden cambie a estado `isPaid: true` sin que el admin intervenga.
- [ ] **Pago Fallido / Pendiente:**
  - [ ] Usar tarjeta de prueba rechazada y validar que el cliente recibe el mensaje de error adecuado y la orden no se marca como pagada.

---

## 4️⃣ UX/UI y Responsividad (Visual)
*Objetivo: Asegurar la calidad visual en diferentes pantallas.*

- [ ] **Móvil:** 
  - [ ] Navegar desde un celular (o simulador de Chrome).
  - [ ] Probar el menú de hamburguesa y verificar que el navbar se oculte bien al hacer scroll.
- [ ] **Tipografía y Estilos:** 
  - [ ] Confirmar que los tamaños estandarizados (H1, H2) no rompen textos largos en tarjetas de producto.

---

### 💡 ¿Cómo proceder?

Te propongo que **yo ejecute las pruebas de backend y lógica (simulando peticiones)**, y que **tú ejecutes el Flujo del Cliente y Admin visualmente en tu pantalla/celular**, anotando si sientes algo raro o lento.

¿Te parece bien si comenzamos hoy haciendo una **"Compra Fantasma"** (Flujo 1 y 2) para ver que todo encaje de principio a fin?

# Plan de Despliegue en Producción (Hosting Gratis) 🚀

Para publicar tu tienda ZAMIS Print sin costo mensual, utilizaremos la mejor combinación de servicios gratuitos disponibles hoy en día para aplicaciones MERN. 

Sin embargo, hay un **detalle técnico crucial**: los servidores gratuitos (como Render) tienen discos "efímeros". Esto significa que si subes imágenes o modelos 3D directamente al servidor, **se borrarán** cuando el servidor se reinicie. Para evitar esto, usaremos un servicio de almacenamiento en la nube gratuito.

## Arquitectura Recomendada

1. **Frontend (La página web): Vercel**
   - Es el rey indiscutible para aplicaciones React/Vite.
   - 100% gratis, ultrarrápido y se actualiza solo cada vez que subes código a GitHub.
2. **Backend (La lógica y base de datos): Render.com**
   - Alojaremos tu servidor Node.js aquí de forma gratuita.
   - Se conectará automáticamente a tu MongoDB Atlas (que ya usamos).
3. **Almacenamiento de Archivos (Imágenes y 3D): Cloudinary**
   - Servicio gratuito para guardar tus imágenes de productos y los archivos `.glb` (3D). 
   - Modificaremos el código del Backend para que, al crear un producto, el archivo se suba a Cloudinary en lugar de la carpeta local `/uploads`.

## Pasos a Implementar

### Fase 1: Refactorización de Almacenamiento (Cloudinary)
- Instalar dependencias en el backend (`cloudinary`, `multer-storage-cloudinary`).
- Modificar `backend/routes/uploadRoutes.js` para enviar los archivos a la nube en vez de al disco duro local.

### Fase 2: Configuración para Vercel y Render
- Ajustar `frontend/vite.config.js` para que apunte a la URL pública de Render (una vez creado).
- Asegurarnos de que el Backend lea correctamente el puerto desde el entorno de Render (`process.env.PORT`).

### Fase 3: Despliegue Manual (Tu parte)
- Te guiaré paso a paso para que crees tus cuentas en Vercel, Render y Cloudinary.
- Conectaremos tus repositorios de GitHub con estas plataformas con un par de clics.

> [!WARNING]
> **Revisión Requerida:** Para poder subir la app, es **estrictamente necesario** cambiar el sistema de subida de archivos a Cloudinary, de lo contrario tus productos perderán sus imágenes cada pocos días. ¿Apruebas que modifique el código del backend (`uploadRoutes.js`) para integrar Cloudinary? Si es así, te pediré que crees una cuenta gratuita allí.

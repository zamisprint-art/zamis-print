# ZAMIS Print - E-Commerce Platform

Plataforma premium de comercio electrónico para impresión 3D personalizada.

## 🛠 Requisitos Previos

Para ejecutar este proyecto en un nuevo computador, necesitas tener instalado:
1. **Node.js** (Versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
2. **Git** - [Descargar aquí](https://git-scm.com/)
3. **Un Editor de Código** (Se recomienda VS Code)

---

## 🚀 Guía de Instalación Rápida

Sigue estos pasos en orden para levantar el proyecto localmente en un computador nuevo:

### 1. Clonar el Repositorio
Abre tu terminal (o la de VS Code) y ejecuta:
```bash
git clone https://github.com/zamisprint-art/zamis-print.git
cd zamis-print
```

### 2. Instalar Dependencias del Backend
Abre una terminal, entra a la carpeta `backend` e instala los paquetes:
```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno (Backend)
Dentro de la carpeta `backend`, crea un archivo llamado `.env` y pega lo siguiente (solicita las contraseñas y llaves reales al administrador del sistema):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<USUARIO>:<CONTRASEÑA>@zamiscluster...
JWT_SECRET=tu_secreto_seguro_aqui
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu_token_aqui

# Correos (Resend)
RESEND_API_KEY=re_tu_llave_aqui
ADMIN_EMAIL=hola@zamisprint.com

# Cloudinary (Imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Instalar Dependencias del Frontend
Abre **otra pestaña de terminal nueva**, entra a la carpeta `frontend` e instala los paquetes:
```bash
cd frontend
npm install
```

### 5. Iniciar la Plataforma Localmente

Para ver tu tienda en vivo en tu computadora, debes correr **ambos servidores a la vez** (en dos terminales distintas):

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*(Debe salir: "Server running in development mode on port 5000" y "MongoDB Connected")*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*(Saldrá un enlace azul como `http://localhost:5173`, haz clic con Ctrl para abrir la tienda en tu navegador).*

---

## 🌐 Comandos para Producción (Vercel y Render)

Este proyecto está configurado para despliegue automático.
Cualquier cambio que guardes localmente y subas a GitHub, se actualizará solo en internet.

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

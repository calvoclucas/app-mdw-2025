# Altoque - Plataforma de Pedidos

**Materia:** Metodologías de Desarrollo Web 2025  
**Trabajo Final**  
**Integrantes:** Lucas Calvo, Aylen Rodriguez y German Tagliarini

---

## 📖 Descripción del Proyecto

Altoque es una aplicación web para la gestión de pedidos de empresas y tiendas. Permite a los usuarios registrarse, navegar por las empresas, ver productos, realizar pedidos y administrar su perfil. La app está dividida en **Frontend** y **Backend**, ambos alojados en la nube y comunicándose mediante APIs RESTful.

El proyecto cumple con la arquitectura **API REST** y utiliza **JWT** para la autenticación de usuarios.

---

## 🌐 URLs de despliegue

- **Frontend - Backend (Vercel)**: https://app-mdw-2025.vercel.app/

---

## ⚡ Funcionalidades implementadas

### Frontend
- Ruta pública que visualiza empresas y productos desde la base de datos.
- Ruta pública de login con validaciones de campos.
- Ruta privada para clientes y empresas con acceso solo si se inicia sesión:
  - CRUD de datos de perfil y productos (crear, leer, actualizar, eliminar)
  - Confirmación de eliminación mediante popup modal
- Dashboard con listado de empresas y búsqueda por nombre o producto
- Gestión de perfil: ver datos, cambiar contraseña, borrar cuenta (excepto invitados)
- Manejo de estado global con Redux Toolkit
- Manejo de usuarios invitados
- Logout que redirige al Home
- Notificaciones tipo toast para avisos de éxito/error
- Diseño responsivo y moderno con TailwindCSS
- Animaciones y feedback visual en botones y cards

### Backend
- Node.js + Express
- API RESTful para usuarios, empresas y productos
- Autenticación con JWT
- Validaciones con Joi
- Endpoints para:
  - Registro y login de usuarios
  - CRUD de empresas y productos
  - Cambios de contraseña y perfil
  - Eliminación de cuenta

---

## 🛠 Tecnologías utilizadas

### Frontend
- React + TypeScript
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios
- React Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Joi para validaciones
- JWT para autenticación

### Hosting
- Frontend y Backend desplegados en **Vercel**
- Base de datos **MongoDB Atlas**

---

## 🎯 Funcionalidad mínima requerida (para evaluación)

1. Visualización de datos desde la base de datos en ruta pública ✅
2. Login y registro con validaciones en Frontend y Backend ✅
3. Ruta privada con CRUD de datos (perfil, productos, pedidos) ✅
4. Popup de confirmación al eliminar datos ✅
5. Logout redirige a página pública ✅
6. Restricción de acceso a rutas privadas sin sesión iniciada ✅
7. Manejo de estado global con Redux ✅
8. Historial de commits y organización de código en Frontend y Backend ✅

---

## 👥 Integrantes

- Lucas Calvo  
- Aylen Rodriguez  
- German Tagliarini  

---

## 🔗 Links y documentación

- Repositorio: `https://github.com/calvoclucas/app-mdw-2025`

---

## 📌 Notas adicionales

- La aplicación maneja usuarios **invitados**, **clientes** y **empresas**, adaptando las vistas y permisos según el rol.
- El CRUD de productos y datos de perfil tiene validaciones en Frontend y Backend.
- Las operaciones críticas (como borrar cuenta o eliminar productos) requieren confirmación del usuario mediante modales.
- La comunicación entre Frontend y Backend se realiza mediante Axios y endpoints RESTful.


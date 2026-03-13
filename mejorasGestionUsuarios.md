# Mejoras para la Gestión de Usuarios

## Problemas actuales

### Seguridad
- `logout` solo borra la cookie en el frontend (`Cookies.remove`) pero **no llama al backend**. Si la cookie es `httpOnly` (como la configura el servidor), el frontend no puede borrarla — el usuario queda autenticado hasta que expire el token.
- `POST /register` no requiere `authRequired` — **cualquier persona sin sesión puede crear usuarios**. En un sistema de facturación interno esto es un hueco grave.
- El registro inicia sesión automáticamente (`setIsAuthenticated(true)` en `signup`), lo que es incoherente con el flujo de una aplicación donde solo un admin debería crear usuarios.

### Funcionalidad faltante
- No existe página para **listar usuarios** existentes.
- No existe forma de **eliminar o desactivar** un usuario.
- No existe forma de **cambiar contraseña**.
- No hay **roles** (admin vs. usuario normal) — todos los usuarios tienen el mismo acceso.

### UX / calidad
- El formulario de registro no valida **longitud mínima de contraseña** en el frontend.
- No hay **confirmación de contraseña** en el registro.
- Tras registrar un usuario exitosamente no hay feedback visible (sin mensaje de éxito, sin redirección clara).
- `SELECT *` en varios queries del controlador expone el hash de la contraseña innecesariamente.

---

## Mejoras priorizadas

| # | Mejora | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 1 | **Proteger `/register` con `authRequired`** — solo usuarios ya autenticados pueden crear otros | Seguridad crítica | Bajo |
| 2 | **Corregir `logout`** — llamar al endpoint `POST /logout` del backend para que limpie la cookie `httpOnly` | Seguridad alta | Bajo |
| 3 | **Separar registro del login automático** — registrar no debe iniciar sesión; redirigir al admin al listado de usuarios | Funcional | Bajo |
| 4 | **Página de listado de usuarios** — tabla con id, nombre, username, email y botón eliminar | Funcional | Medio |
| 5 | **Endpoint DELETE /usuario/:id** + confirmación en frontend | Funcional | Medio |
| 6 | **Cambio de contraseña** — formulario con contraseña actual + nueva + confirmación | Funcional | Medio |
| 7 | **Validación de contraseña en frontend** — mínimo 8 caracteres + campo de confirmación | UX | Bajo |
| 8 | **Quitar `SELECT *`** — seleccionar solo columnas necesarias (excluir `password`) | Seguridad menor | Bajo |
| 9 | **Roles básicos** — campo `rol` en tabla (`admin`/`operador`) para restringir acciones sensibles | Seguridad a futuro | Alto |

---

## Archivos involucrados

| Archivo | Relación |
|---------|----------|
| `server/src/controllers/auth.controller.js` | Lógica de registro, login, logout, verificación |
| `server/src/routes/auth.routes.js` | Rutas de autenticación — falta `authRequired` en `/register` |
| `client/src/context/AuthContext.jsx` | `logout` no llama al backend; `signup` inicia sesión automáticamente |
| `client/src/pages/RegisterPage.jsx` | Sin validación de contraseña ni confirmación; sin feedback de éxito |
| `client/src/pages/LoginPage.jsx` | Sin cambios urgentes |

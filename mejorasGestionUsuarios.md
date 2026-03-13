# Mejoras para la Gestión de Usuarios

## Estado de implementación

| # | Mejora | Impacto | Estado |
|---|--------|---------|--------|
| 1 | Proteger `/register` con `authRequired` | Seguridad crítica | ✅ Implementado |
| 2 | Corregir `logout` para limpiar cookie `httpOnly` en backend | Seguridad alta | ✅ Implementado |
| 3 | Separar registro del login automático | Funcional | ✅ Implementado |
| 4 | Página de listado de usuarios | Funcional | ✅ Implementado |
| 5 | Endpoint DELETE /usuario/:id + confirmación en frontend | Funcional | ✅ Implementado |
| 6 | Cambio de contraseña | Funcional | ✅ Implementado |
| 7 | Validación de contraseña en frontend | UX | ✅ Implementado |
| 8 | Quitar `SELECT *` | Seguridad menor | ✅ Implementado |
| 9 | Roles básicos (`admin` / `operador`) | Seguridad | ✅ Implementado |

---

## Detalle de cada mejora

### #1 — Proteger `/register` con `authRequired` + `requireAdmin`
**Problema:** `POST /register` era público — cualquier persona podía crear usuarios sin estar autenticada.
**Solución:** La ruta ahora requiere `authRequired` y `requireAdmin`. Solo usuarios con sesión activa y rol `admin` pueden crear nuevos usuarios.
**Archivo:** `server/src/routes/auth.routes.js`

---

### #2 — `logout` limpia la cookie en el backend
**Problema:** `logout` solo llamaba `Cookies.remove("token")` en el frontend, lo cual no funciona con cookies `httpOnly` configuradas por el servidor.
**Solución:** `logout` en `AuthContext` ahora hace `POST /logout` al backend (que ejecuta `res.clearCookie("token")`), y luego limpia el estado local en el bloque `finally`.
**Archivos:** `client/src/api/auth.js`, `client/src/context/AuthContext.jsx`

---

### #3 — Registro sin auto-login automático
**Problema:** `signup` llamaba `setIsAuthenticated(true)` inmediatamente después de registrar, iniciando sesión como el nuevo usuario recién creado.
**Solución:** `signup` ahora retorna `{ ok, data }` sin modificar el estado de autenticación. Tras el registro exitoso, `RegisterPage` muestra un mensaje de éxito y redirige al listado de usuarios (`/usuarios`).
**Archivos:** `client/src/context/AuthContext.jsx`, `client/src/pages/RegisterPage.jsx`

---

### #4 — Página de listado de usuarios
**Problema:** No existía forma de ver qué usuarios estaban registrados en el sistema.
**Solución:** Nueva página `UsuariosPage.jsx` accesible en `/usuarios`. Muestra tabla con ID, nombre completo, username, email, rol (badge de color) y botones de acción. Enlace "Nuevo usuario" visible solo para admins.
**Archivos nuevos:** `client/src/pages/UsuariosPage.jsx`
**Backend:** Nuevo endpoint `GET /usuarios` (authRequired + requireAdmin) en `auth.controller.js` y `auth.routes.js`

---

### #5 — Eliminar usuario
**Problema:** No existía forma de eliminar usuarios desde la aplicación.
**Solución:** Nuevo endpoint `DELETE /usuario/:id` protegido con `authRequired` + `requireAdmin`. El backend impide que un admin se elimine a sí mismo. En el frontend, el botón "Eliminar" aparece solo para admins y no se muestra sobre el propio usuario; solicita confirmación con `window.confirm` antes de proceder.
**Archivos:** `server/src/controllers/auth.controller.js`, `server/src/routes/auth.routes.js`, `client/src/pages/UsuariosPage.jsx`

---

### #6 — Cambio de contraseña
**Problema:** No existía forma de cambiar la contraseña de un usuario.
**Solución:** Nuevo endpoint `PUT /usuario/:id/password` (authRequired). Valida la contraseña actual con bcrypt antes de aplicar el cambio. Nueva página `CambiarPasswordPage.jsx` accesible desde el botón "Contraseña" en la tabla de usuarios, con campos: contraseña actual, nueva contraseña y confirmación.
**Archivos nuevos:** `client/src/pages/CambiarPasswordPage.jsx`
**Backend:** `server/src/controllers/auth.controller.js`, `server/src/routes/auth.routes.js`

---

### #7 — Validación de contraseña en frontend
**Problema:** El formulario de registro no validaba longitud mínima ni pedía confirmación de contraseña.
**Solución:** `RegisterPage` y `CambiarPasswordPage` validan mínimo 8 caracteres y tienen campo de confirmación con validación cruzada (`validate: val === watch("password")`).
**Archivos:** `client/src/pages/RegisterPage.jsx`, `client/src/pages/CambiarPasswordPage.jsx`

---

### #8 — Eliminar `SELECT *`
**Problema:** Varios queries usaban `SELECT *`, exponiendo el hash de la contraseña en respuestas y en memoria innecesariamente.
**Solución:** Se define la constante `COLUMNAS_USUARIO = "idUsuario, fullname, username, email, rol"` usada en todos los queries de consulta. El campo `password` solo se selecciona en `login` y `changePassword` donde es estrictamente necesario para comparación con bcrypt.
**Archivo:** `server/src/controllers/auth.controller.js`

---

### #9 — Roles básicos (`admin` / `operador`)
**Problema:** Todos los usuarios tenían el mismo nivel de acceso sin distinción de roles.
**Solución:**
- Nueva columna `rol` en la tabla `usuarios` (valores: `admin`, `operador`, default `operador`).
- El `rol` se incluye en el payload del JWT, en las respuestas de `login` y `verifyToken`, y en el estado del contexto.
- Nuevo middleware `requireAdmin` en `validateToken.js` que verifica `req.user.rol === "admin"`.
- Las rutas de gestión de usuarios (`/register`, `GET /usuarios`, `DELETE /usuario/:id`) requieren `requireAdmin`.
- En el frontend, `RegisterPage` incluye un selector de rol. `UsuariosPage` muestra el rol con badge de color y restringe acciones según el rol del usuario autenticado.

**⚠️ Migración de BD requerida:**
```sql
ALTER TABLE usuarios ADD COLUMN rol VARCHAR(20) NOT NULL DEFAULT 'operador';
UPDATE usuarios SET rol = 'admin' WHERE idUsuario = 1;
```

**Archivos:** `server/src/middlewares/validateToken.js`, `server/src/controllers/auth.controller.js`, `server/src/routes/auth.routes.js`, `server/src/schemas/auth.schema.js`, `client/src/pages/RegisterPage.jsx`, `client/src/pages/UsuariosPage.jsx`

---

## Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `server/src/middlewares/validateToken.js` | Agregado middleware `requireAdmin` |
| `server/src/controllers/auth.controller.js` | Reescrito: SELECT específicos, sin auto-login en register, endpoints getUsuarios / deleteUsuario / changePassword, rol en token |
| `server/src/routes/auth.routes.js` | Rutas protegidas, nuevas rutas de gestión |
| `server/src/schemas/auth.schema.js` | Agregado campo `rol` al schema de registro |
| `client/src/api/auth.js` | Agregadas `logoutRequest`, `getUsuariosRequest`, `deleteUsuarioRequest`, `changePasswordRequest` |
| `client/src/context/AuthContext.jsx` | `logout` llama al backend; `signup` sin auto-login; eliminada dependencia `js-cookie` |
| `client/src/pages/RegisterPage.jsx` | Confirmación de contraseña, validación mínimo 8 chars, selector de rol, redirección post-registro |
| `client/src/pages/UsuariosPage.jsx` | **Nuevo** — listado, eliminar con confirmación, acceso a cambio de contraseña |
| `client/src/pages/CambiarPasswordPage.jsx` | **Nuevo** — formulario de cambio de contraseña |
| `client/src/App.jsx` | Nuevas rutas `/usuarios` y `/usuario/:id/password` |

# ShopFlow - Panel de Administración E-commerce

Sistema de administración de comercio electrónico con control de acceso basado en roles. Incluye panel para administradores, supervisores y usuarios, con gestión de productos, pedidos, carrito de compras y facturación electrónica (CFDI 4.0).

## Roles

| Rol | Rutas | Acceso |
|-----|-------|--------|
| **Admin** | `/admin/*` | Dashboard, Usuarios, Productos, Pedidos (CRUD completo) |
| **Supervisor** | `/supervisor/*` | Dashboard, Productos (solo lectura), Pedidos |
| **Usuario** | `/user/*` | Tienda, Carrito, Pedidos, Datos Fiscales, Facturas |

### Credenciales de prueba

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Admin | `admin` | `Admin123!` |
| Supervisor | `moderator` | `Mod123!` |
| Usuario | `testuser` | `User123!` |

## Tecnologías

- **React 19** + **Vite 6**
- **Tailwind CSS 4**
- **React Router DOM 7**
- **Recharts** (gráficas)
- **Lucide React** (iconos)

## Scripts

```bash
npm run dev      # Servidor de desarrollo (puerto 5173)
npm run build    # Build de producción
npm run preview  # Vista previa del build
```

## API

El frontend se conecta a un backend en `http://localhost:4000` mediante un proxy de Vite. Usa autenticación JWT con renovación automática de tokens.

## Estructura

```
src/
├── api/client.js        # Cliente HTTP con JWT
├── context/AuthContext   # Contexto de autenticación
├── components/           # Layout, Sidebar, ProtectedRoute
└── pages/
    ├── admin/            # Dashboard, Usuarios, Productos, Pedidos
    ├── supervisor/       # Dashboard, Productos (read-only), Pedidos
    └── user/             # Tienda, Carrito, Pedidos, Datos Fiscales, Facturas
```
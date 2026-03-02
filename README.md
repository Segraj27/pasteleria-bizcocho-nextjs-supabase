# Pastelería El Bizcocho

## Descripción del Proyecto

Sistema de gestión de pedidos desarrollado con Next.js y Supabase.
Este repositorio incluye la implementación del módulo API para la gestión de pedidos.

---

## Tecnologías utilizadas

- Next.js (App Router)
- TypeScript
- Supabase
- PostgreSQL
- Autenticación JWT
- Row Level Security (RLS)

---

## Endpoints de la API

### Crear pedido

POST /api/pedidos

Body ejemplo:

{
"pastel_id": "uuid",
"cantidad": 2,
"mensaje_personalizado": "Feliz cumpleaños"
}

---

### Eliminar pedido

DELETE /api/pedidos/{id}

---

### Actualizar estado del pedido (Solo Admin)

PATCH /api/pedidos/{id}

Body ejemplo:

{
"estado": "entregado"
}

Requiere:

- Usuario autenticado
- Rol admin

---

## Seguridad implementada

- Validación de sesión
- Validación de rol admin
- Políticas RLS en base de datos
- Manejo de errores HTTP (400, 401, 403, 500)

---

## Cómo ejecutar el proyecto

1. Clonar repositorio
2. Ejecutar:

npm install

3. Crear archivo .env basado en .env.example

4. Ejecutar:

npm run dev

---

## Autor

Sebastián Grajales

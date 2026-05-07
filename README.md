# Delivery Food

## Configuración de Firebase

La app usa credenciales reales de Firebase mediante variables de entorno de Vite. Copia `.env.example` a `.env` y completa los valores del proyecto:

```bash
cp .env.example .env
```

Variables requeridas:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Variable opcional:

- `VITE_WHATSAPP_BUSINESS_NUMBER`

## Authentication

En Firebase Console habilita:

1. **Authentication > Sign-in method > Google**
2. **Authentication > Sign-in method > Email/Password**

La ruta `/admin` soporta login con Google o correo/contraseña y muestra el avatar, nombre y correo del usuario autenticado en la barra superior.

## Reglas de Firestore

El archivo `firestore.rules` deja la colección `products` en solo lectura pública y restringe las escrituras a usuarios autenticados:

```bash
firebase deploy --only firestore:rules
```

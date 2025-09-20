Blockbuster

Aplicación móvil para comprar películas, inspirada en Blockbuster.

Soy Carlos Gonzalez, estudiante de programación. Este proyecto es parte de mi aprendizaje con React Native + Expo y Redux Toolkit.

Funcionalidades
- Navegación por categorías y listado de productos
- Carrito de compras con actualización de cantidades
- Registro e inicio de sesión
- Persistencia opcional de sesión en el dispositivo (SQLite)
- Confirmación de compra y listado de órdenes por usuario
- Perfil con foto y ubicación

Tecnologías
- Expo (React Native)
- Redux Toolkit + RTK Query
- Firebase Realtime Database
- Expo SQLite, Image Picker, Location

Ejecutar
1. Copiar .env con las variables públicas de Firebase
2. Instalar dependencias: npm install
3. Iniciar la app: npm run start

Notas
- Las órdenes se consultan por user/localId y se muestran primero las más recientes.
- Reglas en RTDB: indexar orders por user/localId.


Proyecto Backend III – Entrega 1 (Mocks)
Este proyecto (Node.js + Express + MongoDB) agrega un router de mocks para generar usuarios y mascotas de prueba, insertar datos en la base y verificar los registros vía endpoints. Se reutiliza la arquitectura del proyecto base (controllers, services, repositories, models/DTOs).

Requisitos previos
Antes de comenzar, asegúrate de tener instalado:
- Node.js (v18 o superior recomendado)
- MongoDB en ejecución local (o conexión a Mongo Atlas)
- Git
- Postman o Thunder Client (para probar los endpoints)

Instalación
Clona tu repositorio desde GitHub:
git clone <URL-de-tu-repo>

Ingresa en la carpeta del proyecto:
cd <carpeta-del-proyecto>

Instala las dependencias:
npm install

Crea un archivo .env en la raíz del proyecto con el siguiente contenido (ejemplo con Mongo local):
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/adoptme
# Si usás Atlas, reemplazá por tu cadena: mongodb+srv://<user>:<pass>@<cluster>/adoptme

Inicia el servidor:
npm start

El servidor quedará corriendo en:
http://localhost:8080

Endpoints principales
Health
GET /health → Verifica que la app esté levantada (OK)

Mocks (preview, no insertan en la base)
GET /api/mocks/mockingusers → Genera 50 usuarios (usar ?count=N para cantidad variable)
GET /api/mocks/mockingpets → Genera 20 mascotas (usar ?count=N para cantidad variable)

Generación e inserción en base
POST /api/mocks/generateData → Inserta registros en MongoDB
Body (JSON en EN): { "users": 10, "pets": 5 }
Body (JSON en ES, si tu implementación lo acepta): { "usuarios": 10, "mascotas": 5 }
Respuesta esperada (ejemplo EN): { "status": "success", "inserted": { "users": 10, "pets": 5 } }

Verificación de inserción
GET /api/users → Listado de usuarios insertados (con _id)
GET /api/pets → Listado de mascotas insertadas (con _id)

Pruebas en Postman
1) GET /health
2) GET /api/mocks/mockingusers y GET /api/mocks/mockingpets (solo vista, no insertan)
3) POST /api/mocks/generateData con Body JSON { "users": 10, "pets": 5 } y header Content-Type: application/json
4) GET /api/users y GET /api/pets para confirmar los documentos en la base

Notas
- La carpeta node_modules y el archivo .env están ignorados en .gitignore.
- El proyecto está configurado para trabajar con MongoDB local (MONGO_URL), pero podés usar Atlas ajustando la cadena de conexión.
- Los usuarios generados por mocks cumplen con: password “coder123” encriptada (bcrypt), role “user|admin”, pets como array vacío.
- Si cambiaste nombres de campos en tus modelos (por ejemplo species vs. specie), ajustá el generador de mocks para que coincida con tus schemas.

Troubleshooting
- Error de conexión / MongoParseError: revisá que MONGO_URL sea correcto (local: mongodb://127.0.0.1:27017/adoptme; Atlas: mongodb+srv://.../adoptme) y que tu Mongo esté corriendo.
- Error 500 al insertar en /generateData: suele ser por diferencias entre campos del mock y tus Schemas.
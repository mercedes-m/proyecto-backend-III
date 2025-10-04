Proyecto Backend III – Entrega 1 (Mocks)

Este proyecto (Node.js + Express + MongoDB) agrega un router de mocks para generar usuarios y mascotas de prueba, insertar datos en la base y verificar los registros vía endpoints. Se reutiliza la arquitectura del proyecto base (controllers, services, repositories, models/DTOs).

Requisitos previos

Node.js (v18 o superior recomendado)
MongoDB en ejecución local (o conexión a Mongo Atlas)
Git
Postman o Thunder Client (para probar los endpoints)

Instalación
Clona tu repositorio desde GitHub: git clone <https://github.com/mercedes-m/proyecto-backend-III>
Ingresa en la carpeta del proyecto: cd <proyecto-backend-III>
Instala las dependencias: npm install

Variables de entorno (.env)
Crear un archivo .env en la raíz del proyecto (mismo nivel que package.json) con:
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/adoptme
Si usás Atlas, reemplazá por: MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>/adoptme

Iniciar el servidor
Comando: npm start
La app queda en: http://localhost:8080
Healthcheck: GET /health → OK

Endpoints principales
Mocks (preview, no insertan en la base):
GET /api/mocks/mockingusers → genera 50 usuarios (usar ?count=N para variar)
GET /api/mocks/mockingpets → genera 20 mascotas (usar ?count=N para variar)
Los usuarios mock incluyen: password de “coder123” encriptada (bcrypt), role (user | admin) y pets: []

Generación e inserción en base:
POST /api/mocks/generateData → inserta registros en MongoDB
Body EN: { "users": 10, "pets": 5 }
Body ES (si tu implementación lo acepta): { "usuarios": 10, "mascotas": 5 }
Respuesta esperada (ejemplo EN): { "status": "success", "inserted": { "users": 10, "pets": 5 } }

Verificación de inserción:
GET /api/users → lista usuarios insertados (con _id)
GET /api/pets → lista mascotas insertadas (con _id)

Pruebas en Postman (o Thunder Client)
GET /health
GET /api/mocks/mockingusers y GET /api/mocks/mockingpets (solo vista, no insertan)
POST /api/mocks/generateData con Body JSON { "users": 10, "pets": 5 } y header Content-Type: application/json
GET /api/users y GET /api/pets para confirmar los documentos en la base
Nota: si repetís el POST /generateData, se acumulan documentos; para resetear, hacé Drop de las colecciones en Compass.

Notas
Asegurate de que .gitignore incluya: node_modules/ y .env
El proyecto está configurado para Mongo local (MONGO_URL), pero podés usar Atlas cambiando la cadena.
Si cambiaste nombres de campos en tus modelos (por ejemplo species vs. specie), ajustá el generador de mocks para que coincida con tus schemas.

Troubleshooting
Error de conexión / MongoParseError: verificá que MONGO_URL sea correcto (local: mongodb://127.0.0.1:27017/adoptme; Atlas: mongodb+srv://<user>:<pass>@<cluster>/adoptme) y que Mongo esté corriendo.
Error 500 al insertar en /generateData: suele deberse a diferencias entre campos del mock y tus Schemas (mismatch de nombres o required). Ajustá utils/mocking.js para alinearlo con tus modelos.
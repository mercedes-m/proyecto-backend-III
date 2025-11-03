# Proyecto Backend III – Entrega 1 (Mocks)

Este proyecto (Node.js + Express + MongoDB) agrega un router de **mocks** para generar **usuarios** y **mascotas** de prueba, **insertar** datos en la base y **verificar** los registros vía endpoints. Reutiliza la arquitectura del proyecto base (controllers, services, repositories, models/DTOs).

## Requisitos previos
- Node.js (v18 o superior recomendado)  
- MongoDB en ejecución local (o Mongo Atlas)  
- Git  
- Postman o Thunder Client (para probar endpoints)

## Instalación
1. Clonar el repositorio: `git clone https://github.com/mercedes-m/proyecto-backend-III`  
2. Ingresar a la carpeta: `cd proyecto-backend-III`  
3. Instalar dependencias: `npm install`

## Variables de entorno (.env)
Crear un archivo **.env** en la **raíz** del proyecto (mismo nivel que `package.json`) con:
- `PORT=8080`  
- `MONGO_URL=mongodb://127.0.0.1:27017/adoptme`  
- (Si usás Atlas) `MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>/adoptme`

## Iniciar el servidor
- Comando: `npm start`  
- La app queda en: `http://localhost:8080`  
- Healthcheck: `GET /health` → **OK**

## Endpoints principales
**Mocks (preview, no insertan en la base)**  
- `GET /api/mocks/mockingusers` → genera 50 usuarios (usar `?count=N` para variar)  
- `GET /api/mocks/mockingpets` → genera 20 mascotas (usar `?count=N` para variar)  
- Los usuarios mock incluyen: password **“coder123”** encriptada (bcrypt), `role` (`user` | `admin`) y `pets: []`.

**Generación e inserción en base**  
- `POST /api/mocks/generateData` → inserta registros en MongoDB  
  - Body (EN): `{ "users": 10, "pets": 5 }`  
  - Body (ES, si tu implementación lo acepta): `{ "usuarios": 10, "mascotas": 5 }`  
  - Respuesta esperada (EN): `{ "status": "success", "inserted": { "users": 10, "pets": 5 } }`

**Verificación de inserción**  
- `GET /api/users` → lista usuarios insertados (con `_id`)  
- `GET /api/pets`  → lista mascotas insertadas (con `_id`)

## Pruebas en Postman (o Thunder Client)
1. `GET /health`  
2. `GET /api/mocks/mockingusers` y `GET /api/mocks/mockingpets` (solo vista, no insertan)  
3. `POST /api/mocks/generateData` con body `{ "users": 10, "pets": 5 }` y header `Content-Type: application/json`  
4. `GET /api/users` y `GET /api/pets` para confirmar los documentos en la base  
**Nota**: Si repetís `POST /generateData`, se **acumulan** documentos. Para “resetear”, hacé **Drop** de las colecciones en Compass.

## Notas
- Asegurate de que `.gitignore` incluya: `node_modules/` y `.env`.  
- El proyecto está configurado para Mongo local (`MONGO_URL`), pero podés usar Atlas cambiando la cadena.  
- Si cambiaste nombres de campos en tus modelos (por ejemplo `species` vs. `specie`), ajustá `utils/mocking.js` para que coincida con tus schemas.

## Troubleshooting
- **Error de conexión / MongoParseError**: verificá que `MONGO_URL` sea correcto  
  - Local: `mongodb://127.0.0.1:27017/adoptme`  
  - Atlas: `mongodb+srv://<user>:<pass>@<cluster>/adoptme`  
  y que Mongo esté corriendo.  
- **Error 500 al insertar en `/generateData`**: suele ser por diferencias entre campos del mock y tus Schemas (mismatch de nombres o `required`). Ajustá `utils/mocking.js` para alinearlo con tus modelos.

## Tests (Mocha + Chai + Supertest + NYC)
1. Ejecutar tests: npm test
2. Ver reporte de cobertura: npm run coverage:report (genera carpeta coverage/)
3. DB de prueba: crear .env.test en la raíz con `MONGO_URL=mongodb://127.0.0.1:27017/adoptme_test` y `PORT=8081` (los tests usan NODE_ENV=test).
**Nota**: la carpeta test/ está en el repositorio (no está en `.gitignore`) para la corrección. En la imagen Docker, test/ se omite vía .dockerignore.

## Swagger (Users)
- Documentación en vivo: `http://localhost:8080/api/docs`
- Incluye al menos: `GET /api/users`, `POST /api/users`, `GET /api/users/{uid}` (más endpoints según disponibilidad).
- Recomendado: probar desde la UI de Swagger con “Try it out”.

## Docker (build, run, push)
- Build local: `docker build -t mercedes79/adoptme:latest` .
- Run local (usa Mongo local): `docker run --name adoptme -p 8080:8080 -e` `MONGO_URL="mongodb://host.docker.internal:27017/adoptme" mercedes79/adoptme:latest`
- Probar en navegador: `http://localhost:8080/health` y `http://localhost:8080/api/docs`
- Detener contenedor: docker stop adoptme
- Eliminar contenedor: docker rm adoptme
- Login a Docker Hub: docker login
- Push de la imagen: docker push `mercedes79/adoptme:latest`
- Imagen pública en Docker Hub (pull directo): `https://hub.docker.com/r/mercedes79/adoptme` — comando: `docker pull mercedes79/adoptme:latest`

## Notas de Docker para la corrección
- En .dockerignore se excluyen node_modules, .env, .env.test, test, coverage, .git*, etc., para imágenes más livianas.
- Los tests se corren desde el repositorio (no dentro de la imagen). La imagen está pensada para ejecución de la app.

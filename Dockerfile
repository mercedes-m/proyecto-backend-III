# 1) Imagen base
FROM node:20-alpine

# 2) Carpeta de trabajo
WORKDIR /app

# 3) Instalar dependencias (cache-friendly)
COPY package*.json ./
# En package-lock.json, npm ci; si no, cambiar a: npm install --omit=dev
RUN npm ci --omit=dev

# 4) Copiar solo el código necesario
COPY src ./src

# 5) Variables por defecto (se puede sobreescribir con -e)
ENV NODE_ENV=production
ENV PORT=8080

# 6) Exponer puerto
EXPOSE 8080

# 7) Comando de inicio
CMD ["node", "src/app.js"]
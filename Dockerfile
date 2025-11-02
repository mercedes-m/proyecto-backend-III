# 1) Imagen base
FROM node:20-alpine

# 2) Carpeta de trabajo
WORKDIR /app

# 3) Copiar package*.json y instalar deps (cache-friendly)
COPY package*.json ./
RUN npm ci --omit=dev

# 4) Copiar el resto del código
COPY . .

# 5) Variables por defecto (podés sobreescribir con -e)
ENV NODE_ENV=production
ENV PORT=8080

# 6) Exponer puerto
EXPOSE 8080

# 7) Comando de inicio
CMD ["npm", "start"]
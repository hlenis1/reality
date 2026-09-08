# Fase de build con Node 20
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias primero
COPY package*.json ./

RUN npm install

# Copiar el resto del código
COPY . .

RUN npm run build

# Fase final: servidor web con nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

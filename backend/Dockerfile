# Permite usar una imagen base. Además crea una etapa nueva
FROM node:22.18.0-alpine as base

# Establece el directorio de trabajo desde el que se ejecuta la app
WORKDIR /app

# Copia todo el contenido de la máquina local en la carpeta app
COPY . /app

# Instala pnpm en el contenedor
RUN npm install -g pnpm@latest-10

RUN pnpm install

RUN ["pnpm", "build"]

# ETAPA DE PRODUCCIÓN
FROM node:22.18.0-alpine

# Copia de la etapa base a producción, la etapa de base deja de existir
COPY --from=base /app/dist /app/package.json /app/.env /app/pnpm-lock.yaml /app/

WORKDIR /app

RUN npm install -g pnpm@latest-10

RUN pnpm install -P

EXPOSE 3000

CMD [ "pnpm", "prod" ]
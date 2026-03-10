# Permite usar una imagen base. Además crea una etapa nueva
FROM node:22.18.0-alpine as base

# Establece el directorio de trabajo desde el que se ejecuta la app
WORKDIR /app/api

# Copia todo el contenido de la máquina local en la carpeta app
COPY . /app/api

# Instala pnpm en el contenedor
RUN npm install -g pnpm@latest-10

RUN pnpm install

RUN ["pnpm", "build"]

# ETAPA DE PRODUCCIÓN
FROM node:22.18.0-alpine

# Copia de la etapa base a producción, la etapa de base deja de existir
COPY --from=base /app/api/dist /app/api/dist/src
COPY --from=base /app/api/package.json /app/api/pnpm-lock.yaml /app/api/

WORKDIR /app/api

RUN npm install -g pnpm@latest-10

RUN pnpm install -P

EXPOSE 3000

CMD [ "pnpm", "prod" ]
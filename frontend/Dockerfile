# Permite usar una imagen base. Además crea una etapa nueva
FROM node:22.18.0-alpine as base

# Establece el directorio de trabajo desde el que se ejecuta la app
WORKDIR /app

# Copia todo el contenido de la máquina local en la carpeta app
COPY . /app

# Instala pnpm en el contenedor
RUN npm install -g pnpm@latest-10

# Instala dependencias del proyecto
RUN pnpm install

# Compila los archivos con la bandera para las variables de entorno en producción
RUN pnpm build --configuration=production

# Etapa producción
FROM nginx:alpine

# Copia de la etapa base a producción, a un servidor nginx. Se pone la url /usr/share/nginx/html al ser la url por defecto de nginx en nginx.conf
# Véase la documentación de la imagen oficial de Nginx. También: https://stackoverflow.com/questions/47583236/how-to-serve-html-files-from-a-nginx-server-using-docker
COPY --from=base /app/dist/frontend/browser /usr/share/nginx/html
COPY --from=base /app/package*.json /usr/share/nginx/html

EXPOSE 80
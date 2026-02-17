# Extract Data From CSV

Monorrepo de pnpm hecho con Angular, Node y Typescript. Permite cargar un archivo .csv, extraer datos del mismo y guardarlos en base de datos.

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/Juanlu3095/extract-data-from-csv.git
```

Instala pnpm en tu pc:

```bash
npm install -g pnpm@latest-10
```

Instala las dependencias:

```bash
pnpm install
```

## Ejecutar aplicación

El proyecto está configurado con pnpm workspace, lo que permite ejecutar tanto frontend como backend con un solo comando:

```bash
pnpm --filter "**" dev
```
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

## Testing

En el frontend se usa Jasmine y karma para los tests. Puedes usar el siguiente comando para ejecutarlos:

```bash
pnpm --filter "frontend" test
```

También puedes ejecutar un test en concreto usando "url_del_test" para la url del test desde la raíz de la carpeta frontend:

```bash
pnpm --filter "frontend" test --include=[url_del_test]
```

Por su parte, el backend utiliza Jest y Supertest. Debes crear un archivo .env.testing en la raíz de backend con la configuración de la base 
de datos para tests. Puedes usar el archivo .env.example como plantilla.

```bash
pnpm --filter "backend" test
```

También puedes ejecutar usa el siguiente comando con el nombre del test en concreto:

```bash
pnpm --filter "backend" test nombre_del_test
```

También puedes usar el siguiente comando para ejecutar los test automáticamente cada vez que modificas los archivos:

```bash
pnpm --filter "backend" test:watch nombre_del_test
```
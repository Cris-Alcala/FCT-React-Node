# Zpecial

Bienvenido a **Zpecial**, un proyecto dividido en dos partes: **client** y **server**. A continuación, se describen los pasos necesarios para poner en marcha el proyecto.

## Requisitos previos

Asegúrate de tener instalados los siguientes requisitos en tu sistema:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Instrucciones de instalación y ejecución

### 1. Configuración del servidor

1. Accede a la carpeta del servidor:

    ```bash
    cd server
    ```

2. Instala las dependencias necesarias:

    ```bash
    npm install
    ```

3. Configura el archivo `.env`:

    - Crea un archivo `.env` en la carpeta `server` si aún no existe.
    - Añade la siguiente línea para configurar el puerto en el que deseas lanzar el servidor:

      ```env
      SERVER_PORT=tu_puerto_deseado
      ```

4. Inicia el servidor en modo de desarrollo:

    ```bash
    npm run dev
    ```

### 2. Configuración del cliente

1. Accede a la carpeta del cliente:

    ```bash
    cd client
    ```

2. Instala las dependencias necesarias:

    ```bash
    npm install
    ```

3. Configura el archivo `.env`:

    - Crea un archivo `.env` en la carpeta `client` si aún no existe.
    - Añade la siguiente línea para configurar la IP local de tu servidor:

      ```env
      VITE_ENDPOINT_SERVER=tu_ip_local_del_servidor
      ```

4. Inicia la aplicación cliente en modo de desarrollo:

    ```bash
    npm run dev
    ```

¡Y eso es todo! Ahora deberías tener **Zpecial** funcionando en tu máquina local.

## Licencia

Este proyecto está licenciado bajo los términos de la [Licencia MIT](LICENSE).

---

¡Gracias por usar **Zpecial**! Si tienes alguna pregunta o problema, no dudes en abrir un issue en el repositorio.

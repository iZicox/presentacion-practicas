
## Estructura del .dev.vars

´´´
REGISTRATION_KEY="TU_CLAVE_EXISTENTE"
APP_ORIGIN="http://localhost:5173"
JWT_SECRET="TU_SECRETO_ACCESS_EXISTENTE"
JWT_REFRESH_SECRET="UN_NUEVO_SECRETO_ALEATORIO"
COOKIE_SECURE="false"
´´´

Para generar los codigos para encriptar

´´´bash
openssl rand -hex 32
´´´

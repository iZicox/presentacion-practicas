// Punto único de acceso a los datos del CRM. El frontend nunca accede a D1:
// siempre pasa por aquí (prototipo) o por el Worker de Express (backend).
//
// PROTOTIPO: todavía no existe backend. `api` apunta a la implementación en
// memoria con datos ficticios (services/mockApi.ts), de modo que la interfaz
// se comporta igual que lo hará contra el Worker de Express.
//
// Al conectar el backend: crear un módulo `realApi` que haga fetch a /api/...
// (ver "API propuesta" en AGENTS.md) con el mismo conjunto de funciones y
// devolver exactamente los mismos tipos; después, apuntar `api` a él.

import { ApiError } from './http'
import { mockApi } from './mockApi'

export { ApiError }

export const api = mockApi

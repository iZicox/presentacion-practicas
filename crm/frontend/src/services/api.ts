import type { ApiEnvelope, ApiErrorBody, Company } from '../types'

// Todas las peticiones HTTP se centralizan aquí.
// El frontend nunca accede a D1 directamente: solo habla con Express (/api/...).
const API_BASE = '/api'

/** Error normalizado para que las páginas puedan mostrar un mensaje claro. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor.')
  }

  if (!response.ok) {
    // Se muestra el mensaje genérico que devuelve el backend, nunca
    // detalles internos (consultas, errores de D1, etc.).
    let message = 'La solicitud no se ha completado correctamente.'
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body?.error?.message) {
        message = body.error.message
      }
    } catch {
      // Respuesta sin cuerpo JSON: se mantiene el mensaje genérico.
    }
    throw new ApiError(response.status, message)
  }

  const body = (await response.json()) as ApiEnvelope<T>
  return body.data
}

// Las operaciones se añaden etapa a etapa:
// listCompanies (Etapa 2), createCompany (Etapa 3), etc.
export const api = {
  listCompanies: () => request<Company[]>('/companies'),
}

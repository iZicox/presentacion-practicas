/**
 * Error normalizado de la capa de datos.
 * `fields` reproduce el contrato de error de la API propuesta:
 * { error: { code, message, fields? } }
 */
export class ApiError extends Error {
  readonly status: number
  readonly fields?: Record<string, string>

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

// Tipos del dominio del CRM.
// Reproducen los nombres de columna del esquema (UPPER_SNAKE_CASE) hasta que
// se defina el contrato definitivo de la API.

/** Catálogo de segmentos de empresa. */
export interface Segment {
  ID: number
  NAME: string
  DESCRIPTION: string | null
  CREATED_AT: string
}

/** Catálogo de estados comerciales (leads). */
export interface Status {
  ID: number
  NAME: string
  DESCRIPTION: string | null
  ORDER: number
  CREATED_AT: string
}

/** Catálogo de tipos de cliente. */
export interface ClientType {
  ID: number
  NAME: string
  DESCRIPTION: string | null
  CREATED_AT: string
}

/** Empresa o lead del CRM. */
export interface Company {
  ID: number
  NAME: string
  SEGMENT_ID: number | null
  STATUS_ID: number | null
  CLIENT_TYPE_ID: number | null
  EMAIL: string | null
  PHONE_NUMBER: string | null
  WEB: string | null
  NOTES: string | null
  CREATED_AT: string
  UPDATED_AT: string
}

/** Persona de contacto dentro de una empresa. */
export interface Contact {
  ID: number
  COMPANY_ID: number
  FIRST_NAME: string
  LAST_NAME: string
  JOB_TITLE: string | null
  EMAIL: string | null
  PHONE_NUMBER: string | null
  NOTES: string | null
  CREATED_AT: string
  UPDATED_AT: string
}

/** Registro de seguimiento comercial. */
export interface Interaction {
  ID: number
  COMPANY_ID: number
  CONTACT_ID: number | null
  DATE: string
  DESCRIPTION: string
  NOTES: string | null
  CREATED_AT: string
  UPDATED_AT: string
}

/** Compra individual: importe en céntimos y fecha YYYY-MM-DD. */
export interface Purchase {
  ID: number
  COMPANY_ID: number
  DATE: string
  AMOUNT_CENTS: number
  CREATED_AT: string
}

/** Envolvente de éxito de la API: { "data": ... } */
export interface ApiEnvelope<T> {
  data: T
}

/** Envolvente de error de la API: { "error": { code, message, fields? } } */
export interface ApiErrorBody {
  error: {
    code: string
    message: string
    fields?: Record<string, string>
  }
}

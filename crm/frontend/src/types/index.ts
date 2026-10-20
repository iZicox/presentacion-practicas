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

/** Datos de entrada para crear o editar una empresa. */
export interface CompanyInput {
  NAME: string
  SEGMENT_ID: number | null
  STATUS_ID: number | null
  CLIENT_TYPE_ID: number | null
  EMAIL: string | null
  PHONE_NUMBER: string | null
  WEB: string | null
  NOTES: string | null
}

/** Datos de entrada para crear o editar un contacto. */
export interface ContactInput {
  FIRST_NAME: string
  LAST_NAME: string
  JOB_TITLE: string | null
  EMAIL: string | null
  PHONE_NUMBER: string | null
  NOTES: string | null
}

/** Datos de entrada para crear o editar una interacción. */
export interface InteractionInput {
  CONTACT_ID: number | null
  DATE: string
  DESCRIPTION: string
  NOTES: string | null
}

/** Datos de entrada para crear o editar una compra. */
export interface PurchaseInput {
  DATE: string
  AMOUNT_CENTS: number
}

/**
 * Indicadores de compras de una empresa.
 * Corresponde a GET /api/companies/:id/purchase-summary.
 * Criterio: los importes agregan todo el historial; `LAST_PURCHASE_DATE`
 * también corresponde a todo el historial, no a un periodo filtrado.
 */
export interface PurchaseSummary {
  TOTAL_CENTS: number
  PURCHASE_COUNT: number
  AVERAGE_CENTS: number | null
  LAST_PURCHASE_DATE: string | null
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

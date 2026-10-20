// Implementación en memoria de la API del CRM para el prototipo.
//
// Permite que toda la interfaz funcione (listar, crear y editar) sin backend.
// Los datos viven solo en memoria: al recargar la página se restauran los
// valores iniciales de mockData.ts.
//
// Las reglas de validación imitan las que aplicará el backend: nombre
// obligatorio, formato de correo, referencias a catálogos existentes y, en
// interacciones, que el contacto pertenezca a la empresa indicada.

import type {
  ClientType,
  Company,
  CompanyInput,
  Contact,
  ContactInput,
  Interaction,
  InteractionInput,
  Purchase,
  PurchaseInput,
  PurchaseSummary,
  Segment,
  Status,
} from '../types'
import { MAX_PURCHASE_AMOUNT_CENTS } from '../utils/format'
import { ApiError } from './http'
import {
  seedClientTypes,
  seedCompanies,
  seedContacts,
  seedInteractions,
  seedPurchases,
  seedSegments,
  seedStatuses,
} from './mockData'

// ---------------------------------------------------------------------------
// Estado en memoria
// ---------------------------------------------------------------------------

const segments: Segment[] = seedSegments
const statuses: Status[] = seedStatuses
const clientTypes: ClientType[] = seedClientTypes
let companies: Company[] = seedCompanies
let contacts: Contact[] = seedContacts
let interactions: Interaction[] = seedInteractions
let purchases: Purchase[] = seedPurchases

/** Latencia simulada para que se vean los estados de carga. */
const LATENCY_MS = 250

function wait(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, LATENCY_MS)
  })
}

function nextId(rows: Array<{ ID: number }>): number {
  return rows.reduce((max, row) => Math.max(max, row.ID), 0) + 1
}

function nowIso(): string {
  return new Date().toISOString()
}

function clean(value: string | null | undefined): string | null {
  const trimmed = (value ?? '').trim()
  return trimmed ? trimmed : null
}

// ---------------------------------------------------------------------------
// Validación (misma forma de error que la API propuesta)
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) {
    return false
  }
  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

function validateEmail(value: string | null, fields: Record<string, string>): void {
  if (value && !EMAIL_RE.test(value)) {
    fields.EMAIL = 'El correo no tiene un formato válido.'
  }
}

function validateCatalogRef(
  field: string,
  id: number | null,
  catalog: Array<{ ID: number }>,
  fields: Record<string, string>,
): void {
  if (id !== null && !catalog.some((row) => row.ID === id)) {
    fields[field] = 'El valor seleccionado ya no está disponible.'
  }
}

function throwIfInvalid(fields: Record<string, string>): void {
  if (Object.keys(fields).length > 0) {
    throw new ApiError(400, 'Revisa los datos introducidos.', fields)
  }
}

function findCompany(id: number): Company {
  const company = companies.find((row) => row.ID === id)
  if (!company) {
    throw new ApiError(404, 'No existe ninguna empresa con ese identificador.')
  }
  return company
}

// ---------------------------------------------------------------------------
// Catálogos
// ---------------------------------------------------------------------------

async function listSegments(): Promise<Segment[]> {
  await wait()
  return segments.map((row) => ({ ...row }))
}

async function listStatuses(): Promise<Status[]> {
  await wait()
  return [...statuses]
    .sort((a, b) => a.ORDER - b.ORDER)
    .map((row) => ({ ...row }))
}

async function listClientTypes(): Promise<ClientType[]> {
  await wait()
  return clientTypes.map((row) => ({ ...row }))
}

// ---------------------------------------------------------------------------
// Empresas
// ---------------------------------------------------------------------------

async function listCompanies(): Promise<Company[]> {
  await wait()
  return [...companies]
    .sort((a, b) => a.NAME.localeCompare(b.NAME, 'es'))
    .map((row) => ({ ...row }))
}

async function getCompany(id: number): Promise<Company> {
  await wait()
  return { ...findCompany(id) }
}

function validateCompanyInput(input: CompanyInput): void {
  const fields: Record<string, string> = {}
  if (!input.NAME || !input.NAME.trim()) {
    fields.NAME = 'El nombre es obligatorio.'
  }
  validateCatalogRef('SEGMENT_ID', input.SEGMENT_ID, segments, fields)
  validateCatalogRef('STATUS_ID', input.STATUS_ID, statuses, fields)
  validateCatalogRef('CLIENT_TYPE_ID', input.CLIENT_TYPE_ID, clientTypes, fields)
  validateEmail(clean(input.EMAIL), fields)
  throwIfInvalid(fields)
}

async function createCompany(input: CompanyInput): Promise<Company> {
  await wait()
  validateCompanyInput(input)

  const timestamp = nowIso()
  const company: Company = {
    ID: nextId(companies),
    NAME: input.NAME.trim(),
    SEGMENT_ID: input.SEGMENT_ID,
    STATUS_ID: input.STATUS_ID,
    CLIENT_TYPE_ID: input.CLIENT_TYPE_ID,
    EMAIL: clean(input.EMAIL),
    PHONE_NUMBER: clean(input.PHONE_NUMBER),
    WEB: clean(input.WEB),
    NOTES: clean(input.NOTES),
    CREATED_AT: timestamp,
    UPDATED_AT: timestamp,
  }
  companies = [...companies, company]
  return { ...company }
}

async function updateCompany(id: number, input: CompanyInput): Promise<Company> {
  await wait()
  const current = findCompany(id)
  validateCompanyInput(input)

  const updated: Company = {
    ...current,
    NAME: input.NAME.trim(),
    SEGMENT_ID: input.SEGMENT_ID,
    STATUS_ID: input.STATUS_ID,
    CLIENT_TYPE_ID: input.CLIENT_TYPE_ID,
    EMAIL: clean(input.EMAIL),
    PHONE_NUMBER: clean(input.PHONE_NUMBER),
    WEB: clean(input.WEB),
    NOTES: clean(input.NOTES),
    UPDATED_AT: nowIso(),
  }
  companies = companies.map((row) => (row.ID === id ? updated : row))
  return { ...updated }
}

// ---------------------------------------------------------------------------
// Contactos
// ---------------------------------------------------------------------------

async function listContacts(companyId: number): Promise<Contact[]> {
  await wait()
  findCompany(companyId)
  return contacts
    .filter((row) => row.COMPANY_ID === companyId)
    .sort((a, b) => a.FIRST_NAME.localeCompare(b.FIRST_NAME, 'es'))
    .map((row) => ({ ...row }))
}

function validateContactInput(input: ContactInput): void {
  const fields: Record<string, string> = {}
  if (!input.FIRST_NAME || !input.FIRST_NAME.trim()) {
    fields.FIRST_NAME = 'El nombre es obligatorio.'
  }
  if (!input.LAST_NAME || !input.LAST_NAME.trim()) {
    fields.LAST_NAME = 'Los apellidos son obligatorios.'
  }
  validateEmail(clean(input.EMAIL), fields)
  throwIfInvalid(fields)
}

async function createContact(companyId: number, input: ContactInput): Promise<Contact> {
  await wait()
  findCompany(companyId)
  validateContactInput(input)

  const timestamp = nowIso()
  const contact: Contact = {
    ID: nextId(contacts),
    COMPANY_ID: companyId,
    FIRST_NAME: input.FIRST_NAME.trim(),
    LAST_NAME: input.LAST_NAME.trim(),
    JOB_TITLE: clean(input.JOB_TITLE),
    EMAIL: clean(input.EMAIL),
    PHONE_NUMBER: clean(input.PHONE_NUMBER),
    NOTES: clean(input.NOTES),
    CREATED_AT: timestamp,
    UPDATED_AT: timestamp,
  }
  contacts = [...contacts, contact]
  return { ...contact }
}

async function updateContact(id: number, input: ContactInput): Promise<Contact> {
  await wait()
  const current = contacts.find((row) => row.ID === id)
  if (!current) {
    throw new ApiError(404, 'No existe ningún contacto con ese identificador.')
  }
  validateContactInput(input)

  const updated: Contact = {
    ...current,
    FIRST_NAME: input.FIRST_NAME.trim(),
    LAST_NAME: input.LAST_NAME.trim(),
    JOB_TITLE: clean(input.JOB_TITLE),
    EMAIL: clean(input.EMAIL),
    PHONE_NUMBER: clean(input.PHONE_NUMBER),
    NOTES: clean(input.NOTES),
    UPDATED_AT: nowIso(),
  }
  contacts = contacts.map((row) => (row.ID === id ? updated : row))
  return { ...updated }
}

// ---------------------------------------------------------------------------
// Interacciones
// ---------------------------------------------------------------------------

async function listInteractions(companyId: number): Promise<Interaction[]> {
  await wait()
  findCompany(companyId)
  return interactions
    .filter((row) => row.COMPANY_ID === companyId)
    .sort((a, b) => (a.DATE === b.DATE ? b.ID - a.ID : a.DATE < b.DATE ? 1 : -1))
    .map((row) => ({ ...row }))
}

function validateInteractionInput(companyId: number, input: InteractionInput): void {
  const fields: Record<string, string> = {}
  if (!input.DESCRIPTION || !input.DESCRIPTION.trim()) {
    fields.DESCRIPTION = 'La descripción es obligatoria.'
  }
  if (!input.DATE) {
    fields.DATE = 'Indica la fecha de la interacción.'
  } else if (!isValidDate(input.DATE)) {
    fields.DATE = 'La fecha no es válida.'
  }
  if (input.CONTACT_ID !== null) {
    const contact = contacts.find((row) => row.ID === input.CONTACT_ID)
    if (!contact) {
      fields.CONTACT_ID = 'El contacto seleccionado no existe.'
    } else if (contact.COMPANY_ID !== companyId) {
      fields.CONTACT_ID = 'El contacto no pertenece a esta empresa.'
    }
  }
  throwIfInvalid(fields)
}

async function createInteraction(companyId: number, input: InteractionInput): Promise<Interaction> {
  await wait()
  findCompany(companyId)
  validateInteractionInput(companyId, input)

  const timestamp = nowIso()
  const interaction: Interaction = {
    ID: nextId(interactions),
    COMPANY_ID: companyId,
    CONTACT_ID: input.CONTACT_ID,
    DATE: input.DATE,
    DESCRIPTION: input.DESCRIPTION.trim(),
    NOTES: clean(input.NOTES),
    CREATED_AT: timestamp,
    UPDATED_AT: timestamp,
  }
  interactions = [...interactions, interaction]
  return { ...interaction }
}

async function updateInteraction(id: number, input: InteractionInput): Promise<Interaction> {
  await wait()
  const current = interactions.find((row) => row.ID === id)
  if (!current) {
    throw new ApiError(404, 'No existe ninguna interacción con ese identificador.')
  }
  validateInteractionInput(current.COMPANY_ID, input)

  const updated: Interaction = {
    ...current,
    CONTACT_ID: input.CONTACT_ID,
    DATE: input.DATE,
    DESCRIPTION: input.DESCRIPTION.trim(),
    NOTES: clean(input.NOTES),
    UPDATED_AT: nowIso(),
  }
  interactions = interactions.map((row) => (row.ID === id ? updated : row))
  return { ...updated }
}

// ---------------------------------------------------------------------------
// Compras
// ---------------------------------------------------------------------------

async function listPurchases(companyId: number): Promise<Purchase[]> {
  await wait()
  findCompany(companyId)
  return purchases
    .filter((row) => row.COMPANY_ID === companyId)
    .sort((a, b) => (a.DATE === b.DATE ? b.ID - a.ID : a.DATE < b.DATE ? 1 : -1))
    .map((row) => ({ ...row }))
}

function validatePurchaseInput(input: PurchaseInput): void {
  const fields: Record<string, string> = {}
  if (!input.DATE) {
    fields.DATE = 'Indica la fecha de la compra.'
  } else if (!isValidDate(input.DATE)) {
    fields.DATE = 'La fecha no es válida.'
  }
  if (!Number.isInteger(input.AMOUNT_CENTS) || input.AMOUNT_CENTS < 0) {
    fields.AMOUNT_CENTS = 'El importe debe ser un número de céntimos no negativo.'
  } else if (input.AMOUNT_CENTS > MAX_PURCHASE_AMOUNT_CENTS) {
    fields.AMOUNT_CENTS = 'El importe supera el máximo admitido (10.000.000 €).'
  }
  throwIfInvalid(fields)
}

async function createPurchase(companyId: number, input: PurchaseInput): Promise<Purchase> {
  await wait()
  findCompany(companyId)
  validatePurchaseInput(input)

  const purchase: Purchase = {
    ID: nextId(purchases),
    COMPANY_ID: companyId,
    DATE: input.DATE,
    AMOUNT_CENTS: input.AMOUNT_CENTS,
    CREATED_AT: nowIso(),
  }
  purchases = [...purchases, purchase]
  return { ...purchase }
}

async function updatePurchase(id: number, input: PurchaseInput): Promise<Purchase> {
  await wait()
  const current = purchases.find((row) => row.ID === id)
  if (!current) {
    throw new ApiError(404, 'No existe ninguna compra con ese identificador.')
  }
  validatePurchaseInput(input)

  const updated: Purchase = {
    ...current,
    DATE: input.DATE,
    AMOUNT_CENTS: input.AMOUNT_CENTS,
  }
  purchases = purchases.map((row) => (row.ID === id ? updated : row))
  return { ...updated }
}

/**
 * Indicadores de compras de una empresa.
 * Criterio documentado: total, número y media corresponden a todo el
 * historial; `LAST_PURCHASE_DATE` también es la última compra histórica.
 * Sin compras: total y número a cero; media y fecha a null.
 */
async function getPurchaseSummary(companyId: number): Promise<PurchaseSummary> {
  await wait()
  findCompany(companyId)

  const rows = purchases.filter((row) => row.COMPANY_ID === companyId)
  if (rows.length === 0) {
    return { TOTAL_CENTS: 0, PURCHASE_COUNT: 0, AVERAGE_CENTS: null, LAST_PURCHASE_DATE: null }
  }

  const total = rows.reduce((sum, row) => sum + row.AMOUNT_CENTS, 0)
  const lastDate = rows.reduce((max, row) => (row.DATE > max ? row.DATE : max), rows[0].DATE)

  return {
    TOTAL_CENTS: total,
    PURCHASE_COUNT: rows.length,
    AVERAGE_CENTS: Math.round(total / rows.length),
    LAST_PURCHASE_DATE: lastDate,
  }
}

// ---------------------------------------------------------------------------

/** Superficie de API que consumen las páginas (mismo contrato que tendrá el backend). */
export const mockApi = {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  listSegments,
  listStatuses,
  listClientTypes,
  listContacts,
  createContact,
  updateContact,
  listInteractions,
  createInteraction,
  updateInteraction,
  listPurchases,
  createPurchase,
  updatePurchase,
  getPurchaseSummary,
}

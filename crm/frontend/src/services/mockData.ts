// Datos ficticios para la fase de prototipo (no hay backend todavía).
// Todo el contenido es inventado: nombres, correos y dominios de ejemplo.
// Las fechas son fijas para que el prototipo sea estable entre recargas.

import type {
  ClientType,
  Company,
  Contact,
  Interaction,
  Purchase,
  Segment,
  Status,
} from '../types'

const CATALOG_CREATED_AT = '2026-01-10T09:00:00Z'

export const seedSegments: Segment[] = [
  { ID: 1, NAME: 'Tecnología', DESCRIPTION: 'Software, servicios IT y electrónica.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 2, NAME: 'Industria y fabricación', DESCRIPTION: 'Producción, talleres y bienes de equipo.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 3, NAME: 'Servicios profesionales', DESCRIPTION: 'Consultoría, inmobiliario y otros servicios.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 4, NAME: 'Comercio minorista', DESCRIPTION: 'Tiendas y pequeños comercios.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 5, NAME: 'Hostelería y alimentación', DESCRIPTION: 'Restauración, alimentación y bebidas.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 6, NAME: 'Salud', DESCRIPTION: 'Clínicas, consultas y centros de salud.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 7, NAME: 'Educación', DESCRIPTION: 'Academias, colegios y editoriales.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 8, NAME: 'Transporte y logística', DESCRIPTION: 'Transporte de mercancías y almacenaje.', CREATED_AT: CATALOG_CREATED_AT },
]

export const seedStatuses: Status[] = [
  { ID: 1, NAME: 'Nuevo', DESCRIPTION: 'Lead recién incorporado, sin contacto aún.', ORDER: 1, CREATED_AT: CATALOG_CREATED_AT },
  { ID: 2, NAME: 'Contactado', DESCRIPTION: 'Ya existe una primera conversación.', ORDER: 2, CREATED_AT: CATALOG_CREATED_AT },
  { ID: 3, NAME: 'En negociación', DESCRIPTION: 'Propuesta enviada y en revisión.', ORDER: 3, CREATED_AT: CATALOG_CREATED_AT },
  { ID: 4, NAME: 'Cliente', DESCRIPTION: 'Cliente con compras registradas.', ORDER: 4, CREATED_AT: CATALOG_CREATED_AT },
  { ID: 5, NAME: 'Inactivo', DESCRIPTION: 'Sin actividad comercial desde hace tiempo.', ORDER: 5, CREATED_AT: CATALOG_CREATED_AT },
]

export const seedClientTypes: ClientType[] = [
  { ID: 1, NAME: 'Pyme', DESCRIPTION: 'Pequeña o mediana empresa.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 2, NAME: 'Mediana empresa', DESCRIPTION: 'Empresa consolidada de tamaño medio.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 3, NAME: 'Gran cuenta', DESCRIPTION: 'Cuenta estratégica con volumen alto.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 4, NAME: 'Autónomo', DESCRIPTION: 'Profesional por cuenta propia.', CREATED_AT: CATALOG_CREATED_AT },
  { ID: 5, NAME: 'Administración pública', DESCRIPTION: 'Entidad pública o consorcio.', CREATED_AT: CATALOG_CREATED_AT },
]

export const seedCompanies: Company[] = [
  {
    ID: 1, NAME: 'Panadería La Espiga', SEGMENT_ID: 5, STATUS_ID: 4, CLIENT_TYPE_ID: 1,
    EMAIL: 'pedidos@laespiga.example', PHONE_NUMBER: '+34 611 220 331', WEB: 'laespiga.example',
    NOTES: 'Cliente recurrente de packaging y etiquetas. Tiene prevista una ampliación del obrador para 2027.',
    CREATED_AT: '2025-11-12T10:15:00Z', UPDATED_AT: '2026-10-13T16:40:00Z',
  },
  {
    ID: 2, NAME: 'Talleres Roldán S.L.', SEGMENT_ID: 2, STATUS_ID: 4, CLIENT_TYPE_ID: 1,
    EMAIL: 'administracion@talleresroldan.example', PHONE_NUMBER: '+34 655 118 260', WEB: 'talleresroldan.example',
    NOTES: 'Taller de mecanizado de precisión. Suministro mensual de consumibles.',
    CREATED_AT: '2025-12-03T09:05:00Z', UPDATED_AT: '2026-09-29T11:20:00Z',
  },
  {
    ID: 3, NAME: 'Clínica Dental Sonrisa', SEGMENT_ID: 6, STATUS_ID: 2, CLIENT_TYPE_ID: 4,
    EMAIL: 'info@dentalsonrisa.example', PHONE_NUMBER: '+34 699 520 617', WEB: null,
    NOTES: 'Interesados en el plan de mantenimiento anual; comparan propuestas.',
    CREATED_AT: '2026-09-28T12:00:00Z', UPDATED_AT: '2026-10-12T09:30:00Z',
  },
  {
    ID: 4, NAME: 'Editorial Norte', SEGMENT_ID: 3, STATUS_ID: 3, CLIENT_TYPE_ID: 2,
    EMAIL: 'contacto@editorialnorte.example', PHONE_NUMBER: '+34 633 512 004', WEB: 'editorialnorte.example',
    NOTES: 'Negociación de servicios editoriales para el catálogo de otoño.',
    CREATED_AT: '2026-08-20T08:45:00Z', UPDATED_AT: '2026-10-09T15:10:00Z',
  },
  {
    ID: 5, NAME: 'Logística Peninsular', SEGMENT_ID: 8, STATUS_ID: 4, CLIENT_TYPE_ID: 3,
    EMAIL: 'compras@logpen.example', PHONE_NUMBER: '+34 622 447 890', WEB: 'logpen.example',
    NOTES: 'Gran cuenta con contrato anual de suministro. Revisión de tarifas cada verano.',
    CREATED_AT: '2025-11-25T15:30:00Z', UPDATED_AT: '2026-10-07T10:00:00Z',
  },
  {
    ID: 6, NAME: 'Textiles Andarax', SEGMENT_ID: null, STATUS_ID: 5, CLIENT_TYPE_ID: 1,
    EMAIL: 'c.ocana@andarax.example', PHONE_NUMBER: '+34 621 730 444', WEB: null,
    NOTES: 'Parón de pedidos desde julio por bajada de producción. Revisar reactivación en enero.',
    CREATED_AT: '2026-02-14T11:40:00Z', UPDATED_AT: '2026-10-02T09:15:00Z',
  },
  {
    ID: 7, NAME: 'Bodegas Valcárcel', SEGMENT_ID: 5, STATUS_ID: 4, CLIENT_TYPE_ID: 1,
    EMAIL: 'bodega@bodegasvalcarcel.example', PHONE_NUMBER: '+34 677 310 428', WEB: 'bodegasvalcarcel.example',
    NOTES: 'Pedidos ligados a campañas de vendimia. Interesados en etiquetado personalizado.',
    CREATED_AT: '2026-01-19T10:25:00Z', UPDATED_AT: '2026-10-06T14:05:00Z',
  },
  {
    ID: 8, NAME: 'Grupo Inmobiliario Ática', SEGMENT_ID: 3, STATUS_ID: 1, CLIENT_TYPE_ID: 2,
    EMAIL: 'g.tejada@atica.example', PHONE_NUMBER: '+34 643 940 158', WEB: 'atica.example',
    NOTES: 'Contacto inicial en feria. Están digitalizando su proceso comercial.',
    CREATED_AT: '2026-10-08T09:50:00Z', UPDATED_AT: '2026-10-08T09:50:00Z',
  },
  {
    ID: 9, NAME: 'Gimnasios Vértice', SEGMENT_ID: 3, STATUS_ID: 2, CLIENT_TYPE_ID: 2,
    EMAIL: 'hola@vertice.example', PHONE_NUMBER: '+34 610 625 889', WEB: 'vertice.example',
    NOTES: null,
    CREATED_AT: '2026-09-15T16:20:00Z', UPDATED_AT: '2026-09-30T12:45:00Z',
  },
  {
    ID: 10, NAME: 'Software Meridiano', SEGMENT_ID: 1, STATUS_ID: 3, CLIENT_TYPE_ID: 2,
    EMAIL: 'info@meridiano.example', PHONE_NUMBER: '+34 644 903 771', WEB: 'meridiano.example',
    NOTES: 'Piloto con 12 licencias. Ampliación prevista para el primer trimestre de 2027.',
    CREATED_AT: '2026-08-05T13:10:00Z', UPDATED_AT: '2026-10-14T17:00:00Z',
  },
  {
    ID: 11, NAME: 'Floristería Azalea', SEGMENT_ID: 4, STATUS_ID: 4, CLIENT_TYPE_ID: 4,
    EMAIL: 'paula@azalea.example', PHONE_NUMBER: '+34 632 835 072', WEB: null,
    NOTES: 'Pedido quincenal habitual; amplían surtido en otoño.',
    CREATED_AT: '2026-03-02T10:00:00Z', UPDATED_AT: '2026-09-24T11:35:00Z',
  },
  {
    ID: 12, NAME: 'Construcciones Aldabe', SEGMENT_ID: 2, STATUS_ID: 4, CLIENT_TYPE_ID: 3,
    EMAIL: 'direccion@aldabe.example', PHONE_NUMBER: '+34 688 415 002', WEB: 'aldabe.example',
    NOTES: 'Suministro por fases de obra. Previsión de nueva fase en noviembre.',
    CREATED_AT: '2025-12-18T09:30:00Z', UPDATED_AT: '2026-10-10T18:25:00Z',
  },
  {
    ID: 13, NAME: 'Academia Babel Idiomas', SEGMENT_ID: 7, STATUS_ID: 1, CLIENT_TYPE_ID: 1,
    EMAIL: 'info@academiababel.example', PHONE_NUMBER: '+34 654 055 293', WEB: null,
    NOTES: 'Solicitan tarifas para el curso 2026/2027.',
    CREATED_AT: '2026-09-05T10:45:00Z', UPDATED_AT: '2026-09-05T10:45:00Z',
  },
  {
    ID: 14, NAME: 'Consorcio de Transportes del Sur', SEGMENT_ID: 3, STATUS_ID: null, CLIENT_TYPE_ID: 5,
    EMAIL: 't.arrieta@consorciosur.example', PHONE_NUMBER: '+34 665 160 087', WEB: null,
    NOTES: 'Propuesta en revisión por sus servicios jurídicos.',
    CREATED_AT: '2026-07-02T09:20:00Z', UPDATED_AT: '2026-10-05T13:50:00Z',
  },
]

export const seedContacts: Contact[] = [
  {
    ID: 1, COMPANY_ID: 1, FIRST_NAME: 'Marta', LAST_NAME: 'Ibáñez', JOB_TITLE: 'Responsable de compras',
    EMAIL: 'marta.ibanez@laespiga.example', PHONE_NUMBER: '+34 611 220 331', NOTES: null,
    CREATED_AT: '2025-11-12T10:20:00Z', UPDATED_AT: '2025-11-12T10:20:00Z',
  },
  {
    ID: 2, COMPANY_ID: 5, FIRST_NAME: 'Javier', LAST_NAME: 'Salgado', JOB_TITLE: 'Director de operaciones',
    EMAIL: 'j.salgado@logpen.example', PHONE_NUMBER: '+34 622 447 890', NOTES: 'Prefiere reuniones por la mañana.',
    CREATED_AT: '2025-11-25T15:35:00Z', UPDATED_AT: '2025-11-25T15:35:00Z',
  },
  {
    ID: 3, COMPANY_ID: 4, FIRST_NAME: 'Ainhoa', LAST_NAME: 'Retolaza', JOB_TITLE: 'Editora jefa',
    EMAIL: 'ainhoa@editorialnorte.example', PHONE_NUMBER: '+34 633 512 004', NOTES: null,
    CREATED_AT: '2026-08-20T08:50:00Z', UPDATED_AT: '2026-08-20T08:50:00Z',
  },
  {
    ID: 4, COMPANY_ID: 10, FIRST_NAME: 'Rubén', LAST_NAME: 'Cañete', JOB_TITLE: 'CTO',
    EMAIL: 'ruben@meridiano.example', PHONE_NUMBER: '+34 644 903 771', NOTES: null,
    CREATED_AT: '2026-08-05T13:15:00Z', UPDATED_AT: '2026-08-05T13:15:00Z',
  },
  {
    ID: 5, COMPANY_ID: 2, FIRST_NAME: 'Nerea', LAST_NAME: 'Roldán', JOB_TITLE: 'Gerente',
    EMAIL: 'nerea.roldan@talleresroldan.example', PHONE_NUMBER: '+34 655 118 260', NOTES: null,
    CREATED_AT: '2025-12-03T09:10:00Z', UPDATED_AT: '2025-12-03T09:10:00Z',
  },
  {
    ID: 6, COMPANY_ID: 6, FIRST_NAME: 'Carmen', LAST_NAME: 'Ocaña', JOB_TITLE: 'Administración',
    EMAIL: 'c.ocana@andarax.example', PHONE_NUMBER: '+34 621 730 444', NOTES: null,
    CREATED_AT: '2026-02-14T11:45:00Z', UPDATED_AT: '2026-02-14T11:45:00Z',
  },
  {
    ID: 7, COMPANY_ID: 12, FIRST_NAME: 'Iñaki', LAST_NAME: 'Aldabe', JOB_TITLE: 'Director general',
    EMAIL: 'inaki@aldabe.example', PHONE_NUMBER: '+34 688 415 002', NOTES: null,
    CREATED_AT: '2025-12-18T09:35:00Z', UPDATED_AT: '2025-12-18T09:35:00Z',
  },
  {
    ID: 8, COMPANY_ID: 7, FIRST_NAME: 'Lucía', LAST_NAME: 'Valcárcel', JOB_TITLE: 'Enóloga',
    EMAIL: 'lucia@bodegasvalcarcel.example', PHONE_NUMBER: '+34 677 310 428', NOTES: null,
    CREATED_AT: '2026-01-19T10:30:00Z', UPDATED_AT: '2026-01-19T10:30:00Z',
  },
  {
    ID: 9, COMPANY_ID: 3, FIRST_NAME: 'Elena', LAST_NAME: 'Prats', JOB_TITLE: 'Directora médica',
    EMAIL: 'elena.prats@dentalsonrisa.example', PHONE_NUMBER: '+34 699 520 617', NOTES: null,
    CREATED_AT: '2026-09-28T12:05:00Z', UPDATED_AT: '2026-09-28T12:05:00Z',
  },
  {
    ID: 10, COMPANY_ID: 9, FIRST_NAME: 'Sergio', LAST_NAME: 'Maldonado', JOB_TITLE: 'Gerente de expansión',
    EMAIL: 's.maldonado@vertice.example', PHONE_NUMBER: '+34 610 625 889', NOTES: null,
    CREATED_AT: '2026-09-15T16:25:00Z', UPDATED_AT: '2026-09-15T16:25:00Z',
  },
  {
    ID: 11, COMPANY_ID: 11, FIRST_NAME: 'Paula', LAST_NAME: 'Ferrán', JOB_TITLE: 'Propietaria',
    EMAIL: 'paula@azalea.example', PHONE_NUMBER: '+34 632 835 072', NOTES: null,
    CREATED_AT: '2026-03-02T10:05:00Z', UPDATED_AT: '2026-03-02T10:05:00Z',
  },
  {
    ID: 12, COMPANY_ID: 13, FIRST_NAME: 'Miriam', LAST_NAME: 'Solís', JOB_TITLE: 'Directora',
    EMAIL: 'miriam@academiababel.example', PHONE_NUMBER: '+34 654 055 293', NOTES: null,
    CREATED_AT: '2026-09-05T10:50:00Z', UPDATED_AT: '2026-09-05T10:50:00Z',
  },
  {
    ID: 13, COMPANY_ID: 8, FIRST_NAME: 'Gonzalo', LAST_NAME: 'Tejada', JOB_TITLE: 'Responsable comercial',
    EMAIL: 'g.tejada@atica.example', PHONE_NUMBER: '+34 643 940 158', NOTES: null,
    CREATED_AT: '2026-10-08T09:55:00Z', UPDATED_AT: '2026-10-08T09:55:00Z',
  },
  {
    ID: 14, COMPANY_ID: 1, FIRST_NAME: 'Andrés', LAST_NAME: 'Vera', JOB_TITLE: 'Encargado de tienda',
    EMAIL: 'andres.vera@laespiga.example', PHONE_NUMBER: '+34 611 220 332', NOTES: null,
    CREATED_AT: '2026-02-03T09:00:00Z', UPDATED_AT: '2026-02-03T09:00:00Z',
  },
  {
    ID: 15, COMPANY_ID: 12, FIRST_NAME: 'Sara', LAST_NAME: 'Beltrán', JOB_TITLE: 'Jefa de compras',
    EMAIL: 's.beltran@aldabe.example', PHONE_NUMBER: '+34 688 415 003', NOTES: null,
    CREATED_AT: '2026-01-22T12:30:00Z', UPDATED_AT: '2026-01-22T12:30:00Z',
  },
  {
    ID: 16, COMPANY_ID: 14, FIRST_NAME: 'Tomás', LAST_NAME: 'Arrieta', JOB_TITLE: 'Jefe de área de suministros',
    EMAIL: 't.arrieta@consorciosur.example', PHONE_NUMBER: '+34 665 160 087', NOTES: null,
    CREATED_AT: '2026-07-02T09:25:00Z', UPDATED_AT: '2026-07-02T09:25:00Z',
  },
]

export const seedInteractions: Interaction[] = [
  { ID: 1, COMPANY_ID: 10, CONTACT_ID: 4, DATE: '2026-10-14', DESCRIPTION: 'Demo del módulo de analítica', NOTES: 'Valoran ampliar licencias el próximo trimestre.', CREATED_AT: '2026-10-14T17:05:00Z', UPDATED_AT: '2026-10-14T17:05:00Z' },
  { ID: 2, COMPANY_ID: 1, CONTACT_ID: 1, DATE: '2026-10-13', DESCRIPTION: 'Reposición mensual de packaging', NOTES: 'Confirman cantidades para octubre y noviembre.', CREATED_AT: '2026-10-13T16:45:00Z', UPDATED_AT: '2026-10-13T16:45:00Z' },
  { ID: 3, COMPANY_ID: 3, CONTACT_ID: 9, DATE: '2026-10-12', DESCRIPTION: 'Llamada de descubrimiento', NOTES: 'Interesados en el plan de mantenimiento anual.', CREATED_AT: '2026-10-12T09:35:00Z', UPDATED_AT: '2026-10-12T09:35:00Z' },
  { ID: 4, COMPANY_ID: 12, CONTACT_ID: 7, DATE: '2026-10-10', DESCRIPTION: 'Visita a la obra de Sanlúcar', NOTES: 'Necesitan material para la fase 2, arranque en noviembre.', CREATED_AT: '2026-10-10T18:30:00Z', UPDATED_AT: '2026-10-10T18:30:00Z' },
  { ID: 5, COMPANY_ID: 4, CONTACT_ID: 3, DATE: '2026-10-09', DESCRIPTION: 'Envío de propuesta editorial', NOTES: 'Comparan con dos proveedores más.', CREATED_AT: '2026-10-09T15:15:00Z', UPDATED_AT: '2026-10-09T15:15:00Z' },
  { ID: 6, COMPANY_ID: 8, CONTACT_ID: 13, DATE: '2026-10-08', DESCRIPTION: 'Primera llamada de contacto', NOTES: 'Los conocimos en la feria del sector inmobiliario.', CREATED_AT: '2026-10-08T10:00:00Z', UPDATED_AT: '2026-10-08T10:00:00Z' },
  { ID: 7, COMPANY_ID: 5, CONTACT_ID: 2, DATE: '2026-10-07', DESCRIPTION: 'Reunión de renovación de flota', NOTES: 'Renuevan 6 equipos en diciembre.', CREATED_AT: '2026-10-07T10:05:00Z', UPDATED_AT: '2026-10-07T10:05:00Z' },
  { ID: 8, COMPANY_ID: 7, CONTACT_ID: 8, DATE: '2026-10-06', DESCRIPTION: 'Cata y presentación de la nueva línea', NOTES: 'Interesados en sumar etiquetas personalizadas.', CREATED_AT: '2026-10-06T14:10:00Z', UPDATED_AT: '2026-10-06T14:10:00Z' },
  { ID: 9, COMPANY_ID: 14, CONTACT_ID: 16, DATE: '2026-10-05', DESCRIPTION: 'Reunión en la sede del consorcio', NOTES: 'La propuesta pasa a revisión de sus servicios jurídicos.', CREATED_AT: '2026-10-05T13:55:00Z', UPDATED_AT: '2026-10-05T13:55:00Z' },
  { ID: 10, COMPANY_ID: 1, CONTACT_ID: 14, DATE: '2026-10-03', DESCRIPTION: 'Incidencia de entrega resuelta', NOTES: 'Repuesto enviado el mismo día.', CREATED_AT: '2026-10-03T11:20:00Z', UPDATED_AT: '2026-10-03T11:20:00Z' },
  { ID: 11, COMPANY_ID: 6, CONTACT_ID: 6, DATE: '2026-10-02', DESCRIPTION: 'Llamada de reactivación', NOTES: 'Sin novedades; confirman parón de pedidos hasta enero.', CREATED_AT: '2026-10-02T09:20:00Z', UPDATED_AT: '2026-10-02T09:20:00Z' },
  { ID: 12, COMPANY_ID: 9, CONTACT_ID: 10, DATE: '2026-09-30', DESCRIPTION: 'Visita al centro Vértice Centro', NOTES: 'Plantean equipar la nueva sala de musculación.', CREATED_AT: '2026-09-30T12:50:00Z', UPDATED_AT: '2026-09-30T12:50:00Z' },
  { ID: 13, COMPANY_ID: 2, CONTACT_ID: 5, DATE: '2026-09-29', DESCRIPTION: 'Seguimiento de pedido', NOTES: 'Entrega parcial confirmada para el viernes.', CREATED_AT: '2026-09-29T11:25:00Z', UPDATED_AT: '2026-09-29T11:25:00Z' },
  { ID: 14, COMPANY_ID: 5, CONTACT_ID: 2, DATE: '2026-09-25', DESCRIPTION: 'Reunión de operaciones', NOTES: 'Ajustamos el calendario de entregas del último trimestre.', CREATED_AT: '2026-09-25T10:30:00Z', UPDATED_AT: '2026-09-25T10:30:00Z' },
  { ID: 15, COMPANY_ID: 11, CONTACT_ID: 11, DATE: '2026-09-24', DESCRIPTION: 'Pedido de temporada de otoño', NOTES: 'Amplían el surtido de plantas de interior.', CREATED_AT: '2026-09-24T11:40:00Z', UPDATED_AT: '2026-09-24T11:40:00Z' },
  { ID: 16, COMPANY_ID: 10, CONTACT_ID: 4, DATE: '2026-09-22', DESCRIPTION: 'Llamada técnica', NOTES: 'Resuelven dudas sobre la integración con su ERP.', CREATED_AT: '2026-09-22T16:00:00Z', UPDATED_AT: '2026-09-22T16:00:00Z' },
  { ID: 17, COMPANY_ID: 1, CONTACT_ID: 1, DATE: '2026-09-19', DESCRIPTION: 'Visita al obrador', NOTES: 'Muestran interés en bandejas compostables.', CREATED_AT: '2026-09-19T09:45:00Z', UPDATED_AT: '2026-09-19T09:45:00Z' },
  { ID: 18, COMPANY_ID: 5, CONTACT_ID: null, DATE: '2026-09-15', DESCRIPTION: 'Correo con tarifas actualizadas', NOTES: null, CREATED_AT: '2026-09-15T12:10:00Z', UPDATED_AT: '2026-09-15T12:10:00Z' },
  { ID: 19, COMPANY_ID: 12, CONTACT_ID: 7, DATE: '2026-09-12', DESCRIPTION: 'Llamada de seguimiento', NOTES: 'Revisan el presupuesto internamente.', CREATED_AT: '2026-09-12T17:35:00Z', UPDATED_AT: '2026-09-12T17:35:00Z' },
  { ID: 20, COMPANY_ID: 7, CONTACT_ID: 8, DATE: '2026-09-10', DESCRIPTION: 'Pedido de vendimia', NOTES: 'Confirmado el calendario de recogida.', CREATED_AT: '2026-09-10T14:20:00Z', UPDATED_AT: '2026-09-10T14:20:00Z' },
  { ID: 21, COMPANY_ID: 3, CONTACT_ID: 9, DATE: '2026-09-09', DESCRIPTION: 'Envío del catálogo de clínica', NOTES: null, CREATED_AT: '2026-09-09T10:15:00Z', UPDATED_AT: '2026-09-09T10:15:00Z' },
  { ID: 22, COMPANY_ID: 13, CONTACT_ID: 12, DATE: '2026-09-05', DESCRIPTION: 'Feria de educación: contacto en el stand', NOTES: 'Recogemos el contacto directo de dirección.', CREATED_AT: '2026-09-05T10:55:00Z', UPDATED_AT: '2026-09-05T10:55:00Z' },
  { ID: 23, COMPANY_ID: 4, CONTACT_ID: 3, DATE: '2026-09-03', DESCRIPTION: 'Llamada de negociación', NOTES: 'Piden ajustar los plazos de entrega.', CREATED_AT: '2026-09-03T11:05:00Z', UPDATED_AT: '2026-09-03T11:05:00Z' },
  { ID: 24, COMPANY_ID: 2, CONTACT_ID: 5, DATE: '2026-08-28', DESCRIPTION: 'Formación de producto en el taller', NOTES: 'Dos sesiones completadas con el equipo.', CREATED_AT: '2026-08-28T13:40:00Z', UPDATED_AT: '2026-08-28T13:40:00Z' },
  { ID: 25, COMPANY_ID: 8, CONTACT_ID: 13, DATE: '2026-08-26', DESCRIPTION: 'Envío del dossier de servicios', NOTES: null, CREATED_AT: '2026-08-26T09:25:00Z', UPDATED_AT: '2026-08-26T09:25:00Z' },
  { ID: 26, COMPANY_ID: 9, CONTACT_ID: 10, DATE: '2026-08-21', DESCRIPTION: 'Llamada de descubrimiento', NOTES: 'Estudian abrir dos centros más el año que viene.', CREATED_AT: '2026-08-21T16:35:00Z', UPDATED_AT: '2026-08-21T16:35:00Z' },
  { ID: 27, COMPANY_ID: 11, CONTACT_ID: 11, DATE: '2026-08-14', DESCRIPTION: 'Reposición de stock', NOTES: 'Pedido habitual quincenal.', CREATED_AT: '2026-08-14T11:50:00Z', UPDATED_AT: '2026-08-14T11:50:00Z' },
  { ID: 28, COMPANY_ID: 5, CONTACT_ID: 2, DATE: '2026-08-07', DESCRIPTION: 'Revisión del contrato anual', NOTES: 'Renovación firmada.', CREATED_AT: '2026-08-07T12:00:00Z', UPDATED_AT: '2026-08-07T12:00:00Z' },
  { ID: 29, COMPANY_ID: 1, CONTACT_ID: 1, DATE: '2026-07-30', DESCRIPTION: 'Pedido extraordinario', NOTES: 'Evento de la asociación de panaderos.', CREATED_AT: '2026-07-30T10:40:00Z', UPDATED_AT: '2026-07-30T10:40:00Z' },
  { ID: 30, COMPANY_ID: 6, CONTACT_ID: 6, DATE: '2026-07-24', DESCRIPTION: 'Última llamada antes del parón estival', NOTES: 'Pausan compras por vacaciones.', CREATED_AT: '2026-07-24T09:30:00Z', UPDATED_AT: '2026-07-24T09:30:00Z' },
  { ID: 31, COMPANY_ID: 13, CONTACT_ID: 12, DATE: '2026-07-16', DESCRIPTION: 'Llamada de primer contacto', NOTES: 'Solicitan información de tarifas.', CREATED_AT: '2026-07-16T10:10:00Z', UPDATED_AT: '2026-07-16T10:10:00Z' },
  { ID: 32, COMPANY_ID: 14, CONTACT_ID: 16, DATE: '2026-07-09', DESCRIPTION: 'Envío de la propuesta inicial', NOTES: null, CREATED_AT: '2026-07-09T15:45:00Z', UPDATED_AT: '2026-07-09T15:45:00Z' },
  { ID: 33, COMPANY_ID: 12, CONTACT_ID: 7, DATE: '2026-07-03', DESCRIPTION: 'Visita a las oficinas', NOTES: 'Buena predisposición; quedamos a la espera de su previsión de obra.', CREATED_AT: '2026-07-03T12:25:00Z', UPDATED_AT: '2026-07-03T12:25:00Z' },
]

export const seedPurchases: Purchase[] = [
  { ID: 1, COMPANY_ID: 1, DATE: '2026-10-13', AMOUNT_CENTS: 32450, CREATED_AT: '2026-10-13T10:00:00Z' },
  { ID: 2, COMPANY_ID: 12, DATE: '2026-10-10', AMOUNT_CENTS: 1850000, CREATED_AT: '2026-10-10T10:00:00Z' },
  { ID: 3, COMPANY_ID: 5, DATE: '2026-10-07', AMOUNT_CENTS: 1210300, CREATED_AT: '2026-10-07T10:00:00Z' },
  { ID: 4, COMPANY_ID: 7, DATE: '2026-10-06', AMOUNT_CENTS: 84750, CREATED_AT: '2026-10-06T10:00:00Z' },
  { ID: 5, COMPANY_ID: 1, DATE: '2026-10-03', AMOUNT_CENTS: 18900, CREATED_AT: '2026-10-03T10:00:00Z' },
  { ID: 6, COMPANY_ID: 2, DATE: '2026-09-29', AMOUNT_CENTS: 452300, CREATED_AT: '2026-09-29T10:00:00Z' },
  { ID: 7, COMPANY_ID: 11, DATE: '2026-09-24', AMOUNT_CENTS: 12120, CREATED_AT: '2026-09-24T10:00:00Z' },
  { ID: 8, COMPANY_ID: 10, DATE: '2026-09-22', AMOUNT_CENTS: 89000, CREATED_AT: '2026-09-22T10:00:00Z' },
  { ID: 9, COMPANY_ID: 1, DATE: '2026-09-19', AMOUNT_CENTS: 27600, CREATED_AT: '2026-09-19T10:00:00Z' },
  { ID: 10, COMPANY_ID: 5, DATE: '2026-09-15', AMOUNT_CENTS: 980400, CREATED_AT: '2026-09-15T10:00:00Z' },
  { ID: 11, COMPANY_ID: 12, DATE: '2026-09-12', AMOUNT_CENTS: 2450000, CREATED_AT: '2026-09-12T10:00:00Z' },
  { ID: 12, COMPANY_ID: 11, DATE: '2026-09-10', AMOUNT_CENTS: 9980, CREATED_AT: '2026-09-10T10:00:00Z' },
  { ID: 13, COMPANY_ID: 7, DATE: '2026-09-10', AMOUNT_CENTS: 73200, CREATED_AT: '2026-09-10T10:00:00Z' },
  { ID: 14, COMPANY_ID: 2, DATE: '2026-09-02', AMOUNT_CENTS: 389900, CREATED_AT: '2026-09-02T10:00:00Z' },
  { ID: 15, COMPANY_ID: 11, DATE: '2026-08-27', AMOUNT_CENTS: 13450, CREATED_AT: '2026-08-27T10:00:00Z' },
  { ID: 16, COMPANY_ID: 1, DATE: '2026-08-25', AMOUNT_CENTS: 31200, CREATED_AT: '2026-08-25T10:00:00Z' },
  { ID: 17, COMPANY_ID: 5, DATE: '2026-08-19', AMOUNT_CENTS: 1105600, CREATED_AT: '2026-08-19T10:00:00Z' },
  { ID: 18, COMPANY_ID: 11, DATE: '2026-08-14', AMOUNT_CENTS: 8760, CREATED_AT: '2026-08-14T10:00:00Z' },
  { ID: 19, COMPANY_ID: 2, DATE: '2026-08-11', AMOUNT_CENTS: 418750, CREATED_AT: '2026-08-11T10:00:00Z' },
  { ID: 20, COMPANY_ID: 1, DATE: '2026-08-05', AMOUNT_CENTS: 22400, CREATED_AT: '2026-08-05T10:00:00Z' },
  { ID: 21, COMPANY_ID: 7, DATE: '2026-08-01', AMOUNT_CENTS: 65900, CREATED_AT: '2026-08-01T10:00:00Z' },
  { ID: 22, COMPANY_ID: 5, DATE: '2026-07-30', AMOUNT_CENTS: 872150, CREATED_AT: '2026-07-30T10:00:00Z' },
  { ID: 23, COMPANY_ID: 1, DATE: '2026-07-30', AMOUNT_CENTS: 45300, CREATED_AT: '2026-07-30T10:00:00Z' },
  { ID: 24, COMPANY_ID: 11, DATE: '2026-07-28', AMOUNT_CENTS: 11200, CREATED_AT: '2026-07-28T10:00:00Z' },
  { ID: 25, COMPANY_ID: 2, DATE: '2026-07-21', AMOUNT_CENTS: 356900, CREATED_AT: '2026-07-21T10:00:00Z' },
  { ID: 26, COMPANY_ID: 6, DATE: '2026-07-18', AMOUNT_CENTS: 71500, CREATED_AT: '2026-07-18T10:00:00Z' },
  { ID: 27, COMPANY_ID: 11, DATE: '2026-07-10', AMOUNT_CENTS: 9400, CREATED_AT: '2026-07-10T10:00:00Z' },
  { ID: 28, COMPANY_ID: 5, DATE: '2026-07-09', AMOUNT_CENTS: 903800, CREATED_AT: '2026-07-09T10:00:00Z' },
  { ID: 29, COMPANY_ID: 1, DATE: '2026-07-03', AMOUNT_CENTS: 25700, CREATED_AT: '2026-07-03T10:00:00Z' },
  { ID: 30, COMPANY_ID: 2, DATE: '2026-07-01', AMOUNT_CENTS: 402100, CREATED_AT: '2026-07-01T10:00:00Z' },
  { ID: 31, COMPANY_ID: 5, DATE: '2026-06-25', AMOUNT_CENTS: 815600, CREATED_AT: '2026-06-25T10:00:00Z' },
  { ID: 32, COMPANY_ID: 6, DATE: '2026-06-20', AMOUNT_CENTS: 68300, CREATED_AT: '2026-06-20T10:00:00Z' },
  { ID: 33, COMPANY_ID: 11, DATE: '2026-06-19', AMOUNT_CENTS: 10850, CREATED_AT: '2026-06-19T10:00:00Z' },
  { ID: 34, COMPANY_ID: 1, DATE: '2026-06-15', AMOUNT_CENTS: 29800, CREATED_AT: '2026-06-15T10:00:00Z' },
  { ID: 35, COMPANY_ID: 7, DATE: '2026-06-12', AMOUNT_CENTS: 59100, CREATED_AT: '2026-06-12T10:00:00Z' },
  { ID: 36, COMPANY_ID: 2, DATE: '2026-06-08', AMOUNT_CENTS: 377400, CREATED_AT: '2026-06-08T10:00:00Z' },
  { ID: 37, COMPANY_ID: 12, DATE: '2026-06-05', AMOUNT_CENTS: 1620000, CREATED_AT: '2026-06-05T10:00:00Z' },
  { ID: 38, COMPANY_ID: 1, DATE: '2026-05-27', AMOUNT_CENTS: 27300, CREATED_AT: '2026-05-27T10:00:00Z' },
  { ID: 39, COMPANY_ID: 2, DATE: '2026-05-22', AMOUNT_CENTS: 366800, CREATED_AT: '2026-05-22T10:00:00Z' },
  { ID: 40, COMPANY_ID: 5, DATE: '2026-05-15', AMOUNT_CENTS: 842900, CREATED_AT: '2026-05-15T10:00:00Z' },
  { ID: 41, COMPANY_ID: 11, DATE: '2026-05-12', AMOUNT_CENTS: 10240, CREATED_AT: '2026-05-12T10:00:00Z' },
  { ID: 42, COMPANY_ID: 9, DATE: '2026-05-08', AMOUNT_CENTS: 145000, CREATED_AT: '2026-05-08T10:00:00Z' },
  { ID: 43, COMPANY_ID: 7, DATE: '2026-05-05', AMOUNT_CENTS: 61800, CREATED_AT: '2026-05-05T10:00:00Z' },
  { ID: 44, COMPANY_ID: 1, DATE: '2026-05-04', AMOUNT_CENTS: 21900, CREATED_AT: '2026-05-04T10:00:00Z' },
]

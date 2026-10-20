// Etiquetas y tonos visuales asociados a los catálogos.
// El color se deduce del nombre del estado; si el catálogo cambia, se usa
// un tono neutro como respaldo.

export type BadgeTone = 'indigo' | 'blue' | 'violet' | 'green' | 'amber' | 'red' | 'slate'

const STATUS_TONES: Record<string, BadgeTone> = {
  Nuevo: 'blue',
  Contactado: 'violet',
  'En negociación': 'amber',
  Cliente: 'green',
  Inactivo: 'slate',
}

export function statusTone(name: string | null | undefined): BadgeTone {
  if (name && STATUS_TONES[name]) {
    return STATUS_TONES[name]
  }
  return 'slate'
}

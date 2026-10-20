// Utilidades de formato para importes, fechas y textos.
// Criterio monetario: los importes se guardan en céntimos y se muestran en euros.

/** Importe máximo admitido para una compra (10.000.000 €). */
export const MAX_PURCHASE_AMOUNT_CENTS = 1_000_000_000

/** 25050 -> "250,50 €" */
export function formatCents(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) {
    return '—'
  }
  return (cents / 100).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
  })
}

/** 3190000 -> "31,9 mil €" (para gráficos y etiquetas compactas) */
export function formatCentsCompact(cents: number): string {
  return (cents / 100).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1,
  })
}

/**
 * Convierte un importe en euros escrito por la persona usuaria a céntimos.
 * Sigue la convención española: la coma es el separador decimal y el punto
 * de miles ("1.234,56"). También acepta el estilo "1,234.56" y "250.50".
 * Devuelve null si el formato no es válido o tiene más de dos decimales.
 * No trunca decimales: un valor con más precisión se rechaza.
 */
export function parseEurosToCents(value: string): number | null {
  const cleaned = value.trim().replace(/[€\s\u00a0]/g, '')
  if (!cleaned || !/^[\d.,]+$/.test(cleaned)) {
    return null
  }

  const commas = (cleaned.match(/,/g) ?? []).length
  const dots = (cleaned.match(/\./g) ?? []).length
  const lastComma = cleaned.lastIndexOf(',')
  const lastDot = cleaned.lastIndexOf('.')
  let normalized = cleaned

  if (commas > 0 && dots > 0) {
    // El último separador es el decimal; el resto son miles.
    normalized =
      lastComma > lastDot
        ? cleaned.replace(/\./g, '').replace(/,/g, '.')
        : cleaned.replace(/,/g, '')
  } else if (commas > 0) {
    if (commas > 1) {
      return null
    }
    const [intPart, frac = ''] = cleaned.split(',')
    if (frac.length > 2) {
      return null
    }
    normalized = frac ? `${intPart}.${frac}` : intPart
  } else if (dots > 0) {
    if (dots > 1) {
      // Solo se admite como separador de miles: 1.234.567
      if (!/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
        return null
      }
      normalized = cleaned.replace(/\./g, '')
    } else {
      const frac = cleaned.split('.')[1] ?? ''
      if (frac.length <= 2) {
        normalized = cleaned
      } else if (frac.length === 3) {
        // "1.234" se interpreta como miles (convención española).
        normalized = cleaned.replace('.', '')
      } else {
        return null
      }
    }
  }

  const euros = Number(normalized)
  if (!Number.isFinite(euros) || euros < 0) {
    return null
  }

  const cents = Math.round(euros * 100)
  if (Math.abs(cents / 100 - euros) > 1e-9) {
    return null
  }
  return cents
}

/** "2026-10-13" -> "13 oct 2026". Las fechas sin hora se leen en local. */
export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '—'
  }
  const date = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Fecha y hora para metadatos: "13 oct 2026, 16:40" */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Etiqueta relativa: "hoy", "ayer", "hace 4 días", "hace 2 semanas",
 * "hace 3 meses". Devuelve null si la fecha no es válida.
 */
export function formatRelativeDate(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }
  const date = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000)

  if (days < 0) {
    return null
  }
  if (days === 0) {
    return 'hoy'
  }
  if (days === 1) {
    return 'ayer'
  }
  if (days < 7) {
    return `hace ${days} días`
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`
  }
  if (days < 365) {
    const months = Math.floor(days / 30)
    return months === 1 ? 'hace 1 mes' : `hace ${months} meses`
  }
  const years = Math.floor(days / 365)
  return years === 1 ? 'hace 1 año' : `hace ${years} años`
}

/** "oct", "nov"… para etiquetas de gráficos. */
export function formatMonthShort(date: Date): string {
  return date.toLocaleDateString('es-ES', { month: 'short' })
}

/** "octubre de 2026" para textos descriptivos. */
export function formatMonthLong(date: Date): string {
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

/** Normaliza texto para búsquedas sin distinguir acentos ni mayúsculas. */
export function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** "Panadería La Espiga" -> "PE"; "Marta Ibáñez" -> "MI" */
export function initials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 2 || /^[A-ZÁÉÍÓÚÑ]/.test(word))
  const source = words.length > 0 ? words : name.trim().split(/\s+/)
  return source
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

/** Fecha de hoy en formato YYYY-MM-DD (para precargar formularios). */
export function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

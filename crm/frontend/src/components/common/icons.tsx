import type { ReactNode } from 'react'

// Iconos SVG en línea (trazo, estilo Feather). Evitan añadir una dependencia
// de iconos solo para el prototipo.

interface IconProps {
  size?: number
  className?: string
}

interface IconBaseProps extends IconProps {
  children: ReactNode
}

function IconBase({ size = 18, className, children }: IconBaseProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function IconHome(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </IconBase>
  )
}

export function IconBriefcase(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </IconBase>
  )
}

export function IconUsers(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  )
}

export function IconMessage(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </IconBase>
  )
}

export function IconCart(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </IconBase>
  )
}

export function IconEuro(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 10h12" />
      <path d="M4 14h9" />
      <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
    </IconBase>
  )
}

export function IconChart(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </IconBase>
  )
}

export function IconPlus(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  )
}

export function IconSearch(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </IconBase>
  )
}

export function IconClose(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </IconBase>
  )
}

export function IconEdit(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </IconBase>
  )
}

export function IconMail(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </IconBase>
  )
}

export function IconPhone(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </IconBase>
  )
}

export function IconGlobe(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </IconBase>
  )
}

export function IconCalendar(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </IconBase>
  )
}

export function IconMenu(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h18" />
      <path d="M3 6h18" />
      <path d="M3 18h18" />
    </IconBase>
  )
}

export function IconArrowLeft(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </IconBase>
  )
}

export function IconCheckCircle(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </IconBase>
  )
}

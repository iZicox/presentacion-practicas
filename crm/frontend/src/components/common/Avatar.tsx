import { initials } from '../../utils/format'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const TONES = ['tone-a', 'tone-b', 'tone-c', 'tone-d', 'tone-e', 'tone-f']

/** Círculo con las iniciales; el color se deriva del nombre. */
export default function Avatar({ name, size = 'md' }: AvatarProps) {
  const toneIndex = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % TONES.length

  return (
    <span className={`avatar avatar-${size} ${TONES[toneIndex]}`} aria-hidden="true">
      {initials(name)}
    </span>
  )
}

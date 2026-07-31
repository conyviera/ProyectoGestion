type Status = 'ok' | 'warning' | 'critical' | 'inactive' | 'paused' | 'scheduled'

interface Props {
  status: Status
  label?: string
}

const CONFIG: Record<Status, { bg: string; color: string; dot: string; defaultLabel: string }> = {
  ok:        { bg: '#DCFCE7', color: '#15803D', dot: '#16A34A', defaultLabel: 'Operando' },
  warning:   { bg: '#FEF3C7', color: '#B45309', dot: '#F59E0B', defaultLabel: 'Alerta' },
  critical:  { bg: '#FEE2E2', color: '#B91C1C', dot: '#DC2626', defaultLabel: 'Crítico' },
  inactive:  { bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF', defaultLabel: 'Inactivo' },
  paused:    { bg: '#FEF3C7', color: '#B45309', dot: '#F59E0B', defaultLabel: 'En pausa' },
  scheduled: { bg: '#E0F2FE', color: '#0369A1', dot: '#0EA5E9', defaultLabel: 'Programado' },
}

export default function StatusBadge({ status, label }: Props) {
  const cfg = CONFIG[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600, borderRadius: 99, padding: '3px 10px 3px 7px', whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block', flexShrink: 0 }} />
      {label ?? cfg.defaultLabel}
    </span>
  )
}

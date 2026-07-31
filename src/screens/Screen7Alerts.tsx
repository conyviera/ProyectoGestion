import { useState } from 'react'
import type { Screen, Role } from '../types'
import { IconXCircle, IconAlertTriangle, IconCheckCircle, IconWrench, IconClipboard, IconCheck } from '../components/Icons'

interface Props { navigate: (s: Screen) => void; role: Role }

type Sev = 'critical' | 'warning' | 'ok'

interface Alert {
  id: number; sev: Sev; time: string; line: string; title: string; desc: string
  machine: string; tech: string; elapsed: string
  status: 'Activa' | 'Reconocida' | 'Resuelta'; resolvedAt?: string
}

const initialAlerts: Alert[] = [
  { id: 1, sev: 'critical', time: '10:42', line: 'A', title: 'Sensor temperatura cabezal fuera de rango', desc: 'Lectura > 85°C durante 4 min. Posible riesgo de producto. Requiere inspección inmediata.', status: 'Activa', machine: 'ENV-01', tech: 'L. Rojas', elapsed: '23 min' },
  { id: 2, sev: 'critical', time: '10:18', line: 'B', title: 'Parada no planificada — mecanismo de sellado', desc: 'Parada forzada por fallo en mecanismo sellado lata. MTTR objetivo: 45 min.', status: 'Activa', machine: 'CON-02', tech: 'Sin asignar', elapsed: '47 min' },
  { id: 3, sev: 'critical', time: '09:50', line: 'A', title: 'Pérdida de conectividad Gateway-A 3 min', desc: 'Buffer local activo. Datos en cola: 180 registros. Reconectado automáticamente.', status: 'Resuelta', resolvedAt: '08:53', machine: 'ENV-01', tech: 'L. Rojas', elapsed: '1h 15 min' },
  { id: 4, sev: 'warning', time: '09:55', line: 'A', title: 'Merma sobre umbral meta 2,0%', desc: 'Merma actual 2,3%. Revisar configuración de envasadora ENV-01.', status: 'Activa', machine: 'ENV-01', tech: 'Sin asignar', elapsed: '10 min' },
  { id: 5, sev: 'warning', time: '09:30', line: 'B', title: 'Mantenimiento preventivo CON-02 próximo', desc: 'PM programado 14:00. Solicitar técnico con 2h de anticipación.', status: 'Reconocida', machine: 'CON-02', tech: 'P. Arancibia', elapsed: '35 min' },
  { id: 6, sev: 'warning', time: '09:10', line: 'B', title: 'OEE Línea B por debajo de meta', desc: 'OEE: 68,4% vs meta 72%. Verificar rendimiento y calidad.', status: 'Activa', machine: 'CON-02', tech: 'Sin asignar', elapsed: '55 min' },
  { id: 7, sev: 'ok', time: '08:50', line: 'A', title: 'Línea A reconectada exitosamente', desc: 'Conectividad restaurada. Buffer sincronizado. 0 registros perdidos.', status: 'Resuelta', resolvedAt: '08:53', machine: 'ENV-01', tech: 'L. Rojas', elapsed: '2h 15 min' },
]

const SEV_STYLE: Record<Sev, { border: string; bg: string; iconBg: string; label: string; textColor: string; Icon: React.FC<any> }> = {
  critical: { border: '#FCA5A5', bg: '#FFF5F5', iconBg: '#FEE2E2', label: 'CRÍTICA', textColor: '#B91C1C', Icon: IconXCircle },
  warning:  { border: '#FDE68A', bg: '#FFFDF0', iconBg: '#FEF3C7', label: 'MEDIA', textColor: '#B45309', Icon: IconAlertTriangle },
  ok:       { border: '#BBF7D0', bg: '#F0FDF4', iconBg: '#DCFCE7', label: 'BAJA', textColor: '#15803D', Icon: IconCheckCircle },
}

const STATUS_COLOR: Record<string, string> = { Activa: '#DC2626', Reconocida: '#F59E0B', Resuelta: '#16A34A' }

export default function Screen7Alerts({ navigate, role }: Props) {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [sevFilter, setSevFilter] = useState<string>('Todas')
  const [statusFilter, setStatusFilter] = useState<string>('Todas')

  function acknowledge(id: number) {
    setAlerts((prev) => prev.map((a) => a.id === id && a.status === 'Activa' ? { ...a, status: 'Reconocida' } : a))
  }

  const filtered = alerts.filter((a) => {
    if (sevFilter !== 'Todas' && a.sev !== sevFilter.toLowerCase()) return false
    if (statusFilter !== 'Todas' && a.status !== statusFilter) return false
    return true
  })

  const activas = alerts.filter((a) => a.status === 'Activa').length
  const criticas = alerts.filter((a) => a.sev === 'critical' && a.status === 'Activa').length

  const canAttend = role === 'tecnico'

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 26px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Alertas</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Bandeja de Alertas</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              <strong style={{ color: '#DC2626' }}>{activas} activas</strong> · {criticas} críticas sin asignar · MTTA 4 min
            </span>
            {[['Severidad', ['Todas', 'Critical', 'Warning', 'Ok'], sevFilter, setSevFilter],
              ['Estado', ['Todas', 'Activa', 'Reconocida', 'Resuelta'], statusFilter, setStatusFilter]].map(([label, opts, val, setter]: any) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 11, color: '#6B7280' }}>{label}:</span>
                <select value={val} onChange={(e) => setter(e.target.value)} style={{ fontSize: 12, padding: '5px 9px', border: '1px solid #E5E7EB', borderRadius: 7, background: '#F9FAFB', outline: 'none', cursor: 'pointer' }}>
                  {opts.map((o: string) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((a) => {
          const st = SEV_STYLE[a.sev]
          const isResolved = a.status === 'Resuelta'
          return (
            <div key={a.id} style={{ background: isResolved ? '#FAFAFA' : st.bg, border: `1.5px solid ${isResolved ? '#E5E7EB' : st.border}`, borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12, opacity: isResolved ? 0.75 : 1, boxShadow: isResolved ? 'none' : '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: st.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <st.Icon size={16} color={st.textColor} strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: st.textColor }}>{st.label}</span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#9CA3AF' }}>{a.time}</span>
                  <span style={{ fontSize: 10, background: '#EFF6FF', color: '#1E40AF', padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>Línea {a.line}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: STATUS_COLOR[a.status] }}>{a.status}</span>
                  <span style={{ fontSize: 11, color: '#6B7280' }}>· {a.elapsed}</span>
                  {isResolved && a.resolvedAt && <span style={{ fontSize: 10, color: '#9CA3AF' }}>a las {a.resolvedAt}</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{a.desc}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#4B5563', marginBottom: isResolved ? 0 : 10 }}>
                  <span><strong>Máquina:</strong> {a.machine}</span>
                  <span><strong>Técnico asignado:</strong> {a.tech}</span>
                </div>
                {!isResolved && (
                  <div style={{ display: 'flex', gap: 7 }}>
                    {a.status === 'Activa' && (
                      <>
                        <button onClick={() => acknowledge(a.id)} style={{ fontSize: 11, fontWeight: 600, padding: '5px 11px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: 6, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <IconCheck size={11} color="#374151" /> Reconocer
                        </button>
                        <button 
                          onClick={() => canAttend ? navigate('maintenance') : null} 
                          disabled={!canAttend}
                          title={!canAttend ? 'Solo técnico puede atender' : undefined}
                          style={{ fontSize: 11, fontWeight: 600, padding: '5px 11px', background: canAttend ? '#EFF6FF' : '#F3F4F6', border: `1px solid ${canAttend ? '#BFDBFE' : '#E5E7EB'}`, borderRadius: 6, cursor: canAttend ? 'pointer' : 'not-allowed', color: canAttend ? '#1E40AF' : '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <IconWrench size={11} color={canAttend ? '#1E40AF' : '#9CA3AF'} /> Atender
                        </button>
                      </>
                    )}
                    <button onClick={() => navigate('events')} style={{ fontSize: 11, fontWeight: 600, padding: '5px 11px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, cursor: 'pointer', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconClipboard size={11} color="#1E40AF" /> Ver evento
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

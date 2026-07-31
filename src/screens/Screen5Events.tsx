import { useState } from 'react'
import { IconEye, IconDownload } from '../components/Icons'
import type { Screen, Role } from '../types'

interface Props {
  navigate: (s: Screen) => void;
  role: Role;
}

const events = [
  { ts: '10:48:12', line: 'A', type: 'Operación', desc: 'Inicio lote L-2451', sev: 'ok', actor: 'R. Soto', estado: 'Cerrado' },
  { ts: '10:42:03', line: 'A', type: 'Falla', desc: 'Sensor temperatura cabezal fuera de rango', sev: 'critical', actor: 'Sistema', estado: 'Abierto' },
  { ts: '10:30:00', line: 'B', type: 'Parada', desc: 'Mantenimiento programado EN-015', sev: 'warning', actor: 'P. Arancibia', estado: 'En curso' },
  { ts: '10:18:44', line: 'B', type: 'Falla', desc: 'Parada no planificada — mecanismo sellado', sev: 'critical', actor: 'Sistema', estado: 'Cerrado' },
  { ts: '09:55:30', line: 'A', type: 'Alerta', desc: 'Merma sobre umbral meta 2,0%', sev: 'warning', actor: 'Sistema', estado: 'Abierto' },
  { ts: '09:42:10', line: 'A', type: 'Parada', desc: 'Cambio de formato lote L-2450 → L-2451', sev: 'ok', actor: 'R. Soto', estado: 'Cerrado' },
  { ts: '09:30:00', line: 'B', type: 'Alerta', desc: 'Mantenimiento preventivo CON-02 próximo', sev: 'warning', actor: 'Sistema', estado: 'Cerrado' },
  { ts: '08:50:22', line: 'A', type: 'Operación', desc: 'Línea A reconectada tras corte Gateway-A', sev: 'ok', actor: 'Sistema', estado: 'Cerrado' },
  { ts: '08:30:15', line: 'B', type: 'Operación', desc: 'Inicio turno mañana — Línea B', sev: 'ok', actor: 'P. Arancibia', estado: 'Cerrado' },
  { ts: '08:00:00', line: 'A', type: 'Operación', desc: 'Inicio turno mañana — Línea A', sev: 'ok', actor: 'R. Soto', estado: 'Cerrado' },
  { ts: '07:58:12', line: 'B', type: 'Operación', desc: 'Calibración sensor flujo F-02', sev: 'ok', actor: 'L. Rojas', estado: 'Cerrado' },
  { ts: '07:45:00', line: 'A', type: 'Operación', desc: 'Verificación temperatura cabezal OK', sev: 'ok', actor: 'L. Rojas', estado: 'Cerrado' },
]

const SEV_COLOR: Record<string, { text: string; bg: string; dot: string }> = {
  ok:       { text: '#15803D', bg: '#DCFCE7', dot: '#16A34A' },
  warning:  { text: '#B45309', bg: '#FEF3C7', dot: '#F59E0B' },
  critical: { text: '#B91C1C', bg: '#FEE2E2', dot: '#DC2626' },
}
const SEV_LABEL: Record<string, string> = { ok: 'OK', warning: 'Media', critical: 'Crítica' }
const ESTADO_COLOR: Record<string, string> = { Cerrado: '#6B7280', Abierto: '#DC2626', 'En curso': '#F59E0B' }

export default function Screen5Events({ navigate, role }: Props) {
  const [lineFilter, setLineFilter] = useState('Todas')
  const [sevFilter, setSevFilter] = useState('Todas')

  const filtered = events.filter((e) => {
    if (lineFilter !== 'Todas' && e.line !== lineFilter) return false
    if (sevFilter !== 'Todas' && e.sev !== sevFilter.toLowerCase()) return false
    return true
  })

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 26px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Eventos</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Log de Eventos</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['Línea', ['Todas', 'A', 'B'], lineFilter, setLineFilter], ['Severidad', ['Todas', 'Critical', 'Warning', 'Ok'], sevFilter, setSevFilter]].map(([label, options, val, setter]: any) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 11, color: '#6B7280' }}>{label}:</span>
                <select value={val} onChange={(e) => setter(e.target.value)} style={{ fontSize: 12, padding: '5px 10px', border: '1px solid #E5E7EB', borderRadius: 7, background: '#F9FAFB', outline: 'none', cursor: 'pointer' }}>
                  {(options as string[]).map((o: string) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <button style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconDownload size={13} color="#6B7280" /> Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto' }}>
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#F9FAFB', zIndex: 5 }}>
              <tr>
                {['Timestamp', 'Línea', 'Tipo', 'Descripción', 'Severidad', 'Operador', 'Estado', ''].map((h) => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => {
                const sc = SEV_COLOR[ev.sev]
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.1s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#6B7280' }}>{ev.ts}</td>
                    <td style={{ padding: '9px 14px' }}>
                      <span style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>Línea {ev.line}</span>
                    </td>
                    <td style={{ padding: '9px 14px', fontSize: 12, color: '#374151' }}>{ev.type}</td>
                    <td style={{ padding: '9px 14px', fontSize: 12, color: '#111827', fontWeight: 500, maxWidth: 280 }}>{ev.desc}</td>
                    <td style={{ padding: '9px 14px' }}>
                      <span style={{ background: sc.bg, color: sc.text, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                        {SEV_LABEL[ev.sev]}
                      </span>
                    </td>
                    <td style={{ padding: '9px 14px', fontSize: 12, color: '#6B7280' }}>{ev.actor}</td>
                    <td style={{ padding: '9px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: ESTADO_COLOR[ev.estado] }}>{ev.estado}</span>
                    </td>
                    <td style={{ padding: '9px 14px' }}>
                      <button onClick={() => navigate('event-detail')} style={{ fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <IconEye size={13} color="#1E40AF" /> Ver
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

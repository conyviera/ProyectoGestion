import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Screen, LineTab, Role } from '../types'
import StatusBadge from '../components/StatusBadge'
import { IconShield, IconArrowRight, IconWrench, IconPause, IconHome } from '../components/Icons'

interface Props {
  navigate: (s: Screen) => void
  initialTab?: LineTab
  role: Role
}

const LINES: Record<LineTab, { name: string; type: string; status: 'ok' | 'paused'; speed: string; product: string; operator: string; shift: string; elapsed: string; machine: string; downtime: string }> = {
  A: { name: 'Línea A', type: 'Envasado Líquidos', status: 'ok', speed: '142 unid/min', product: 'Jugo Naranja 1L', operator: 'R. Soto', shift: 'Mañana', elapsed: '1h 24m', machine: 'ENV-01', downtime: '14 min' },
  B: { name: 'Línea B', type: 'Conservas Vegetales', status: 'paused', speed: '0 unid/min', product: 'Arvejas 340g', operator: 'P. Arancibia', shift: 'Mañana', elapsed: '6 min en pausa', machine: 'CON-02', downtime: '38 min' },
}

const kpisA = [
  { label: 'OEE', value: '71,2%', color: '#F59E0B' },
  { label: 'Disponibilidad', value: '82,1%', color: '#16A34A' },
  { label: 'Rendimiento', value: '88,4%', color: '#16A34A' },
  { label: 'Calidad', value: '96,8%', color: '#16A34A' },
  { label: 'Mermas', value: '2,3%', color: '#F59E0B' },
  { label: 'MTTR', value: '42 min', color: '#16A34A' },
  { label: 'MTBF', value: '5h 12m', color: '#16A34A' },
  { label: 'Uds. prod.', value: '12.450', color: '#1E40AF' },
]

const kpisB = [
  { label: 'OEE', value: '68,4%', color: '#F59E0B' },
  { label: 'Disponibilidad', value: '79,5%', color: '#F59E0B' },
  { label: 'Rendimiento', value: '84,1%', color: '#F59E0B' },
  { label: 'Calidad', value: '95,2%', color: '#F59E0B' },
  { label: 'Mermas', value: '1,9%', color: '#16A34A' },
  { label: 'MTTR', value: '51 min', color: '#F59E0B' },
  { label: 'MTBF', value: '4h 02m', color: '#F59E0B' },
  { label: 'Uds. prod.', value: '9.820', color: '#1E40AF' },
]

const oeeTimeA = [{ t: '07:00', v: 68 }, { t: '08:00', v: 70 }, { t: '09:00', v: 69 }, { t: '10:00', v: 71 }, { t: '11:00', v: 71.2 }]
const oeeTimeB = [{ t: '07:00', v: 64 }, { t: '08:00', v: 66 }, { t: '09:00', v: 67 }, { t: '10:00', v: 68 }, { t: '11:00', v: 68.4 }]

const eventsA = [
  { time: '10:48', type: 'Operación', desc: 'Cambio de lote L-2452', actor: 'R. Soto', sev: 'ok' },
  { time: '10:42', type: 'Falla', desc: 'Sensor temperatura cabezal (EV-2451)', actor: 'Sistema', sev: 'critical' },
  { time: '10:30', type: 'Parada', desc: 'Mantenimiento preventivo', actor: 'Mantenedor', sev: 'warning' },
  { time: '10:12', type: 'Operación', desc: 'Inicio lote L-2451', actor: 'R. Soto', sev: 'ok' },
  { time: '09:55', type: 'Alerta', desc: 'Merma sobre umbral meta', actor: 'Sistema', sev: 'warning' },
  { time: '09:30', type: 'Operación', desc: 'Calibración sensor flujo', actor: 'L. Rojas', sev: 'ok' },
]

const SEV_DOT: Record<string, string> = { ok: '#16A34A', warning: '#F59E0B', critical: '#DC2626' }

export default function Screen3LineDetail({ navigate, initialTab, role }: Props) {
  const [tab, setTab] = useState<LineTab>(initialTab ?? 'A')
  const [loading, setLoading] = useState(false)

  function switchTab(t: LineTab) {
    if (t === tab) return
    setLoading(true)
    setTimeout(() => { setTab(t); setLoading(false) }, 380)
  }

  const line = LINES[tab]
  const kpis = tab === 'A' ? kpisA : kpisB
  const oeeTime = tab === 'A' ? oeeTimeA : oeeTimeB

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 26px', position: 'sticky', top: 0, zIndex: 10 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 6, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => navigate('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 10, fontWeight: 600, padding: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconHome size={10} color="#9CA3AF" /> Inicio
          </button>
          <span>›</span>
          <span>Líneas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {(['A', 'B'] as LineTab[]).map((t) => (
            <button key={t} onClick={() => switchTab(t)} style={{ fontSize: 14, fontWeight: 700, color: tab === t ? '#1E40AF' : '#9CA3AF', background: 'none', border: 'none', borderBottom: tab === t ? '2.5px solid #1E40AF' : '2.5px solid transparent', paddingBottom: 4, cursor: 'pointer', letterSpacing: '-0.01em' }}>
              {LINES[t].name} — {LINES[t].type}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <StatusBadge status={line.status} />
            {/* Botón volver al dashboard */}
            <button
              onClick={() => navigate('dashboard')}
              style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              ← Volver al resumen
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 26px' }}>
          {[200, 120, 180].map((h, i) => <div key={i} className="skeleton" style={{ height: h, borderRadius: 10 }} />)}
        </div>
      ) : (
        <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto' }}>
          {/* Status block */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '14px 18px', marginBottom: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Estado operativo</span>
              <span style={{ fontSize: 10, background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: 5, fontFamily: 'var(--font-mono)', color: '#475569' }}>{line.machine}</span>
            </div>
            <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
              {[
                ['Estado', <StatusBadge key="s" status={line.status} />],
                ['Velocidad', line.speed],
                ['Producto', line.product],
                ['Turno', line.shift],
                ['Operador', line.operator],
                ['Tiempo en estado', line.elapsed],
                ['Tiempo total detenido hoy', <span key="dt" style={{ fontWeight: 700, color: '#DC2626', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{line.downtime}</span>],
              ].map(([label, val]) => (
                <div key={String(label)}>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
            {kpis.map((k) => (
              <div key={k.label} style={{ background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB', padding: '11px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: k.color, fontFamily: 'var(--font-mono)' }}>{k.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            {/* Events */}
            <div style={{ flex: 2, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '11px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Eventos en vivo</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => navigate('events')} style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Ver historial <IconArrowRight size={11} color="#6B7280" />
                  </button>
                  <button onClick={() => navigate('events')} style={{ fontSize: 11, fontWeight: 600, color: '#1E40AF', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Log completo <IconArrowRight size={11} color="#1E40AF" />
                  </button>
                </div>
              </div>
              <div style={{ overflowY: 'auto', maxHeight: 260 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                      {['Hora', 'Tipo', 'Descripción', 'Actor', ''].map((h) => (
                        <th key={h} style={{ textAlign: 'left', padding: '7px 14px', fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {eventsA.map((ev, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280' }}>{ev.time}</td>
                        <td style={{ padding: '8px 14px', color: '#374151' }}>{ev.type}</td>
                        <td style={{ padding: '8px 14px', color: '#111827', fontWeight: 500 }}>{ev.desc}</td>
                        <td style={{ padding: '8px 14px', color: '#6B7280' }}>{ev.actor}</td>
                        <td style={{ padding: '8px 14px' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: SEV_DOT[ev.sev], display: 'inline-block', marginRight: 4 }} />
                          <button onClick={() => navigate('event-detail')} style={{ fontSize: 10, color: '#1E40AF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Ver</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* OEE + links */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#111827', marginBottom: 8 }}>OEE últimas 4h</div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={oeeTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={[60, 75]} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <Line dataKey="v" stroke="#1E40AF" strokeWidth={2} dot={{ fill: '#1E40AF', r: 3 }} name="OEE %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Mantenimiento</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>
                  Próximo PM: <strong style={{ color: '#111827' }}>14:00</strong>
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 10 }}>
                  Última intervención: <strong style={{ color: '#111827' }}>28/05/2026</strong>
                </div>
                {[
                  { label: 'Análisis de paradas', screen: 'downtime', Icon: IconPause },
                  { label: 'Vista de mantenimiento', screen: 'maintenance', Icon: IconWrench },
                ].map((b) => (
                  <button key={b.label} onClick={() => navigate(b.screen as Screen)} style={{ width: '100%', padding: '6px', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', marginBottom: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <b.Icon size={11} color="#6B7280" /> {b.label}
                  </button>
                ))}
                <button onClick={() => navigate('audit')} style={{ width: '100%', padding: '6px', background: '#0F172A', color: '#F1F5F9', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <IconShield size={11} color="#94A3B8" /> Bitácora de auditoría
                </button>
              </div>
            </div>
          </div>

          {/* Gantt */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '14px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Timeline del turno</div>
            <div style={{ position: 'relative', height: 32, background: '#F3F4F6', borderRadius: 6, overflow: 'hidden' }}>
              {[
                { left: '0%', width: '30%', color: '#16A34A' },
                { left: '30%', width: '5%', color: '#F59E0B' },
                { left: '35%', width: '45%', color: '#16A34A' },
                { left: '80%', width: '8%', color: '#DC2626' },
                { left: '88%', width: '12%', color: '#16A34A' },
              ].map((seg, i) => (
                <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: seg.left, width: seg.width, background: seg.color, opacity: 0.85 }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
              {[['#16A34A', 'Operando'], ['#F59E0B', 'Parada prog.'], ['#DC2626', 'Falla']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B7280' }}>
                  <span style={{ width: 10, height: 10, background: c, borderRadius: 2, display: 'inline-block' }} />{l}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

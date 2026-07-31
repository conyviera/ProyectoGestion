import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts'
import type { Screen, Role } from '../types'
import KPICard from '../components/KPICard'
import StatusBadge from '../components/StatusBadge'
import {
  IconDownload, IconDocument, IconClipboard, IconPause, IconWrench,
  IconAlertTriangle, IconXCircle, IconCheckCircle, IconArrowRight, IconEye,
} from '../components/Icons'

interface Props {
  navigate: (s: Screen) => void
  navigateLine: (l: 'A' | 'B') => void
  role: Role
}

const kpiBarData = [
  { name: 'OEE', A: 71.2, B: 68.4, meta: 72 },
  { name: 'Disponib.', A: 82.1, B: 79.5, meta: 80 },
  { name: 'Rendim.', A: 88.4, B: 84.1, meta: 85 },
  { name: 'Calidad', A: 96.8, B: 95.2, meta: 97 },
]

const kpiBarDataFiltered = [
  { name: 'OEE', A: 74.1, B: 70.8, meta: 72 },
  { name: 'Disponib.', A: 85.3, B: 81.2, meta: 80 },
  { name: 'Rendim.', A: 90.1, B: 86.4, meta: 85 },
  { name: 'Calidad', A: 97.5, B: 96.1, meta: 97 },
]

const pieData = [
  { name: 'Falla mecánica', value: 32 },
  { name: 'Cambio formato', value: 24 },
  { name: 'Mantenimiento', value: 18 },
  { name: 'Falta material', value: 14 },
  { name: 'Otros', value: 12 },
]

const PIE_COLORS = ['#DC2626', '#F59E0B', '#1E40AF', '#6366F1', '#9CA3AF']

const alerts = [
  { id: 1, time: '10:42', line: 'A', sev: 'critical' as const, msg: 'Falla sensor temperatura cabezal' },
  { id: 2, time: '10:18', line: 'B', sev: 'critical' as const, msg: 'Parada no planificada 12 min' },
  { id: 3, time: '09:55', line: 'A', sev: 'warning' as const, msg: 'Merma sobre umbral meta' },
  { id: 4, time: '09:30', line: 'B', sev: 'warning' as const, msg: 'Mantenimiento preventivo próximo' },
  { id: 5, time: '08:50', line: 'A', sev: 'ok' as const, msg: 'Reconectada tras corte de conectividad' },
]

const recentEvents = [
  { ts: '10:48', line: 'A', type: 'Operación', desc: 'Inicio lote L-2451', sev: 'ok' },
  { ts: '10:42', line: 'A', type: 'Falla', desc: 'Sensor temperatura cabezal fuera de rango', sev: 'critical' },
  { ts: '10:30', line: 'B', type: 'Parada', desc: 'Mantenimiento programado EN-015', sev: 'warning' },
  { ts: '10:18', line: 'B', type: 'Falla', desc: 'Parada no planificada — mecanismo sellado', sev: 'critical' },
]

const SEV_CONFIG = {
  critical: { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626', Icon: IconXCircle },
  warning:  { bg: '#FFFBEB', border: '#FDE68A', color: '#F59E0B', Icon: IconAlertTriangle },
  ok:       { bg: '#F0FDF4', border: '#BBF7D0', color: '#16A34A', Icon: IconCheckCircle },
}

const SEV_DOT: Record<string, string> = { ok: '#16A34A', warning: '#F59E0B', critical: '#DC2626' }

const oeeSparkA  = [58, 63, 65, 68, 67, 70, 71, 71, 71.2]
const oeeSparkB  = [54, 57, 60, 63, 65, 66, 67, 68, 68.4]
const dispSparkA = [72, 75, 77, 80, 81, 82, 81, 82, 82.1]
const dispSparkB = [70, 72, 75, 77, 78, 79, 79, 79.5, 79.5]
const mermaSparkA = [4.5, 3.8, 3.2, 2.8, 2.5, 2.4, 2.3, 2.3, 2.3]
const mermaSparkB = [4.5, 3.5, 3.0, 2.5, 2.2, 2.0, 1.9, 1.9, 1.9]
const mttrSparkA  = [120, 95, 80, 65, 55, 48, 44, 42, 42]
const mttrSparkB  = [120, 100, 85, 70, 60, 55, 52, 51, 51]

function NavBtn({ label, screen, navigate, Icon }: { label: string; screen: Screen; navigate: (s: Screen) => void; Icon?: React.FC<any> }) {
  return (
    <button
      onClick={() => navigate(screen)}
      style={{ flex: 1, padding: '9px 10px', background: '#fff', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.12s' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#BFDBFE'; (e.currentTarget as HTMLButtonElement).style.color = '#1E40AF' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLButtonElement).style.color = '#374151' }}
    >
      {Icon && <Icon size={13} color="currentColor" />}
      {label}
    </button>
  )
}

export default function Screen2Dashboard({ navigate, navigateLine, role }: Props) {
  const [lineFilter, setLineFilter] = useState('Ambas')
  const [turnoFilter, setTurnoFilter] = useState('Turno actual')
  const [dateFilter, setDateFilter] = useState('Hoy')
  const [filtered, setFiltered] = useState(false)

  const kpiData = filtered ? kpiBarDataFiltered : kpiBarData

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Inicio</div>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
            Panel Ejecutivo · Planta Maipú
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Filtro Línea */}
          <select
            value={lineFilter}
            onChange={e => setLineFilter(e.target.value)}
            style={{ fontSize: 12, border: '1px solid #E5E7EB', borderRadius: 7, padding: '6px 10px', color: '#374151', background: '#F9FAFB', cursor: 'pointer', outline: 'none' }}
          >
            <option>Ambas</option>
            <option>Línea A</option>
            <option>Línea B</option>
          </select>
          {/* Filtro Turno */}
          <select
            value={turnoFilter}
            onChange={e => setTurnoFilter(e.target.value)}
            style={{ fontSize: 12, border: '1px solid #E5E7EB', borderRadius: 7, padding: '6px 10px', color: '#374151', background: '#F9FAFB', cursor: 'pointer', outline: 'none' }}
          >
            <option>Turno actual</option>
            <option>Mañana</option>
            <option>Tarde</option>
            <option>Noche</option>
          </select>
          {/* Filtro Fecha */}
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            style={{ fontSize: 12, border: '1px solid #E5E7EB', borderRadius: 7, padding: '6px 10px', color: '#374151', background: '#F9FAFB', cursor: 'pointer', outline: 'none' }}
          >
            <option>Hoy</option>
            <option>Ayer</option>
            <option>Esta semana</option>
            <option>Este mes</option>
          </select>
          {/* Botón Aplicar filtros */}
          <button
            onClick={() => setFiltered(f => !f)}
            style={{ fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 7, padding: '6px 14px', color: '#fff', background: filtered ? '#16A34A' : '#1E40AF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'background 0.15s' }}
          >
            {filtered ? '✓ Filtros aplicados' : 'Aplicar filtros'}
          </button>
          {/* Exportar — solo Gerente */}
          {role === 'gerente' && (
            <button style={{ fontSize: 12, fontWeight: 600, border: '1px solid #E5E7EB', borderRadius: 7, padding: '6px 12px', color: '#374151', background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconDownload size={13} color="#6B7280" /> Exportar
            </button>
          )}
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#1E40AF,#60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
            {role === 'gerente' ? 'GV' : role === 'supervisor' ? 'RS' : 'LR'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto' }}>
        {/* Filtros activos banner */}
        {filtered && (
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '8px 14px', marginBottom: 14, fontSize: 12, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700 }}>Filtros activos:</span> Línea: {lineFilter} · Turno: {turnoFilter} · Período: {dateFilter}
            <button onClick={() => setFiltered(false)} style={{ marginLeft: 'auto', fontSize: 11, color: '#1E40AF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Limpiar ×</button>
          </div>
        )}

        {/* KPI row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <KPICard title="OEE" lineA={{ value: filtered ? 74.1 : 71.2, status: filtered ? 'ok' : 'warning' }} lineB={{ value: filtered ? 70.8 : 68.4, status: 'warning' }} meta="72" sparkA={oeeSparkA} sparkB={oeeSparkB} />
          <KPICard title="Disponibilidad" lineA={{ value: filtered ? 85.3 : 82.1, status: 'ok' }} lineB={{ value: filtered ? 81.2 : 79.5, status: 'warning' }} meta="80" sparkA={dispSparkA} sparkB={dispSparkB} />
          <KPICard title="Mermas" lineA={{ value: 2.3, status: 'warning' }} lineB={{ value: 1.9, status: 'ok' }} meta="2,0" inverse sparkA={mermaSparkA} sparkB={mermaSparkB} />
          <KPICard title="MTTR" lineA={{ value: 42, status: 'ok' }} lineB={{ value: 51, status: 'warning' }} meta="45" unit=" min" inverse sparkA={mttrSparkA} sparkB={mttrSparkB} />
        </div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          {/* Line cards */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                name: 'Línea A — Envasado Líquidos', code: 'ENV-01', status: 'ok' as const,
                fields: [['Velocidad', '142 unid/min'], ['Producto', 'Jugo Naranja 1L'], ['Operador', 'R. Soto'], ['Turno', 'Mañana'], ['En estado', '1h 24m']],
                line: 'A' as const,
              },
              {
                name: 'Línea B — Conservas Vegetales', code: 'CON-02', status: 'paused' as const,
                fields: [['Velocidad', '0 unid/min'], ['Producto', 'Arvejas 340g'], ['Operador', 'P. Arancibia'], ['Turno', 'Mañana'], ['En pausa', '6 min']],
                line: 'B' as const,
              },
            ].map((ln) => (
              <div key={ln.line} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 5 }}>{ln.name}</div>
                    <StatusBadge status={ln.status} />
                  </div>
                  <span style={{ fontSize: 10, color: '#6B7280', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: 5, fontFamily: 'var(--font-mono)' }}>{ln.code}</span>
                </div>
                <div style={{ display: 'flex', gap: 18, marginBottom: 13, flexWrap: 'wrap' }}>
                  {ln.fields.map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: val === '0 unid/min' ? '#DC2626' : '#111827' }}>{val}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigateLine(ln.line)}
                  style={{ width: '100%', padding: '7px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                >
                  Ver detalle de Línea {ln.line}
                  <IconArrowRight size={12} color="#1E40AF" />
                </button>
              </div>
            ))}
          </div>

          {/* Alert feed */}
          <div style={{ width: 320, flexShrink: 0, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Alertas activas</span>
              <span className="pulse-critical" style={{ background: '#DC2626', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 99, padding: '2px 7px' }}>
                2 críticas
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {alerts.map((a) => {
                const sc = SEV_CONFIG[a.sev]
                return (
                  <div key={a.id} style={{ padding: '10px 14px', borderBottom: '1px solid #F9FAFB', background: sc.bg, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <span style={{ color: sc.color, flexShrink: 0, marginTop: 2 }}>
                      <sc.Icon size={14} color={sc.color} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 3, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#6B7280' }}>{a.time}</span>
                        <span style={{ fontSize: 10, background: '#F3F4F6', padding: '1px 5px', borderRadius: 3, color: '#374151', fontWeight: 600 }}>Línea {a.line}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#111827', marginBottom: 6 }}>{a.msg}</div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button style={{ fontSize: 10, fontWeight: 600, padding: '3px 7px', border: '1px solid #D1D5DB', borderRadius: 4, background: '#fff', cursor: 'pointer', color: '#374151' }}>
                          Reconocer
                        </button>
                        <button onClick={() => navigate('event-detail')} style={{ fontSize: 10, fontWeight: 600, padding: '3px 7px', border: '1px solid #BFDBFE', borderRadius: 4, background: '#EFF6FF', cursor: 'pointer', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <IconEye size={10} color="#1E40AF" /> Ver evento
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ padding: 10 }}>
              <button onClick={() => navigate('alerts')} style={{ width: '100%', padding: '8px', background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                Ver todas las alertas <IconArrowRight size={12} color="#fff" />
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <div style={{ flex: 2, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12 }}>KPIs comparativos — Línea A vs B{filtered ? ' (filtrado)' : ''}</div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={kpiData} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="A" name="Línea A" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="B" name="Línea B" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meta" name="Meta" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 1, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Motivos de parada — 24h</div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={65} paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, background: PIE_COLORS[i], borderRadius: 2, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ color: '#6B7280', flex: 1 }}>{d.name}</span>
                  <span style={{ fontWeight: 600, color: '#111827', fontFamily: 'var(--font-mono)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Eventos recientes */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ padding: '11px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Eventos recientes</span>
            <button onClick={() => navigate('events')} style={{ fontSize: 11, fontWeight: 600, color: '#1E40AF', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver log completo <IconArrowRight size={11} color="#1E40AF" />
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Hora', 'Línea', 'Tipo', 'Descripción', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '7px 14px', fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((ev, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280' }}>{ev.ts}</td>
                  <td style={{ padding: '8px 14px' }}>
                    <span style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4 }}>Línea {ev.line}</span>
                  </td>
                  <td style={{ padding: '8px 14px', color: '#374151' }}>{ev.type}</td>
                  <td style={{ padding: '8px 14px', color: '#111827', fontWeight: 500 }}>{ev.desc}</td>
                  <td style={{ padding: '8px 14px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: SEV_DOT[ev.sev], display: 'inline-block' }} />
                    <button onClick={() => navigate('event-detail')} style={{ marginLeft: 6, fontSize: 10, color: '#1E40AF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          {role === 'gerente' && <NavBtn label="Generar reporte" screen="reports" navigate={navigate} Icon={IconDocument} />}
          <NavBtn label="Ir a Eventos" screen="events" navigate={navigate} Icon={IconClipboard} />
          <NavBtn label="Ir a Paradas" screen="downtime" navigate={navigate} Icon={IconPause} />
          <NavBtn label="Ir a Mantenimiento" screen="maintenance" navigate={navigate} Icon={IconWrench} />
        </div>
      </div>
    </div>
  )
}

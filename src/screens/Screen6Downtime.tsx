import type { Screen } from '../types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { IconWrench } from '../components/Icons'

interface Props { navigate: (s: Screen) => void }

const paretoData = [
  { name: 'Falla mecánica', value: 32, color: '#DC2626' },
  { name: 'Cambio formato', value: 24, color: '#F59E0B' },
  { name: 'Mantenimiento', value: 18, color: '#1E40AF' },
  { name: 'Falta material', value: 14, color: '#6366F1' },
  { name: 'Otros', value: 12, color: '#9CA3AF' },
]

const stops = [
  { inicio: '10:18', fin: '10:30', dur: '12 min', motivo: 'Falla mecánica', line: 'B', op: 'P. Arancibia', mttr: 12, color: '#DC2626' },
  { inicio: '09:42', fin: '09:51', dur: '9 min', motivo: 'Cambio formato', line: 'A', op: 'R. Soto', mttr: 9, color: '#F59E0B' },
  { inicio: '09:10', fin: '09:28', dur: '18 min', motivo: 'Falla mecánica', line: 'B', op: 'L. Rojas', mttr: 18, color: '#DC2626' },
  { inicio: '08:45', fin: '08:52', dur: '7 min', motivo: 'Falta de material', line: 'A', op: 'R. Soto', mttr: 7, color: '#6366F1' },
  { inicio: '08:30', fin: '08:33', dur: '3 min', motivo: 'Mantenimiento preventivo', line: 'B', op: 'L. Rojas', mttr: 3, color: '#1E40AF' },
  { inicio: '07:50', fin: '07:56', dur: '6 min', motivo: 'Falla mecánica', line: 'A', op: 'R. Soto', mttr: 6, color: '#DC2626' },
  { inicio: '07:30', fin: '07:32', dur: '2 min', motivo: 'Otros', line: 'B', op: 'Sistema', mttr: 2, color: '#9CA3AF' },
]

const kpis = [
  { label: 'Paradas totales', val: '7', sub: 'A: 3 · B: 4', color: '#1E40AF' },
  { label: 'Tiempo total parado', val: '48 min', sub: 'Turno actual', color: '#DC2626' },
  { label: 'Parada más larga', val: '18 min', sub: 'Línea B — Falla mecánica', color: '#F59E0B' },
  { label: 'Disponibilidad prom.', val: '80,8%', sub: 'Líneas A + B', color: '#16A34A' },
]

export default function Screen6Downtime({ navigate }: Props) {
  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 26px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Paradas</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Análisis de Paradas — Hoy</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['Hoy', 'Semana'], ['Ambas líneas', 'Línea A', 'Línea B']].map((opts, i) => (
              <select key={i} style={{ fontSize: 12, padding: '5px 10px', border: '1px solid #E5E7EB', borderRadius: 7, background: '#F9FAFB', outline: 'none', cursor: 'pointer' }}>
                {opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto' }}>
        {/* KPIs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {kpis.map((k) => (
            <div key={k.label} style={{ flex: 1, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '13px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: k.color, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', marginBottom: 2 }}>{k.val}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Pareto de motivos de parada</div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={paretoData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} formatter={(v) => [`${v}%`]} />
                <Bar dataKey="value" name="% tiempo" radius={[4, 4, 0, 0]}>
                  {paretoData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 1, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Timeline del turno</div>
            {(['A', 'B'] as const).map((ln) => (
              <div key={ln} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Línea {ln}</div>
                <div style={{ position: 'relative', height: 26, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                  {ln === 'A' ? (
                    <>
                      <div style={{ position: 'absolute', left: '0%', width: '22%', top: 0, bottom: 0, background: '#16A34A', opacity: 0.85 }} />
                      <div style={{ position: 'absolute', left: '22%', width: '4%', top: 0, bottom: 0, background: '#F59E0B', opacity: 0.85 }} />
                      <div style={{ position: 'absolute', left: '26%', width: '58%', top: 0, bottom: 0, background: '#16A34A', opacity: 0.85 }} />
                      <div style={{ position: 'absolute', left: '84%', width: '3%', top: 0, bottom: 0, background: '#DC2626', opacity: 0.85 }} />
                      <div style={{ position: 'absolute', left: '87%', width: '13%', top: 0, bottom: 0, background: '#16A34A', opacity: 0.85 }} />
                    </>
                  ) : (
                    <>
                      <div style={{ position: 'absolute', left: '0%', width: '35%', top: 0, bottom: 0, background: '#16A34A', opacity: 0.85 }} />
                      <div style={{ position: 'absolute', left: '35%', width: '8%', top: 0, bottom: 0, background: '#DC2626', opacity: 0.85 }} />
                      <div style={{ position: 'absolute', left: '43%', width: '35%', top: 0, bottom: 0, background: '#16A34A', opacity: 0.85 }} />
                      <div style={{ position: 'absolute', left: '78%', width: '6%', top: 0, bottom: 0, background: '#DC2626', opacity: 0.85 }} />
                      <div style={{ position: 'absolute', left: '84%', width: '16%', top: 0, bottom: 0, background: '#F59E0B', opacity: 0.85 }} />
                    </>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {[['#16A34A', 'Operando'], ['#DC2626', 'Falla'], ['#F59E0B', 'Parada/PM']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6B7280' }}>
                  <span style={{ width: 10, height: 10, background: c, borderRadius: 2, display: 'inline-block' }} />{l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stops table */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', fontSize: 12, fontWeight: 700, color: '#111827' }}>
            Detalle de paradas
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Inicio', 'Fin', 'Duración', 'Motivo', 'Línea', 'Operador', 'MTTR', ''].map((h) => (
                  <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stops.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#6B7280' }}>{s.inicio}</td>
                  <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#6B7280' }}>{s.fin}</td>
                  <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: '#111827' }}>{s.dur}</td>
                  <td style={{ padding: '9px 14px', fontSize: 12, color: '#111827' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 8, height: 8, background: s.color, borderRadius: 2, display: 'inline-block' }} />
                      {s.motivo}
                    </span>
                  </td>
                  <td style={{ padding: '9px 14px' }}>
                    <span style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>Línea {s.line}</span>
                  </td>
                  <td style={{ padding: '9px 14px', fontSize: 12, color: '#6B7280' }}>{s.op}</td>
                  <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: s.mttr > 45 ? '#DC2626' : '#16A34A', fontWeight: 700 }}>{s.mttr} min</td>
                  <td style={{ padding: '9px 14px' }}>
                    <button onClick={() => navigate('maintenance')} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconWrench size={11} color="#B45309" /> Asignar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

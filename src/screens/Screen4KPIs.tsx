import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { IconDownload } from '../components/Icons'

const tableData = [
  { kpi: 'OEE',           a: '71,2%',  b: '68,4%',  meta: '72%',    delta: '▼', colorA: '#F59E0B', colorB: '#F59E0B' },
  { kpi: 'Disponibilidad',a: '82,1%',  b: '79,5%',  meta: '80%',    delta: '▲', colorA: '#16A34A', colorB: '#F59E0B' },
  { kpi: 'Rendimiento',   a: '88,4%',  b: '84,1%',  meta: '85%',    delta: '▼', colorA: '#16A34A', colorB: '#F59E0B' },
  { kpi: 'Calidad',       a: '96,8%',  b: '95,2%',  meta: '97%',    delta: '▼', colorA: '#F59E0B', colorB: '#DC2626' },
  { kpi: 'Mermas',        a: '2,3%',   b: '1,9%',   meta: '2,0%',   delta: '▲', colorA: '#F59E0B', colorB: '#16A34A' },
  { kpi: 'MTTR',          a: '42 min', b: '51 min', meta: '45 min', delta: '▼', colorA: '#16A34A', colorB: '#F59E0B' },
  { kpi: 'MTBF',          a: '5h 12m', b: '4h 02m', meta: '6h',     delta: '▲', colorA: '#F59E0B', colorB: '#DC2626' },
]

const oeeTime = [
  { t: '07:00', A: 68, B: 64 }, { t: '08:00', A: 70, B: 66 }, { t: '09:00', A: 69, B: 67 },
  { t: '10:00', A: 71, B: 68 }, { t: '11:00', A: 71.2, B: 68.4 }, { t: '12:00', A: 70, B: 67 }, { t: '13:00', A: 71, B: 68 },
]

const paretoData = [
  { name: 'Disponib.', value: 48, fill: '#DC2626' },
  { name: 'Rendim.', value: 31, fill: '#F59E0B' },
  { name: 'Calidad', value: 21, fill: '#1E40AF' },
]

export default function Screen4KPIs() {
  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 26px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>KPIs</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>KPIs Detallados — Análisis</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['Rango', 'Hoy'], ['Líneas', 'Ambas'], ['Turno', 'Todos']].map(([label, val]) => (
              <select key={label} style={{ fontSize: 12, padding: '5px 10px', border: '1px solid #E5E7EB', borderRadius: 7, background: '#F9FAFB', color: '#374151', outline: 'none', cursor: 'pointer' }}>
                <option>{val}</option>
              </select>
            ))}
            <button style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconDownload size={13} color="#fff" /> Exportar
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto' }}>
        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #F3F4F6', fontSize: 12, fontWeight: 700, color: '#111827' }}>
            Tabla comparativa — Línea A vs B
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['KPI', 'Línea A', 'Línea B', 'Meta', 'Delta'].map((h) => (
                  <th key={h} style={{ padding: '9px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={row.kpi} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA', borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF6FF')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA')}
                >
                  <td style={{ padding: '10px 18px', fontWeight: 700, color: '#111827', fontSize: 13 }}>{row.kpi}</td>
                  <td style={{ padding: '10px 18px' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: row.colorA }}>{row.a}</span></td>
                  <td style={{ padding: '10px 18px' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: row.colorB }}>{row.b}</span></td>
                  <td style={{ padding: '10px 18px', fontSize: 12, color: '#6B7280', fontFamily: 'var(--font-mono)' }}>{row.meta}</td>
                  <td style={{ padding: '10px 18px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: row.delta === '▲' ? '#16A34A' : '#DC2626' }}>{row.delta}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 2, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Tendencia OEE — últimas 24h</div>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={oeeTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[60, 75]} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="A" name="Línea A" stroke="#1E40AF" strokeWidth={2} dot={{ r: 3 }} />
                <Line dataKey="B" name="Línea B" stroke="#93C5FD" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 1, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Pareto de pérdidas OEE</div>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={paretoData} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={75} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Bar dataKey="value" name="% pérdida" radius={[0, 4, 4, 0]}>
                  {paretoData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

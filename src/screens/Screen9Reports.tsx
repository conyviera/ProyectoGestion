import { useState } from 'react'
import { IconDocument, IconBarChart, IconPause, IconShield, IconDownload, IconClose } from '../components/Icons'

const reportTypes = [
  { id: 'daily',    Icon: IconDocument,  label: 'Reporte diario de operación',    desc: 'Resumen completo del turno y jornada' },
  { id: 'oee',     Icon: IconBarChart,   label: 'Reporte de OEE semanal',         desc: 'Tendencia y análisis de disponibilidad' },
  { id: 'downtime',Icon: IconPause,      label: 'Reporte de paradas y MTTR',      desc: 'Análisis de downtime y tiempos de respuesta' },
  { id: 'waste',   Icon: IconDocument,   label: 'Reporte de mermas',              desc: 'Mermas por línea, producto y turno' },
  { id: 'audit',   Icon: IconShield,     label: 'Reporte de auditoría (RF-08)',   desc: 'Log inalterable para auditoría externa' },
]

const history = [
  { name: 'Rep_OEE_Sem22',     date: '29/06', user: 'C. Viera',   fmt: 'PDF' },
  { name: 'Rep_Paradas_Jun',   date: '28/06', user: 'G. Valdés',  fmt: 'Excel' },
  { name: 'Rep_Mermas_Jun',    date: '27/06', user: 'C. Viera',   fmt: 'PDF' },
  { name: 'Rep_Diario_27jun',  date: '27/06', user: 'R. Soto',    fmt: 'PDF' },
  { name: 'Rep_Auditoria_Q2',  date: '25/06', user: 'G. Valdés',  fmt: 'PDF' },
]

export default function Screen9Reports() {
  const [selected, setSelected] = useState('oee')
  const [format, setFormat] = useState<'PDF' | 'Excel' | 'CSV'>('PDF')
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 26px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Reportes</div>
        <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Centro de Reportes</h1>
      </div>

      <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
          {/* Type selector */}
          <div style={{ width: 268, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {reportTypes.map((r) => {
              const isSelected = selected === r.id
              return (
                <button key={r.id} onClick={() => setSelected(r.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 13px', background: isSelected ? '#EFF6FF' : '#fff', border: `1.5px solid ${isSelected ? '#BFDBFE' : '#E5E7EB'}`, borderRadius: 9, cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s' }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>
                    <r.Icon size={15} color={isSelected ? '#1E40AF' : '#9CA3AF'} />
                  </span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? '#1E40AF' : '#111827', marginBottom: 2 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{r.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Config */}
          <div style={{ flex: 1, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Configurar reporte</div>

            <div style={{ display: 'flex', gap: 10 }}>
              {[['Desde', '2026-06-01'], ['Hasta', '2026-06-29']].map(([label, def]) => (
                <div key={label} style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                  <input type="date" defaultValue={def} style={{ width: '100%', padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#111827' }} />
                </div>
              ))}
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Líneas</label>
              <div style={{ display: 'flex', gap: 14 }}>
                {['Línea A', 'Línea B'].map((l) => (
                  <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', color: '#374151' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#1E40AF' }} /> {l}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>KPIs a incluir</label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['OEE', 'Disponibilidad', 'Mermas', 'MTTR', 'Eventos', 'Alertas'].map((k) => (
                  <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer', color: '#374151' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#1E40AF' }} /> {k}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Formato</label>
              <div style={{ display: 'flex', gap: 14 }}>
                {(['PDF', 'Excel', 'CSV'] as const).map((f) => (
                  <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', color: '#374151' }}>
                    <input type="radio" checked={format === f} onChange={() => setFormat(f)} style={{ accentColor: '#1E40AF' }} /> {f}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowPreview(true)} style={{ flex: 1, padding: '10px', background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <IconDocument size={14} color="#fff" /> Generar reporte
              </button>
              <button style={{ padding: '10px 16px', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconDownload size={14} color="#6B7280" /> Descargar
              </button>
            </div>
          </div>
        </div>

        {/* History */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #F3F4F6', fontSize: 12, fontWeight: 700, color: '#111827' }}>Historial de reportes</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Nombre', 'Fecha', 'Generado por', 'Formato', ''].map((h) => (
                  <th key={h} style={{ padding: '8px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '9px 18px', fontSize: 12, fontWeight: 600, color: '#111827', fontFamily: 'var(--font-mono)' }}>{r.name}</td>
                  <td style={{ padding: '9px 18px', fontSize: 12, color: '#6B7280' }}>{r.date}/2026</td>
                  <td style={{ padding: '9px 18px', fontSize: 12, color: '#374151' }}>{r.user}</td>
                  <td style={{ padding: '9px 18px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, background: r.fmt === 'PDF' ? '#FEE2E2' : '#DCFCE7', color: r.fmt === 'PDF' ? '#B91C1C' : '#15803D', padding: '2px 7px', borderRadius: 4 }}>{r.fmt}</span>
                  </td>
                  <td style={{ padding: '9px 18px' }}>
                    <button style={{ fontSize: 11, fontWeight: 600, padding: '4px 9px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconDownload size={11} color="#1E40AF" /> Re-descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowPreview(false)}>
          <div style={{ background: '#fff', borderRadius: 14, width: 540, padding: 26, boxShadow: '0 24px 64px rgba(0,0,0,0.24)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Vista previa — Reporte</span>
              <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                <IconClose size={18} color="#9CA3AF" />
              </button>
            </div>
            <div style={{ background: '#F5F7FA', borderRadius: 8, padding: 18, border: '1px solid #E5E7EB', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1E40AF', marginBottom: 3 }}>NextGen Nutri — NutriIndustria S.A.</div>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12 }}>Reporte OEE Semanal · Planta Maipú · 01/06–29/06/2026</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[['OEE Prom. Línea A', '71,2%'], ['OEE Prom. Línea B', '68,4%'], ['Disponibilidad A', '82,1%'], ['MTTR promedio', '46,5 min']].map(([label, val]) => (
                  <div key={label} style={{ background: '#fff', padding: '8px 12px', borderRadius: 6, border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowPreview(false)} style={{ flex: 1, padding: '9px', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cerrar</button>
              <button onClick={() => setShowPreview(false)} style={{ flex: 2, padding: '9px', background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <IconDownload size={13} color="#fff" /> Descargar {format}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

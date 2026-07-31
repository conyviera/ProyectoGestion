import { useState } from 'react'
import { IconUsers, IconTarget, IconFactory, IconLink, IconPlus, IconRefresh } from '../components/Icons'

type Tab = 'users' | 'thresholds' | 'lines' | 'erp'

const users = [
  { name: 'C. Gloria Valdés',  user: 'g.valdes',    role: 'Gerente',    plant: 'Maipú', status: 'Activo' },
  { name: 'C. Viera Rojas',    user: 'c.viera',     role: 'QA',         plant: 'Maipú', status: 'Activo' },
  { name: 'R. Soto Pérez',     user: 'r.soto',      role: 'Operador',   plant: 'Maipú', status: 'Activo' },
  { name: 'P. Arancibia',      user: 'p.arancibia', role: 'Operador',   plant: 'Maipú', status: 'Activo' },
  { name: 'L. Rojas Meza',     user: 'l.rojas',     role: 'Mantenedor', plant: 'Maipú', status: 'Activo' },
  { name: 'M. Torres Silva',   user: 'm.torres',    role: 'Mantenedor', plant: 'Maipú', status: 'Inactivo' },
]

const roleMatrix: [string, boolean, boolean, boolean][] = [
  ['Ver dashboard',       true, true, true],
  ['Ver KPIs detallados', true, true, false],
  ['Editar umbrales',     true, false, false],
  ['Gestionar usuarios',  true, false, false],
  ['Reconocer alertas',   true, true, true],
  ['Generar reportes',    true, true, false],
  ['Ver auditoría',       true, true, false],
  ['Integración ERP',     true, false, false],
]

const erpLogs = [
  { ts: '10:48:12', status: 'ok',      records: 142 },
  { ts: '10:43:12', status: 'ok',      records: 138 },
  { ts: '10:38:12', status: 'ok',      records: 144 },
  { ts: '10:33:12', status: 'warning', records: 0 },
  { ts: '10:28:12', status: 'ok',      records: 140 },
]

const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
  Gerente:    { bg: '#EFF6FF', color: '#1E40AF' },
  QA:         { bg: '#F3E8FF', color: '#7C3AED' },
  Operador:   { bg: '#F0FDF4', color: '#15803D' },
  Mantenedor: { bg: '#FFF7ED', color: '#C2410C' },
}

const TABS: { id: Tab; label: string; Icon: React.FC<any> }[] = [
  { id: 'users',      label: 'Usuarios',          Icon: IconUsers },
  { id: 'thresholds', label: 'Umbrales',           Icon: IconTarget },
  { id: 'lines',      label: 'Líneas y productos', Icon: IconFactory },
  { id: 'erp',        label: 'Integración ERP',    Icon: IconLink },
]

export default function Screen11Config() {
  const [tab, setTab] = useState<Tab>('users')
  const [oee, setOee]       = useState('72')
  const [disp, setDisp]     = useState('80')
  const [mermas, setMermas] = useState('2.0')
  const [mttr, setMttr]     = useState('45')
  const [saved, setSaved]   = useState(false)

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 26px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Configuración</div>
        <div style={{ display: 'flex', gap: 22 }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: tab === id ? '#1E40AF' : '#9CA3AF', background: 'none', border: 'none', borderBottom: tab === id ? '2.5px solid #1E40AF' : '2.5px solid transparent', paddingBottom: 5, cursor: 'pointer' }}>
              <Icon size={14} color={tab === id ? '#1E40AF' : '#9CA3AF'} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto' }}>

        {/* USERS */}
        {tab === 'users' && (
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 2, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Usuarios del sistema</span>
                <button style={{ fontSize: 12, fontWeight: 700, padding: '6px 12px', background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <IconPlus size={12} color="#fff" /> Nuevo usuario
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Nombre', 'Usuario', 'Rol', 'Planta', 'Estado', 'Acciones'].map((h) => (
                      <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const rs = ROLE_STYLE[u.role] ?? { bg: '#F1F5F9', color: '#475569' }
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '9px 16px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{u.name}</td>
                        <td style={{ padding: '9px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#6B7280' }}>{u.user}</td>
                        <td style={{ padding: '9px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 5, background: rs.bg, color: rs.color }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '9px 16px', fontSize: 12, color: '#374151' }}>{u.plant}</td>
                        <td style={{ padding: '9px 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: u.status === 'Activo' ? '#15803D' : '#DC2626' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.status === 'Activo' ? '#16A34A' : '#DC2626', display: 'inline-block' }} />
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '9px 16px', display: 'flex', gap: 5 }}>
                          <button style={{ fontSize: 11, padding: '3px 7px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 5, cursor: 'pointer', color: '#374151' }}>Editar</button>
                          <button style={{ fontSize: 11, padding: '3px 7px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 5, cursor: 'pointer', color: '#B91C1C' }}>Desact.</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ width: 250, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '13px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', alignSelf: 'flex-start' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 11 }}>Permisos por rol</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', fontSize: 10 }}>
                <div style={{ padding: '4px 0', color: '#9CA3AF', fontWeight: 600 }}>Capacidad</div>
                {['Ger', 'Sup', 'Op'].map((r) => (
                  <div key={r} style={{ padding: '4px 5px', color: '#1E40AF', fontWeight: 700, textAlign: 'center' }}>{r}</div>
                ))}
                {roleMatrix.map(([label, ger, sup, op]) => (
                  <>
                    <div key={label + 'l'} style={{ padding: '4px 0', fontSize: 11, color: '#374151', borderTop: '1px solid #F3F4F6' }}>{label}</div>
                    {[ger, sup, op].map((v, i) => (
                      <div key={i} style={{ padding: '4px 5px', textAlign: 'center', borderTop: '1px solid #F3F4F6' }}>
                        <span style={{ fontSize: 11, color: v ? '#16A34A' : '#D1D5DB' }}>{v ? '✓' : '✗'}</span>
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* THRESHOLDS */}
        {tab === 'thresholds' && (
          <div style={{ maxWidth: 600, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 18 }}>Umbrales de KPIs meta</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 22 }}>
              {[['OEE meta (%)', oee, setOee, '#16A34A'], ['Disponibilidad meta (%)', disp, setDisp, '#16A34A'], ['Mermas máx (%)', mermas, setMermas, '#F59E0B'], ['MTTR máx (min)', mttr, setMttr, '#F59E0B']].map(([label, val, setter, color]: any) => (
                <div key={label}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="number" value={val} onChange={(e) => setter(e.target.value)} style={{ width: 100, padding: '7px 12px', border: `1.5px solid ${color}40`, borderRadius: 7, fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color, outline: 'none', textAlign: 'center' }} />
                    <div style={{ height: 5, flex: 1, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(parseFloat(val) / 100 * 100, 100)}%`, background: color, borderRadius: 3, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 11 }}>Disparadores de alerta</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              {[['OEE < 65%', 'Alerta crítica', '#DC2626'], ['OEE < 70%', 'Alerta media', '#F59E0B'], ['Mermas > 3,0%', 'Alerta media', '#F59E0B'], ['Mermas > 4,0%', 'Alerta crítica', '#DC2626'], ['MTTR > 45 min', 'Alerta media', '#F59E0B'], ['Disponib. < 70%', 'Alerta crítica', '#DC2626']].map(([cond, result, color]) => (
                <div key={cond} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: '#F9FAFB', borderRadius: 6, fontSize: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#374151', width: 120 }}>{cond}</span>
                  <span style={{ color: '#D1D5DB' }}>→</span>
                  <span style={{ fontWeight: 600, color }}>{result}</span>
                </div>
              ))}
            </div>
            <button onClick={save} style={{ width: '100%', padding: '10px', background: saved ? '#16A34A' : '#1E40AF', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background 0.3s' }}>
              {saved ? 'Cambios guardados' : 'Guardar cambios'}
            </button>
          </div>
        )}

        {/* LINES */}
        {tab === 'lines' && (
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Líneas configuradas</div>
            {[
              { name: 'Línea A — Envasado Líquidos', machine: 'ENV-01', products: ['Jugo Naranja 1L', 'Jugo Manzana 1L', 'Néctar Durazno 1L', 'Bebida Vegetal 1L'] },
              { name: 'Línea B — Conservas Vegetales', machine: 'CON-02', products: ['Arvejas 340g', 'Maíz Dulce 340g', 'Tomate Pelado 400g', 'Garbanzos 400g'] },
            ].map((ln) => (
              <div key={ln.name} style={{ background: '#F9FAFB', borderRadius: 9, border: '1px solid #E5E7EB', padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 11 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{ln.name}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{ln.machine}</div>
                  </div>
                  <span style={{ fontSize: 11, background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: 5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} /> Activa
                  </span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Productos</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {ln.products.map((p) => (
                    <span key={p} style={{ fontSize: 12, background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '3px 9px', borderRadius: 99 }}>{p}</span>
                  ))}
                  <button style={{ fontSize: 12, background: 'none', border: '1px dashed #D1D5DB', borderRadius: 99, padding: '3px 9px', cursor: 'pointer', color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <IconPlus size={10} color="#9CA3AF" /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERP */}
        {tab === 'erp' && (
          <div style={{ maxWidth: 680, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Estado de integración ERP</div>
                <span style={{ fontSize: 12, background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: 99, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} /> Sincronizado · Última sync 10:48:12
                </span>
              </div>
              <button style={{ fontSize: 12, fontWeight: 700, padding: '8px 14px', background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconRefresh size={13} color="#fff" /> Forzar sincronización
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 20 }}>
              {[['Endpoint', 'https://erp.nutriindustria.cl/api/v2/production'], ['API Key', '••••••••••••••••Kz9'], ['Frecuencia sync', 'Cada 5 minutos'], ['Entidad', 'Planta Maipú — Código MP-001'], ['Datos enviados', 'OEE, Producción, Mermas, Paradas, KPIs']].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                  <div style={{ fontSize: 13, color: '#111827', fontFamily: label === 'Endpoint' || label === 'API Key' ? 'var(--font-mono)' : undefined }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Log de sincronizaciones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {erpLogs.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 11px', background: '#F9FAFB', borderRadius: 6, fontSize: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#6B7280', width: 68 }}>{l.ts}</span>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: l.status === 'ok' ? '#16A34A' : '#F59E0B', flexShrink: 0 }} />
                  <span style={{ flex: 1, color: l.status === 'ok' ? '#15803D' : '#B45309', fontWeight: 500 }}>
                    {l.status === 'ok' ? `Sincronización exitosa · ${l.records} registros` : 'Timeout — reintentando'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

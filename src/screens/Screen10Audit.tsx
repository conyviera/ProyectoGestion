import { IconShield, IconLock, IconDownload } from '../components/Icons'

const logs = [
  { ts: '10:48:12', user: 'c.viera',      role: 'QA',         action: 'Modificar umbral',    module: 'Configuración', record: 'KPI-MTTR-45',       ip: '192.168.10.42' },
  { ts: '10:42:03', user: 'sistema',       role: 'IoT',        action: 'Crear evento',         module: 'Eventos',       record: 'EV-2451',           ip: 'Gateway-A' },
  { ts: '10:30:00', user: 'r.soto',        role: 'Operador',   action: 'Iniciar lote',         module: 'Producción',    record: 'L-2451',            ip: 'Tablet-A03' },
  { ts: '10:18:44', user: 'sistema',       role: 'IoT',        action: 'Crear alerta',         module: 'Alertas',       record: 'ALT-0892',          ip: 'Gateway-B' },
  { ts: '09:55:30', user: 'g.valdes',      role: 'Gerente',    action: 'Consultar reporte',    module: 'Reportes',      record: 'Rep_OEE_Sem22',     ip: '192.168.10.10' },
  { ts: '09:42:10', user: 'r.soto',        role: 'Operador',   action: 'Cambio formato',       module: 'Producción',    record: 'L-2450',            ip: 'Tablet-A03' },
  { ts: '09:30:00', user: 'sistema',       role: 'IoT',        action: 'Crear alerta',         module: 'Alertas',       record: 'ALT-0891',          ip: 'Gateway-B' },
  { ts: '09:15:22', user: 'm.garcia',      role: 'PM',         action: 'Aprobar cambio',       module: 'Cambios',       record: 'CR-012',            ip: '192.168.10.05' },
  { ts: '08:50:22', user: 'sistema',       role: 'IoT',        action: 'Reconexión Gateway',   module: 'Conectividad',  record: 'GW-A-RECONNECT',    ip: 'Gateway-A' },
  { ts: '08:30:15', user: 'p.arancibia',   role: 'Operador',   action: 'Inicio turno',         module: 'Producción',    record: 'SHIFT-B-AM',        ip: 'Tablet-B02' },
  { ts: '08:00:00', user: 'r.soto',        role: 'Operador',   action: 'Inicio turno',         module: 'Producción',    record: 'SHIFT-A-AM',        ip: 'Tablet-A03' },
  { ts: '07:45:00', user: 'l.rojas',       role: 'Mantenedor', action: 'Cerrar ticket',        module: 'Mantenimiento', record: 'MT-2026-045',       ip: '192.168.10.88' },
  { ts: '07:30:00', user: 'g.valdes',      role: 'Gerente',    action: 'Login sistema',        module: 'Auth',          record: 'SESSION-GV-2026',   ip: '192.168.10.10' },
]

const ROLE_COLOR: Record<string, string> = {
  Gerente: '#60A5FA', QA: '#A78BFA', Operador: '#4ADE80', IoT: '#FBBF24',
  PM: '#94A3B8', Mantenedor: '#FB923C', Auth: '#94A3B8',
}

export default function Screen10Audit() {
  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      {/* Dark header */}
      <div style={{ background: '#0F172A', borderBottom: '1px solid #1E293B', padding: '13px 26px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 10, color: '#475569', marginBottom: 5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Auditoría</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconShield size={18} color="#60A5FA" strokeWidth={2} />
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
              Bitácora de Auditoría — Log Inalterable
            </h1>
          </div>
          <button style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', background: '#1E40AF', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconDownload size={13} color="#fff" /> Exportar log
          </button>
        </div>
      </div>

      {/* Immutability banner */}
      <div style={{ background: '#1E293B', padding: '9px 26px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #0F172A' }}>
        <IconLock size={13} color="#475569" />
        <span style={{ fontSize: 12, color: '#94A3B8' }}>
          <strong style={{ color: '#F1F5F9' }}>Este registro no puede ser modificado.</strong>
          {' '}Exportable solo para auditoría externa · Hash SHA-256 verificado · RFC 3161 compliant
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#475569', background: '#0F172A', padding: '3px 9px', borderRadius: 5 }}>
          HASH: a3f2...d9c1
        </span>
      </div>

      {/* Filters */}
      <div style={{ background: '#1E293B', padding: '9px 26px', display: 'flex', gap: 10, borderBottom: '1px solid #0F172A' }}>
        {[['Usuario', ['Todos', 'r.soto', 'g.valdes', 'c.viera', 'sistema']], ['Módulo', ['Todos', 'Producción', 'Alertas', 'Configuración', 'Auth']], ['Acción', ['Todas', 'Crear evento', 'Login', 'Modificar umbral']]].map(([label, opts]: any) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#475569' }}>{label}:</span>
            <select style={{ fontSize: 12, padding: '4px 9px', border: '1px solid #334155', borderRadius: 6, background: '#0F172A', color: '#94A3B8', outline: 'none', cursor: 'pointer' }}>
              {opts.map((o: string) => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#475569' }}>Fecha:</span>
          <input type="date" defaultValue="2026-07-29" style={{ fontSize: 12, padding: '4px 9px', border: '1px solid #334155', borderRadius: 6, background: '#0F172A', color: '#94A3B8', outline: 'none' }} />
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto' }}>
        <div style={{ background: '#1E293B', borderRadius: 10, border: '1px solid #334155', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#0F172A', zIndex: 5 }}>
              <tr>
                {['Timestamp', 'Usuario', 'Rol', 'Acción', 'Módulo', 'Registro', 'IP / Dispositivo'].map((h) => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #1E293B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1E293B' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#263548')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#64748B' }}>{l.ts}</td>
                  <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#F1F5F9', fontWeight: 600 }}>{l.user}</td>
                  <td style={{ padding: '8px 14px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: ROLE_COLOR[l.role] ?? '#94A3B8', border: `1px solid ${(ROLE_COLOR[l.role] ?? '#94A3B8') + '33'}`, padding: '2px 6px', borderRadius: 4 }}>
                      {l.role}
                    </span>
                  </td>
                  <td style={{ padding: '8px 14px', fontSize: 12, color: '#CBD5E1' }}>{l.action}</td>
                  <td style={{ padding: '8px 14px', fontSize: 12, color: '#64748B' }}>{l.module}</td>
                  <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#60A5FA' }}>{l.record}</td>
                  <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#475569' }}>{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

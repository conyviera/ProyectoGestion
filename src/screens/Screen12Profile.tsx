import type { Role } from '../types'
import { IconUser, IconLogIn } from '../components/Icons'

interface Screen12ProfileProps {
  role: Role
  onLogout: () => void
}

const PROFILE: Record<Role, {
  name: string
  initials: string
  user: string
  email: string
  phone: string
  roleLabel: string
  plant: string
  color: string
  lastAccess: string
}> = {
  gerente: {
    name: 'C. Gloria Valdés',
    initials: 'GV',
    user: 'g.valdes',
    email: 'g.valdes@nutriindustria.cl',
    phone: '+56 9 1234 5678',
    roleLabel: 'Gerente',
    plant: 'Planta Maipú',
    color: '#1E40AF',
    lastAccess: '30-07-2026 09:12',
  },
  supervisor: {
    name: 'R. Soto',
    initials: 'RS',
    user: 'r.soto',
    email: 'r.soto@nutriindustria.cl',
    phone: '+56 9 8765 4321',
    roleLabel: 'Supervisor',
    plant: 'Planta Maipú',
    color: '#7C3AED',
    lastAccess: '30-07-2026 08:47',
  },
  tecnico: {
    name: 'L. Rojas',
    initials: 'LR',
    user: 'l.rojas',
    email: 'l.rojas@nutriindustria.cl',
    phone: '+56 9 5555 1122',
    roleLabel: 'Técnico Mant.',
    plant: 'Planta Maipú',
    color: '#B45309',
    lastAccess: '30-07-2026 07:30',
  },
}

export default function Screen12Profile({ role, onLogout }: Screen12ProfileProps) {
  const p = PROFILE[role]

  const fields: [string, string][] = [
    ['Usuario', p.user],
    ['Correo electrónico', p.email],
    ['Teléfono', p.phone],
    ['Rol', p.roleLabel],
    ['Planta', p.plant],
    ['Último acceso', p.lastAccess],
  ]

  return (
    <div style={{ flex: 1, minHeight: '100vh', background: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '13px 26px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Mi cuenta</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1E40AF' }}>
          <IconUser size={14} color="#1E40AF" /> Perfil de usuario
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 26px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 560, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${p.color}, #60A5FA)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {p.initials}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{p.name}</div>
              <div style={{ marginTop: 5 }}>
                <span style={{ background: p.color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99 }}>
                  {p.roleLabel}
                </span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Información personal
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {fields.map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                <div style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>

          <button
            onClick={onLogout}
            style={{ width: '100%', padding: '10px', background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FCA5A5', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
          >
            <IconLogIn size={14} color="#B91C1C" /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

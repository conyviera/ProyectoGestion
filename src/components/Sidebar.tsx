import type { Screen, Role } from '../types'
import {
  IconHome, IconFactory, IconBarChart, IconClipboard, IconPause,
  IconBell, IconWrench, IconDocument, IconShield, IconSettings, IconLeaf,
} from './Icons'

interface SidebarProps {
  active: Screen
  navigate: (s: Screen) => void
  role: Role
}

const items: { id: Screen; Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>; label: string; badge?: number }[] = [
  { id: 'dashboard', Icon: IconHome, label: 'Inicio' },
  { id: 'lines', Icon: IconFactory, label: 'Líneas' },
  { id: 'kpis', Icon: IconBarChart, label: 'KPIs' },
  { id: 'events', Icon: IconClipboard, label: 'Eventos' },
  { id: 'downtime', Icon: IconPause, label: 'Paradas' },
  { id: 'alerts', Icon: IconBell, label: 'Alertas', badge: 3 },
  { id: 'maintenance', Icon: IconWrench, label: 'Mantenimiento' },
  { id: 'reports', Icon: IconDocument, label: 'Reportes' },
  { id: 'audit', Icon: IconShield, label: 'Auditoría' },
  { id: 'config', Icon: IconSettings, label: 'Configuración' },
]

export default function Sidebar({ active, navigate, role }: SidebarProps) {
  const filteredItems = items.filter(item => {
    if (role === 'gerente') return true;
    if (role === 'supervisor') return item.id !== 'config';
    if (role === 'tecnico') return item.id === 'alerts' || item.id === 'maintenance';
    return false;
  });

  return (
    <aside style={{ width: 220, minWidth: 220, background: '#0F172A', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: '#1E40AF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconLeaf size={17} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ color: '#F9FAFB', fontSize: 13, fontWeight: 700, lineHeight: '16px', letterSpacing: '-0.01em' }}>NextGen Nutri</div>
            <div style={{ color: '#475569', fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>
              Monitoreo Operacional
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {filteredItems.map(({ id, Icon, label, badge }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 10px',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? '#1E40AF' : 'transparent',
                color: isActive ? '#ffffff' : '#64748B',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                marginBottom: 1,
                transition: 'all 0.12s ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#1E293B' }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <Icon size={15} color={isActive ? '#fff' : '#64748B'} strokeWidth={isActive ? 2 : 1.75} />
              </span>
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span
                  className="pulse-critical"
                  style={{ background: '#DC2626', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 99, padding: '2px 6px', lineHeight: '14px' }}
                >
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <button
        onClick={() => navigate('profile')}
        style={{
          padding: '12px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          background: active === 'profile' ? '#1E293B' : 'transparent',
          border: 'none',
          borderTopStyle: 'solid',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.06)',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1E293B' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = active === 'profile' ? '#1E293B' : 'transparent' }}
      >
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1E40AF, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {role === 'gerente' ? 'GV' : role === 'supervisor' ? 'RS' : 'LR'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ color: '#E2E8F0', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {role === 'gerente' ? 'C. Gloria Valdés' : role === 'supervisor' ? 'R. Soto' : 'L. Rojas'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <div style={{
              background: role === 'gerente' ? '#1E40AF' : role === 'supervisor' ? '#7C3AED' : '#B45309',
              color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 99, lineHeight: '12px'
            }}>
              {role === 'gerente' ? 'Gerente' : role === 'supervisor' ? 'Supervisor' : 'Técnico Mant.'}
            </div>
            <div style={{ color: '#475569', fontSize: 10 }}>Planta Maipú</div>
          </div>
        </div>
      </button>
    </aside>
  )
}

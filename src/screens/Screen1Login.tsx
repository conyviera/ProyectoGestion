import { useState } from 'react'
import type { Role } from '../types'
import { IconLeaf, IconLogIn, IconLock, IconUser } from '../components/Icons'

interface Props {
  onLogin: (r: Role) => void
}

export default function Screen1Login({ onLogin }: Props) {
  const [user, setUser] = useState('c.valdes')
  const [pass, setPass] = useState('••••••••')
  const [role, setRole] = useState<Role>('gerente')

  const handleProfileSelect = (newUser: string, newRole: Role) => {
    setUser(newUser)
    setRole(newRole)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F172A',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Geometric background — subtle grid lines */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#60A5FA" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Accent glow blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(30,64,175,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 360, height: 360, background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Card */}
      <div
        style={{
          width: 440,
          background: '#1E293B',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '36px 36px 32px',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, background: '#1E40AF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconLeaf size={20} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>NextGen Nutri</div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 500, marginTop: 1 }}>NutriIndustria S.A.</div>
          </div>
        </div>

        <div style={{ marginBottom: 26 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
            Sistema de Monitoreo Operacional
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: '#475569' }}>
            Planta Maipú · Acceso autenticado y auditado
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {/* Quick Select Profiles */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <button
              onClick={() => handleProfileSelect('c.valdes', 'gerente')}
              style={{ flex: 1, padding: '8px', background: '#0F172A', border: role === 'gerente' ? '1px solid #1E40AF' : '1px solid #334155', borderRadius: 8, color: '#F1F5F9', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1E40AF' }} />
              Gerente
            </button>
            <button
              onClick={() => handleProfileSelect('r.soto', 'supervisor')}
              style={{ flex: 1, padding: '8px', background: '#0F172A', border: role === 'supervisor' ? '1px solid #7C3AED' : '1px solid #334155', borderRadius: 8, color: '#F1F5F9', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7C3AED' }} />
              Supervisor
            </button>
            <button
              onClick={() => handleProfileSelect('l.rojas', 'tecnico')}
              style={{ flex: 1, padding: '8px', background: '#0F172A', border: role === 'tecnico' ? '1px solid #B45309' : '1px solid #334155', borderRadius: 8, color: '#F1F5F9', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#B45309' }} />
              Técnico
            </button>
          </div>

          {/* User */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              RUT / Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                <IconUser size={14} color="#475569" />
              </span>
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 32px', background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 13, color: '#F1F5F9', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
                onBlur={(e) => (e.target.style.borderColor = '#334155')}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                <IconLock size={14} color="#475569" />
              </span>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 32px', background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 13, color: '#F1F5F9', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
                onBlur={(e) => (e.target.style.borderColor = '#334155')}
              />
            </div>
          </div>

          {/* Selects */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Planta</label>
              <select style={{ width: '100%', padding: '9px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 13, color: '#94A3B8', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
                <option>Maipú</option>
                <option>San Bernardo</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Rol</label>
              <select 
                value={role === 'gerente' ? 'Gerente' : role === 'supervisor' ? 'Supervisor de Producción' : 'Técnico de Mantenimiento'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'Gerente') setRole('gerente');
                  else if (val === 'Supervisor de Producción') setRole('supervisor');
                  else setRole('tecnico');
                }}
                style={{ width: '100%', padding: '9px 10px', background: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontSize: 13, color: '#94A3B8', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                <option value="Gerente">Gerente</option>
                <option value="Supervisor de Producción">Supervisor de Producción</option>
                <option value="Técnico de Mantenimiento">Técnico de Mantenimiento</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={() => onLogin(role)}
            style={{
              width: '100%',
              padding: '11px',
              background: '#1E40AF',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              letterSpacing: '-0.01em',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#1D35A0')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#1E40AF')}
          >
            <IconLogIn size={14} color="#fff" />
            Iniciar sesión
          </button>
        </div>

        {/* Footer note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          <IconLock size={11} color="#334155" />
          <span style={{ fontSize: 11, color: '#334155' }}>
            Acceso registrado en bitácora de auditoría
          </span>
        </div>
      </div>
    </div>
  )
}

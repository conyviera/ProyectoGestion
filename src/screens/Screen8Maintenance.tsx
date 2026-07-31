import { useState, useCallback, useEffect } from 'react'
import type { Screen, Role } from '../types'

// ─── Internal navigation type for the D3 sub-screens ─────────────────────────

type MaintScreen = 'D3-1' | 'D3-2' | 'D3-3' | 'D3-4' | 'D3-5' | 'D3-6' | 'D3-7'

type TicketStatus =
  | 'Generada'
  | 'Reconocida'
  | 'En diagnóstico'
  | 'En reparación'
  | 'Resuelta'
  | 'Cerrada'

interface Toast {
  id: number
  message: string
  type: 'success' | 'info' | 'warning'
}

interface Props {
  navigate: (s: Screen) => void
  role?: Role
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<TicketStatus, { bg: string; text: string; border: string }> = {
  'Generada':       { bg: 'bg-red-50',    text: 'text-red-700',   border: 'border-red-200' },
  'Reconocida':     { bg: 'bg-amber-50',  text: 'text-amber-700', border: 'border-amber-200' },
  'En diagnóstico': { bg: 'bg-blue-50',   text: 'text-blue-700',  border: 'border-blue-200' },
  'En reparación':  { bg: 'bg-amber-50',  text: 'text-amber-700', border: 'border-amber-200' },
  'Resuelta':       { bg: 'bg-green-50',  text: 'text-green-700', border: 'border-green-200' },
  'Cerrada':        { bg: 'bg-gray-100',  text: 'text-gray-600',  border: 'border-gray-200' },
}

const STATUS_DOT: Record<TicketStatus, string> = {
  'Generada':       'bg-red-500',
  'Reconocida':     'bg-amber-500',
  'En diagnóstico': 'bg-blue-500',
  'En reparación':  'bg-amber-500',
  'Resuelta':       'bg-green-500',
  'Cerrada':        'bg-gray-400',
}

const SEVERITY_COLORS: Record<string, { bg: string; text: string }> = {
  'Crítica': { bg: 'bg-red-600',   text: 'text-white' },
  'Media':   { bg: 'bg-amber-500', text: 'text-white' },
  'Baja':    { bg: 'bg-green-600', text: 'text-white' },
}

// ─── Shared Components ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TicketStatus }) {
  const s = STATUS_COLORS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status}
    </span>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const s = SEVERITY_COLORS[severity] ?? { bg: 'bg-gray-500', text: 'text-white' }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${s.bg} ${s.text} tracking-wide`}>
      {severity}
    </span>
  )
}

function Btn({
  children, onClick, variant = 'primary', size = 'md', disabled = false, className = ''
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
}) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded transition-all duration-150 cursor-pointer select-none'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' }
  const variants = {
    primary:   'bg-blue-800 text-white hover:bg-blue-900 active:bg-blue-950',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
    danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    ghost:     'text-blue-800 hover:bg-blue-50 active:bg-blue-100',
    success:   'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{children}</p>
  )
}

function DataRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-semibold text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

// ─── Toast System ─────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-sm max-w-xs pointer-events-auto
            ${t.type === 'success' ? 'bg-green-700 text-white' : t.type === 'warning' ? 'bg-amber-600 text-white' : 'bg-blue-800 text-white'}`}
        >
          <span className="text-base leading-none mt-0.5">
            {t.type === 'success' ? '✓' : t.type === 'warning' ? '⚠' : 'ℹ'}
          </span>
          <span className="flex-1 text-xs font-medium">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="text-white/70 hover:text-white text-xs ml-1 cursor-pointer">✕</button>
        </div>
      ))}
    </div>
  )
}

// ─── D3-1: Bandeja técnica ────────────────────────────────────────────────────

function D3_1({
  onNav, ticketStatus, onRecognize, showToast, navigateMain
}: {
  onNav: (s: MaintScreen) => void
  ticketStatus: TicketStatus
  onRecognize: () => void
  showToast: (msg: string, type: Toast['type']) => void
  navigateMain: (s: Screen) => void
}) {
  const [filterLine, setFilterLine] = useState('Todas')
  const [filterSev, setFilterSev] = useState('Todas')
  const [activeTab, setActiveTab] = useState<'Pendientes' | 'En curso' | 'Cerradas'>('Pendientes')

  const handleRecognize = () => {
    onRecognize()
    showToast('Alerta reconocida. Registro enviado a bitácora RF-08.', 'success')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Mantenimiento — Bandeja técnica</h1>
            <p className="text-xs text-gray-500 mt-0.5">Sistema de Monitoreo Industrial · Vista web responsiva · Planta Maipú</p>
          </div>
          {/* Responsive web badge */}
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
            <span style={{ fontSize: 13 }}>🖥️</span>
            <span className="text-xs font-semibold text-blue-700">Accesible desde computador, tablet y terminal</span>
          </div>
        </div>

        {/* ─── Ciclo de vida del ticket ─────────────────────────────────────── */}
        <div className="mt-3 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Flujo de atención de falla</p>
          <div className="flex items-center gap-0 overflow-x-auto">
            {([
              { label: 'Generada',       color: 'bg-red-500',   active: ticketStatus === 'Generada' },
              { label: 'Reconocida',     color: 'bg-amber-500', active: ticketStatus === 'Reconocida' },
              { label: 'En diagnóstico', color: 'bg-blue-500',  active: ticketStatus === 'En diagnóstico' },
              { label: 'En reparación',  color: 'bg-amber-400', active: ticketStatus === 'En reparación' },
              { label: 'Resuelta',       color: 'bg-green-500', active: ticketStatus === 'Resuelta' },
              { label: 'Cerrada',        color: 'bg-gray-400',  active: ticketStatus === 'Cerrada' },
            ] as const).map((step, i, arr) => {
              const statusOrder: TicketStatus[] = ['Generada','Reconocida','En diagnóstico','En reparación','Resuelta','Cerrada']
              const currentIdx = statusOrder.indexOf(ticketStatus)
              const stepIdx = i
              const done = stepIdx < currentIdx
              const active = stepIdx === currentIdx
              return (
                <div key={step.label} className="flex items-center">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all
                    ${active ? `${step.color} text-white shadow` : done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    {done && <span>✓</span>}
                    {step.label}
                  </div>
                  {i < arr.length - 1 && (
                    <span className={`mx-1 text-sm font-bold ${done ? 'text-green-400' : 'text-gray-300'}`}>→</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* KPI strip */}
        <div className="flex gap-6 mt-3 pt-3 border-t border-gray-100">
          {[
            { label: 'Tickets pendientes', value: '4', color: 'text-gray-800' },
            { label: 'En curso', value: '2', color: 'text-amber-600' },
            { label: 'Cerrados hoy', value: '5', color: 'text-green-700' },
            { label: 'MTTR promedio hoy', value: '42 min', color: 'text-blue-800' },
            { label: 'Críticos sin atender', value: '2', color: 'text-red-600' },
          ].map(k => (
            <div key={k.label} className="flex flex-col">
              <span className={`text-xl font-bold ${k.color}`}>{k.value}</span>
              <span className="text-xs text-gray-500">{k.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { label: 'Línea', opts: ['Todas', 'Línea A', 'Línea B'], val: filterLine, set: setFilterLine },
              { label: 'Severidad', opts: ['Todas', 'Crítica', 'Media', 'Baja'], val: filterSev, set: setFilterSev },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">{f.label}:</span>
                <div className="flex gap-0.5">
                  {f.opts.map(o => (
                    <button
                      key={o}
                      onClick={() => f.set(o)}
                      className={`px-2.5 py-1 text-xs rounded border cursor-pointer transition-colors
                        ${f.val === o ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <select className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white">
              <option>Estado: Todos</option>
              <option>Pendiente</option>
              <option>En diagnóstico</option>
              <option>En reparación</option>
              <option>Resuelta</option>
              <option>Cerrada</option>
            </select>
            <select className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white">
              <option>Técnico: Todos</option>
              <option>L. Rojas</option>
              <option>M. Torres</option>
              <option>Sin asignar</option>
            </select>
            <select className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white">
              <option>Turno: Mañana</option>
              <option>Tarde</option>
              <option>Noche</option>
            </select>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mb-4 border-b border-gray-200">
            {([['Pendientes', '4'], ['En curso', '2'], ['Cerradas', '18']] as const).map(([tab, count]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'Pendientes' | 'En curso' | 'Cerradas')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px flex items-center gap-1.5
                  ${activeTab === tab ? 'border-blue-800 text-blue-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold
                  ${activeTab === tab ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-600'}`}>{count}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {/* Ticket 1 — MT-2026-047 */}
            <Card className={`p-4 ${ticketStatus === 'Generada' ? 'ring-1 ring-red-200' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-gray-900">MT-2026-047</span>
                    <SeverityBadge severity="Crítica" />
                    <StatusBadge status={ticketStatus} />
                    <span className="text-xs text-gray-400 ml-auto font-mono">IoT</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 mb-3">
                    <span className="text-xs text-gray-500">Línea: <span className="text-gray-800 font-medium">Línea A</span></span>
                    <span className="text-xs text-gray-500">Máquina: <span className="text-gray-800 font-medium">ENV-01</span></span>
                    <span className="text-xs text-gray-500 col-span-2">Falla: <span className="text-gray-800 font-medium">Sensor temperatura cabezal fuera de rango</span></span>
                    <span className="text-xs text-gray-500">Inicio: <span className="text-gray-800 font-mono">10:42</span></span>
                    <span className="text-xs text-gray-500">Transcurrido: <span className="text-red-600 font-mono font-semibold">00:08:32</span></span>
                    <span className="text-xs text-gray-500">Técnico: <span className="text-gray-800 font-medium">L. Rojas</span></span>
                    <span className="text-xs text-gray-500">Origen: <span className="text-gray-800">Alerta IoT</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Botón principal: Iniciar atención — va directo a D3-3 */}
                    <Btn size="sm" onClick={() => onNav('D3-3')}>
                      ⚡ Iniciar atención / Diagnóstico
                    </Btn>
                    <Btn size="sm" variant="secondary" onClick={() => onNav('D3-2')}>Ver detalle técnico</Btn>
                    {ticketStatus === 'Generada' && (
                      <Btn size="sm" variant="secondary" onClick={handleRecognize}>Reconocer</Btn>
                    )}
                    <Btn size="sm" variant="ghost" onClick={() => navigateMain('events')}>Ver evento origen</Btn>
                  </div>

                  {/* Preview campos del formulario */}
                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-x-6 gap-y-1">
                    <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Campos disponibles en el formulario de atención</p>
                    {[
                      'Diagnóstico preliminar',
                      'Causa identificada',
                      'Acción ejecutada',
                      'Repuesto utilizado',
                      'Observaciones técnicas',
                      'Técnico responsable',
                      'Hora inicio / Hora fin',
                      'Nuevo estado del ticket',
                    ].map(f => (
                      <span key={f} className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />{f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Ticket 2 — MT-2026-046 */}
            <Card className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-gray-900">MT-2026-046</span>
                    <SeverityBadge severity="Media" />
                    <StatusBadge status="En reparación" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 mb-3">
                    <span className="text-xs text-gray-500">Línea: <span className="text-gray-800 font-medium">Línea B</span></span>
                    <span className="text-xs text-gray-500">Máquina: <span className="text-gray-800 font-medium">CON-02</span></span>
                    <span className="text-xs text-gray-500 col-span-2">Falla: <span className="text-gray-800 font-medium">Parada no planificada — revisión mecánica</span></span>
                    <span className="text-xs text-gray-500">Inicio: <span className="text-gray-800 font-mono">10:18</span></span>
                    <span className="text-xs text-gray-500">Transcurrido: <span className="text-amber-600 font-mono font-semibold">00:38:00</span></span>
                    <span className="text-xs text-gray-500">Técnico: <span className="text-gray-800 font-medium">M. Torres</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Btn size="sm" variant="secondary" onClick={() => onNav('D3-2')}>Ver detalle</Btn>
                    <Btn size="sm" onClick={() => onNav('D3-4')}>Continuar atención</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => navigateMain('events')}>Ver evento origen</Btn>
                  </div>
                </div>
              </div>
            </Card>

            {/* Ticket 3 — MT-2026-045 */}
            <Card className="p-4 opacity-80">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-gray-900">MT-2026-045</span>
                    <SeverityBadge severity="Media" />
                    <StatusBadge status="Resuelta" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 mb-3">
                    <span className="text-xs text-gray-500">Línea: <span className="text-gray-800 font-medium">Línea A</span></span>
                    <span className="text-xs text-gray-500">Máquina: <span className="text-gray-800 font-medium">Gateway-A</span></span>
                    <span className="text-xs text-gray-500 col-span-2">Falla: <span className="text-gray-800 font-medium">Pérdida de conectividad Gateway-A 3 min</span></span>
                    <span className="text-xs text-gray-500">Inicio: <span className="text-gray-800 font-mono">09:55</span></span>
                    <span className="text-xs text-gray-500 text-green-600">Cerrado</span>
                    <span className="text-xs text-gray-500">Técnico: <span className="text-gray-800 font-medium">Sistema / QA</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Btn size="sm" variant="secondary" onClick={() => onNav('D3-2')}>Ver detalle</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => navigateMain('audit')}>Ver auditoría</Btn>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-64 shrink-0 overflow-y-auto p-4 border-l border-gray-200 bg-gray-50 flex flex-col gap-4">
          {/* Calendar PM */}
          <Card className="p-3">
            <SectionLabel>Calendario PM — Julio 2026</SectionLabel>
            <div className="grid grid-cols-7 gap-0.5 text-center text-xs mb-1">
              {['L','M','X','J','V','S','D'].map(d => (
                <span key={d} className="text-gray-400 font-medium py-0.5">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1
                const done = [3, 7, 10, 14, 17].includes(day)
                const upcoming = [21, 24].includes(day)
                const overdue = [1, 2].includes(day)
                const today = day === 30
                return (
                  <span
                    key={day}
                    className={`py-1 rounded text-xs font-medium
                      ${done ? 'bg-green-100 text-green-700' : ''}
                      ${upcoming ? 'bg-amber-100 text-amber-700' : ''}
                      ${overdue ? 'bg-red-100 text-red-600' : ''}
                      ${today ? 'ring-2 ring-blue-800' : ''}
                      ${!done && !upcoming && !overdue ? 'text-gray-500' : ''}
                    `}
                  >
                    {day}
                  </span>
                )
              })}
            </div>
            <div className="flex gap-3 mt-2 flex-wrap">
              {[['bg-green-100 text-green-700', 'Completado'], ['bg-amber-100 text-amber-700', 'Próximo'], ['bg-red-100 text-red-600', 'Vencido']].map(([cls, label]) => (
                <span key={label} className={`text-xs px-1.5 py-0.5 rounded ${cls}`}>{label}</span>
              ))}
            </div>
          </Card>

          {/* Historial ENV-01 */}
          <Card className="p-3">
            <SectionLabel>Historial ENV-01</SectionLabel>
            <table className="w-full text-xs">
              <tbody>
                {[
                  ['28/05', 'Cambio sensor temp.', '35 min'],
                  ['14/05', 'PM 500h', '4h 20m'],
                  ['02/05', 'Ajuste velocidad', '18 min'],
                  ['18/04', 'Falla motor alim.', '45 min'],
                  ['05/04', 'PM 250h', '2h 10m'],
                ].map(([date, desc, dur]) => (
                  <tr key={date} className="border-b border-gray-100 last:border-0">
                    <td className="py-1.5 text-gray-400 font-mono pr-2">{date}</td>
                    <td className="py-1.5 text-gray-700 pr-2">{desc}</td>
                    <td className="py-1.5 text-gray-500 text-right whitespace-nowrap">{dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Estado técnico del sistema */}
          <Card className="p-3">
            <SectionLabel>Estado técnico del sistema</SectionLabel>
            {[
              { label: 'Node-RED', value: 'Operativo', ok: true },
              { label: 'Gateway-A', value: 'Operativo', ok: true },
              { label: 'Buffer local', value: 'Disponible 4h', ok: true },
              { label: 'ERP', value: 'Sincronizado 10:48:12', ok: true },
              { label: 'Última lectura', value: '< 5 s', ok: true },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-500">{r.label}</span>
                <span className={`text-xs font-semibold flex items-center gap-1 ${r.ok ? 'text-green-700' : 'text-red-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${r.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                  {r.value}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── D3-2: Detalle técnico ────────────────────────────────────────────────────

function D3_2({ onNav, ticketStatus, onRecognize, showToast, navigateMain }: {
  onNav: (s: MaintScreen) => void
  ticketStatus: TicketStatus
  onRecognize: () => void
  showToast: (msg: string, type: Toast['type']) => void
  navigateMain: (s: Screen) => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Detalle de falla · MT-2026-047</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <SeverityBadge severity="Crítica" />
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Línea A</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">ENV-01</span>
              <StatusBadge status={ticketStatus} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn size="sm" variant="secondary" onClick={() => onNav('D3-1')}>← Volver a bandeja</Btn>
            <Btn size="sm" variant="ghost" onClick={() => navigateMain('events')}>Ver evento origen</Btn>
            <Btn size="sm" variant="ghost" onClick={() => navigateMain('audit')}>Ver auditoría</Btn>
            <Btn size="sm" onClick={() => onNav('D3-3')}>Iniciar diagnóstico →</Btn>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-4">
          {/* Bloque 1: Resumen */}
          <Card className="col-span-2 p-4">
            <SectionLabel>Resumen del evento</SectionLabel>
            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <DataRow label="ID evento" value="EV-2451" mono />
                <DataRow label="ID alerta" value="ALT-0892" mono />
                <DataRow label="ID ticket" value="MT-2026-047" mono />
                <DataRow label="Máquina" value="Envasadora ENV-01" />
                <DataRow label="Línea" value="Línea A — Envasado Líquidos" />
                <DataRow label="Producto activo" value="Jugo Naranja 1L" />
              </div>
              <div>
                <DataRow label="Lote" value="L-2451" mono />
                <DataRow label="Turno" value="Mañana" />
                <DataRow label="Hora inicio" value="10:42:03" mono />
                <DataRow label="Tiempo transcurrido" value="00:08:32" mono />
                <DataRow label="MTTR objetivo" value="45 min" />
                <DataRow label="Severidad" value="Crítica" />
              </div>
            </div>
            {ticketStatus === 'Generada' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Btn size="sm" variant="secondary" onClick={() => {
                  onRecognize()
                  showToast('Alerta reconocida. Registro enviado a bitácora RF-08.', 'success')
                }}>
                  Reconocer alerta
                </Btn>
              </div>
            )}
          </Card>

          {/* Bloque 4: Riesgo */}
          <Card className="p-4 border-red-200 bg-red-50">
            <SectionLabel>Riesgo operacional</SectionLabel>
            <div className="bg-red-100 border border-red-300 rounded p-3 mb-3">
              <p className="text-xs font-semibold text-red-800">⚠ Riesgo: posible afectación de calidad por temperatura fuera de rango.</p>
            </div>
            <p className="text-xs text-gray-700 font-medium mb-1">Recomendación automática:</p>
            <p className="text-xs text-gray-600">
              Inspeccionar sensor de temperatura, cabezal de sellado y ventilación del módulo ENV-01.
            </p>
            <div className="mt-4 pt-3 border-t border-red-200">
              <Btn size="sm" onClick={() => onNav('D3-3')} className="w-full justify-center">Iniciar diagnóstico</Btn>
            </div>
          </Card>

          {/* Bloque 2: Lecturas técnicas */}
          <Card className="col-span-2 p-4">
            <SectionLabel>Lecturas técnicas</SectionLabel>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1.5 text-gray-500 font-semibold">Variable</th>
                  <th className="text-right py-1.5 text-gray-500 font-semibold">Valor</th>
                  <th className="text-right py-1.5 text-gray-500 font-semibold">Umbral</th>
                  <th className="text-right py-1.5 text-gray-500 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Temperatura cabezal', '87,4°C', '≤ 85°C', 'Crítico', 'text-red-600'],
                  ['Vibración motor', '6,2 mm/s', '≤ 5,0 mm/s', 'Alerta', 'text-amber-600'],
                  ['Velocidad línea', '142 unid/min', '130–150', 'OK', 'text-green-700'],
                  ['Estado sensor', 'Activo', 'Activo', 'OK', 'text-green-700'],
                  ['Última lectura Node-RED', '10:42:03', '< 5 s', 'OK', 'text-green-700'],
                ].map(([v, val, threshold, estado, color]) => (
                  <tr key={v} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-2 text-gray-700 font-medium">{v}</td>
                    <td className="py-2 text-right font-mono font-semibold text-gray-800">{val}</td>
                    <td className="py-2 text-right font-mono text-gray-500">{threshold}</td>
                    <td className={`py-2 text-right font-bold ${color}`}>{estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Bloque 3: Timeline */}
          <Card className="p-4">
            <SectionLabel>Línea de tiempo de la alerta</SectionLabel>
            <div className="flex flex-col gap-0">
              {[
                ['10:42:03', 'Node-RED genera alerta crítica', true],
                ['10:42:07', 'Evento visible en dashboard', false],
                ['10:42:20', 'Supervisor reconoce alerta', false],
                ['10:43:10', 'Ticket asignado a L. Rojas', false],
                ['10:50:35', 'Técnico abre vista de mantenimiento', false],
              ].map(([time, desc, first], i, arr) => (
                <div key={time as string} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${first ? 'bg-red-500' : 'bg-blue-400'}`} />
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                  </div>
                  <div className="pb-3">
                    <span className="font-mono text-xs text-gray-500">{time as string}</span>
                    <p className="text-xs text-gray-700">{desc as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── D3-3: Formulario de diagnóstico ─────────────────────────────────────────

function D3_3({ onNav, setStatus, showToast, navigateMain }: {
  onNav: (s: MaintScreen) => void
  setStatus: (s: TicketStatus) => void
  showToast: (msg: string, type: Toast['type']) => void
  navigateMain: (s: Screen) => void
}) {
  const [diagnostico, setDiagnostico] = useState('Temperatura del cabezal superior supera umbral definido. Se observa posible descalibración del sensor o acumulación térmica en módulo de sellado.')
  const [causa, setCausa] = useState('Sensor descalibrado')
  const [intervencion, setIntervencion] = useState('Calibración')
  const [observaciones, setObservaciones] = useState('Se recomienda detener parcialmente el módulo ENV-01 durante 10 minutos para inspección segura.')
  const [nuevoEstado, setNuevoEstado] = useState('En diagnóstico')
  const [files, setFiles] = useState<string[]>([])

  const mockFiles = ['Foto del sensor', 'Captura de lectura Node-RED', 'Registro de temperatura', 'Orden de trabajo']

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Diagnóstico técnico · MT-2026-047</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status="En diagnóstico" />
              <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">Complete los campos obligatorios para registrar el diagnóstico preliminar.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-4 max-w-5xl">
          {/* Datos prellenados */}
          <Card className="p-4 bg-gray-50">
            <SectionLabel>Datos del ticket (no editables)</SectionLabel>
            <DataRow label="Ticket" value="MT-2026-047" mono />
            <DataRow label="Línea" value="Línea A" />
            <DataRow label="Máquina" value="ENV-01" />
            <DataRow label="Falla detectada" value="Sensor temp. cabezal fuera de rango" />
            <DataRow label="Severidad" value="Crítica" />
            <DataRow label="Hora de inicio" value="10:42:03" mono />
            <DataRow label="Técnico asignado" value="L. Rojas Meza" />
          </Card>

          {/* Campos editables */}
          <div className="col-span-2 flex flex-col gap-4">
            <Card className="p-4">
              <SectionLabel>Campos de diagnóstico</SectionLabel>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Técnico responsable *</label>
                  <select className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white text-gray-800">
                    <option>L. Rojas Meza</option>
                    <option>M. Torres</option>
                    <option>J. Silva</option>
                    <option>Sin asignar</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Diagnóstico preliminar *</label>
                  <textarea
                    value={diagnostico}
                    onChange={e => setDiagnostico(e.target.value)}
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Causa identificada *</label>
                  <select
                    value={causa}
                    onChange={e => setCausa(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white text-gray-800"
                  >
                    {['Sensor descalibrado', 'Sobrecalentamiento de cabezal', 'Falla eléctrica', 'Falta de ventilación', 'Error de lectura IoT', 'Causa por confirmar'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Tipo de intervención *</label>
                  <select
                    value={intervencion}
                    onChange={e => setIntervencion(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white text-gray-800"
                  >
                    {['Inspección', 'Ajuste', 'Limpieza', 'Reemplazo', 'Calibración', 'Reparación mecánica', 'Reparación eléctrica'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Observaciones técnicas</label>
                  <textarea
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                    rows={2}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Nuevo estado</label>
                  <select
                    value={nuevoEstado}
                    onChange={e => setNuevoEstado(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white text-gray-800"
                  >
                    <option>En diagnóstico</option>
                    <option>En reparación</option>
                    <option>Resuelta</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Evidencia */}
            <Card className="p-4">
              <SectionLabel>Adjuntar evidencia</SectionLabel>
              <div className="flex flex-wrap gap-2 mb-3">
                {mockFiles.map(f => (
                  <button
                    key={f}
                    onClick={() => setFiles(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                    className={`text-xs px-3 py-1.5 rounded border cursor-pointer transition-colors
                      ${files.includes(f) ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                  >
                    {files.includes(f) ? '✓ ' : '+ '}{f}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 italic">
                No se capturan datos biométricos ni vigilancia individual de operarios. La evidencia se asocia solo a máquina, línea y evento.
              </p>
            </Card>

            {/* Botones */}
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => {
                setStatus('En diagnóstico')
                showToast('Diagnóstico guardado. Estado actualizado a En diagnóstico.', 'success')
              }}>Guardar diagnóstico</Btn>
              <Btn variant="success" onClick={() => {
                setStatus('En reparación')
                onNav('D3-4')
              }}>Iniciar reparación →</Btn>
              <Btn variant="secondary" onClick={() => onNav('D3-1')}>Cancelar</Btn>
              <Btn variant="ghost" onClick={() => navigateMain('audit')}>Ver auditoría</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── D3-4: Registro de reparación ────────────────────────────────────────────

function D3_4({ onNav, setStatus, showToast }: {
  onNav: (s: MaintScreen) => void
  setStatus: (s: TicketStatus) => void
  showToast: (msg: string, type: Toast['type']) => void
}) {
  const [accion, setAccion] = useState('Calibración de sensor')
  const [detalle, setDetalle] = useState('Se calibra sensor de temperatura del cabezal y se limpia zona de acumulación térmica. Lectura retorna a rango normal.')
  const [repuesto, setRepuesto] = useState('No aplica')

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Registro de reparación · MT-2026-047</h1>
            <StatusBadge status="En reparación" />
          </div>
          {/* KPIs */}
          <div className="flex gap-6">
            {[
              { label: 'Tiempo transcurrido', value: '00:22:15', color: 'text-amber-600' },
              { label: 'MTTR objetivo', value: '45 min', color: 'text-gray-800' },
              { label: 'Tiempo restante', value: '22 min 45 s', color: 'text-green-700' },
              { label: 'Severidad', value: 'Crítica', color: 'text-red-600' },
              { label: 'Línea', value: 'Línea A', color: 'text-gray-700' },
              { label: 'Máquina', value: 'ENV-01', color: 'text-gray-700' },
            ].map(k => (
              <div key={k.label} className="text-right">
                <div className={`text-lg font-bold font-mono ${k.color}`}>{k.value}</div>
                <div className="text-xs text-gray-500">{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-4 max-w-5xl">
          {/* Sección 1: Acción técnica */}
          <div className="col-span-2 flex flex-col gap-4">
            <Card className="p-4">
              <SectionLabel>Acción técnica</SectionLabel>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Acción ejecutada *</label>
                  <select
                    value={accion}
                    onChange={e => setAccion(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white"
                  >
                    {['Calibración de sensor', 'Limpieza de cabezal', 'Reemplazo de sensor', 'Ajuste de conexión', 'Reinicio de módulo', 'Inspección sin intervención', 'Otra acción'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Detalle de la acción *</label>
                  <textarea
                    value={detalle}
                    onChange={e => setDetalle(e.target.value)}
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Repuesto utilizado</label>
                    <select
                      value={repuesto}
                      onChange={e => setRepuesto(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white"
                    >
                      {['No aplica', 'Sensor temperatura ST-ENV-01', 'Cable M12 industrial', 'Fusible control', 'Conector IP65', 'Otro'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Tiempo estimado de reparación</label>
                    <input type="number" defaultValue={18} className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="text-xs text-gray-400">minutos</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Resultado parcial</label>
                  <select className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white">
                    {['Lectura normalizada', 'Requiere nueva inspección', 'Requiere repuesto', 'Escalar a supervisor', 'Mantener en observación'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            {/* Botones */}
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => showToast('Avance guardado. Estado: En reparación.', 'info')}>Guardar avance</Btn>
              <Btn variant="success" onClick={() => {
                setStatus('Resuelta')
                onNav('D3-5')
              }}>Marcar como resuelta →</Btn>
              <Btn variant="secondary" onClick={() => showToast('Solicitud enviada a C. Gloria Valdés.', 'warning')}>Escalar a supervisor</Btn>
              <Btn variant="ghost" onClick={() => onNav('D3-1')}>Cancelar</Btn>
            </div>
          </div>

          {/* Derecha */}
          <div className="flex flex-col gap-4">
            {/* Validación de lectura */}
            <Card className="p-4">
              <SectionLabel>Validación de lectura</SectionLabel>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1.5 text-gray-500 font-semibold">Variable</th>
                    <th className="text-right py-1.5 text-gray-500 font-semibold">Antes</th>
                    <th className="text-right py-1.5 text-gray-500 font-semibold">Después</th>
                    <th className="text-right py-1.5 text-gray-500 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Temp. cabezal', '87,4°C', '82,1°C', 'Normal', 'text-green-700'],
                    ['Vibración motor', '6,2 mm/s', '4,7 mm/s', 'Normal', 'text-green-700'],
                    ['Velocidad línea', '142 u/min', '139 u/min', 'OK', 'text-green-700'],
                    ['Última lectura', '10:42:03', '11:04:25', 'OK', 'text-green-700'],
                  ].map(([v, a, d, e, c]) => (
                    <tr key={v} className="border-b border-gray-100 last:border-0">
                      <td className="py-1.5 text-gray-700">{v}</td>
                      <td className="py-1.5 text-right font-mono text-red-500">{a}</td>
                      <td className="py-1.5 text-right font-mono text-green-700 font-semibold">{d}</td>
                      <td className={`py-1.5 text-right font-bold ${c}`}>{e}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Registro automático */}
            <Card className="p-4 bg-gray-50 border-gray-300">
              <SectionLabel>Registro automático RF-08</SectionLabel>
              <p className="text-xs text-gray-600 mb-3">Este cambio quedará registrado en la bitácora RF-08 con usuario, timestamp, IP/dispositivo y acción realizada.</p>
              <DataRow label="Usuario" value="l.rojas" mono />
              <DataRow label="Rol" value="Mantenedor" />
              <DataRow label="Dispositivo" value="Tablet-MT-02" mono />
              <DataRow label="IP" value="192.168.10.58" mono />
              <DataRow label="Timestamp" value="11:04:25" mono />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── D3-5: Cierre de falla ────────────────────────────────────────────────────

function D3_5({ onNav, setStatus, showToast, navigateMain }: {
  onNav: (s: MaintScreen) => void
  setStatus: (s: TicketStatus) => void
  showToast: (msg: string, type: Toast['type']) => void
  navigateMain: (s: Screen) => void
}) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Cierre de falla · MT-2026-047</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status="Resuelta" />
              <span className="text-xs text-gray-500">Revise los datos de cierre antes de finalizar el ticket.</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Btn size="sm" variant="secondary" onClick={() => onNav('D3-4')}>← Volver a reparación</Btn>
            <Btn size="sm" variant="ghost" onClick={() => navigateMain('events')}>Ver evento origen</Btn>
            <Btn size="sm" variant="ghost" onClick={() => navigateMain('dashboard')}>Ver en dashboard</Btn>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-4 max-w-5xl">
          {/* Sección 1: Resumen */}
          <Card className="p-4">
            <SectionLabel>Resumen de atención</SectionLabel>
            <DataRow label="ID ticket" value="MT-2026-047" mono />
            <DataRow label="ID evento" value="EV-2451" mono />
            <DataRow label="ID alerta" value="ALT-0892" mono />
            <DataRow label="Falla" value="Sensor temp. cabezal" />
            <DataRow label="Línea" value="Línea A" />
            <DataRow label="Máquina" value="ENV-01" />
            <DataRow label="Técnico" value="L. Rojas Meza" />
            <DataRow label="Hora inicio" value="10:42:03" mono />
            <DataRow label="Hora resolución" value="11:05:40" mono />
            <DataRow label="Tiempo total" value="23 min 37 s" />
            <DataRow label="MTTR objetivo" value="45 min" />
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded p-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-xs font-semibold text-green-700">Cumple objetivo MTTR</span>
              </div>
            </div>
          </Card>

          {/* Sección 2: Campos cierre */}
          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <SectionLabel>Campos de cierre</SectionLabel>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Acción definitiva *</label>
                  <select className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white">
                    {['Calibración de sensor', 'Reemplazo de sensor', 'Ajuste eléctrico', 'Reparación mecánica', 'Limpieza técnica', 'Falsa alarma validada', 'Otra'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Observaciones finales</label>
                  <textarea
                    defaultValue="Sensor calibrado y lectura estabilizada bajo umbral. Se recomienda revisar nuevamente al cierre del turno."
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Resultado final *</label>
                  <select className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white">
                    <option>Operación normalizada</option>
                    <option>Operación normalizada con observación</option>
                    <option>Requiere seguimiento</option>
                    <option>Requiere mantenimiento programado</option>
                    <option>No resuelto</option>
                  </select>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={e => setConfirmed(e.target.checked)}
                    className="mt-0.5 accent-blue-800"
                  />
                  <span className="text-xs text-gray-600">Confirmo que la falla fue atendida y que la información registrada corresponde al evento técnico observado.</span>
                </label>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Confirmación supervisor</label>
                  <select className="w-full text-sm border border-gray-200 rounded px-3 py-2 bg-white">
                    <option>Pendiente</option>
                    <option>Aprobado por supervisor de turno</option>
                    <option>Requiere revisión</option>
                  </select>
                </div>
              </div>
            </Card>

            <div className="flex flex-wrap gap-2">
              <Btn
                disabled={!confirmed}
                variant="success"
                onClick={() => {
                  setStatus('Cerrada')
                  onNav('D3-6')
                }}
              >
                Cerrar falla →
              </Btn>
              <Btn variant="secondary" onClick={() => onNav('D3-4')}>← Volver a reparación</Btn>
            </div>
          </div>

          {/* Sección 3: Impacto */}
          <Card className="p-4">
            <SectionLabel>Impacto en indicadores</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'MTTR del evento', value: '23 min', color: 'bg-green-50 border-green-200 text-green-800' },
                { label: 'MTTR meta', value: '45 min', color: 'bg-gray-50 border-gray-200 text-gray-700' },
                { label: 'Estado', value: 'Dentro de meta', color: 'bg-green-50 border-green-200 text-green-800' },
                { label: 'Downtime asociado', value: '12 min', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                { label: 'Línea afectada', value: 'Línea A', color: 'bg-gray-50 border-gray-200 text-gray-700' },
                { label: 'Disponibilidad', value: '82,1%', color: 'bg-blue-50 border-blue-200 text-blue-800' },
              ].map(k => (
                <div key={k.label} className={`p-3 rounded border ${k.color}`}>
                  <div className="text-lg font-bold font-mono">{k.value}</div>
                  <div className="text-xs mt-0.5 opacity-80">{k.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── D3-6: Confirmación de cierre ────────────────────────────────────────────

function D3_6({ onNav, showToast, navigateMain }: {
  onNav: (s: MaintScreen) => void
  showToast: (msg: string, type: Toast['type']) => void
  navigateMain: (s: Screen) => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">✓</div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Ticket cerrado correctamente</h1>
            <StatusBadge status="Cerrada" />
          </div>
        </div>
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 font-medium">
          La falla MT-2026-047 fue cerrada y registrada en la bitácora de auditoría.
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-4 max-w-5xl">
          {/* Resumen final */}
          <Card className="p-4">
            <SectionLabel>Resumen final</SectionLabel>
            <DataRow label="Ticket" value="MT-2026-047" mono />
            <DataRow label="Evento" value="EV-2451" mono />
            <DataRow label="Alerta" value="ALT-0892" mono />
            <DataRow label="Estado final" value="Cerrada" />
            <DataRow label="Técnico" value="L. Rojas Meza" />
            <DataRow label="Supervisor" value="C. Gloria Valdés" />
            <DataRow label="Hora cierre" value="11:06:12" mono />
            <DataRow label="Tiempo total" value="24 min 09 s" />
            <DataRow label="Cumplimiento MTTR" value="Sí ✓" />
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <p className="text-xs text-blue-800 font-semibold">Auditoría generada</p>
                <p className="font-mono text-xs text-blue-700 mt-0.5">AUD-2026-1021</p>
              </div>
            </div>
          </Card>

          {/* Cambios en el sistema */}
          <Card className="col-span-2 p-4">
            <SectionLabel>Cambios registrados en el sistema</SectionLabel>
            <div className="flex flex-col gap-2">
              {[
                'Alerta ALT-0892 cambia a "Cerrada".',
                'Ticket MT-2026-047 pasa a pestaña "Cerradas".',
                'Dashboard ejecutivo descuenta una alerta crítica activa.',
                'Evento EV-2451 queda disponible en log centralizado.',
                'Registro RF-08 queda generado en bitácora inalterable.',
                'ERP recibe sincronización diferida en próxima ventana programada.',
                'Node-RED conserva trazabilidad del evento.',
                'Buffer local queda disponible ante desconexión.',
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-green-600 font-bold mt-0.5 shrink-0">✓</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
              <Btn onClick={() => onNav('D3-1')}>← Volver a mantenimiento</Btn>
              <Btn variant="secondary" onClick={() => navigateMain('dashboard')}>Ver en dashboard</Btn>
              <Btn variant="ghost" onClick={() => navigateMain('audit')}>Ver bitácora AUD-2026-1021</Btn>
              <Btn variant="ghost" onClick={() => showToast('Resumen técnico generado.', 'success')}>Descargar resumen</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── D3-7: Referencia de estados y severidades ────────────────────────────────

function D3_7() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">Referencia — Estados y severidades</h1>
        <p className="text-xs text-gray-500 mt-0.5">Tabla de referencia del ciclo de vida de la atención técnica · NextGen Nutri</p>
      </div>
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 max-w-4xl">
        {/* Flujo visual */}
        <Card className="p-5">
          <SectionLabel>Ciclo de vida de la falla</SectionLabel>
          <div className="flex items-center gap-0 flex-wrap mt-2">
            {(['Generada','Reconocida','En diagnóstico','En reparación','Resuelta','Cerrada'] as TicketStatus[]).map((s, i, arr) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <StatusBadge status={s} />
                </div>
                {i < arr.length - 1 && (
                  <span className="text-gray-400 mx-2 text-lg">→</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Tabla estados */}
        <Card className="p-4">
          <SectionLabel>Tabla de estados</SectionLabel>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 text-gray-600 font-semibold">Estado</th>
                <th className="text-left py-2 text-gray-600 font-semibold">Significado</th>
                <th className="text-left py-2 text-gray-600 font-semibold">Responsable</th>
                <th className="text-left py-2 text-gray-600 font-semibold">Acción permitida</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Generada', 'Alerta creada por Node-RED', 'Sistema', 'Reconocer / Asignar'],
                ['Reconocida', 'Alerta vista por mantenimiento', 'Técnico', 'Iniciar diagnóstico'],
                ['En diagnóstico', 'Técnico registra causa preliminar', 'Técnico', 'Guardar diagnóstico'],
                ['En reparación', 'Se ejecuta acción correctiva', 'Técnico', 'Guardar avance / Resolver'],
                ['Resuelta', 'Falla corregida, pendiente cierre', 'Técnico / Supervisor', 'Cerrar falla'],
                ['Cerrada', 'Evento finalizado y auditado', 'Supervisor autorizado', 'Solo lectura'],
              ].map(([estado, sig, resp, accion]) => (
                <tr key={estado} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-2.5"><StatusBadge status={estado as TicketStatus} /></td>
                  <td className="py-2.5 text-gray-700">{sig}</td>
                  <td className="py-2.5 text-gray-600">{resp}</td>
                  <td className="py-2.5 text-gray-600 font-mono">{accion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Tabla severidades */}
        <Card className="p-4">
          <SectionLabel>Tabla de severidades</SectionLabel>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 text-gray-600 font-semibold">Severidad</th>
                <th className="text-left py-2 text-gray-600 font-semibold">Color</th>
                <th className="text-left py-2 text-gray-600 font-semibold">Criterio</th>
                <th className="text-left py-2 text-gray-600 font-semibold">Tiempo objetivo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Crítica', 'bg-red-600', 'Afecta continuidad, calidad o seguridad operacional', 'Atención inmediata, < 5 min'],
                ['Media', 'bg-amber-500', 'Puede afectar producción si no se corrige', 'Atención < 30 min'],
                ['Baja', 'bg-green-600', 'Evento informativo o menor', 'Revisión programada'],
                ['Resuelta', 'bg-green-700', 'Evento corregido', 'Solo seguimiento'],
              ].map(([sev, color, criterio, tiempo]) => (
                <tr key={sev} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-2.5">
                    <span className={`inline-flex px-2.5 py-1 rounded text-xs font-bold text-white ${color}`}>{sev}</span>
                  </td>
                  <td className="py-2.5">
                    <span className={`w-4 h-4 rounded inline-block ${color}`} />
                  </td>
                  <td className="py-2.5 text-gray-700">{criterio}</td>
                  <td className="py-2.5 text-gray-600 font-mono">{tiempo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}

// ─── Root Maintenance Screen ───────────────────────────────────────────────────

export default function Screen8Maintenance({ navigate, role = 'tecnico' }: Props) {
  const [screen, setScreen] = useState<MaintScreen>('D3-1')
  const [loading, setLoading] = useState(false)
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>('Generada')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [toastId, setToastId] = useState(0)

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = toastId + 1
    setToastId(id)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [toastId])

  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  const onNav = (s: MaintScreen) => {
    // Brief skeleton loader when entering diagnosis form from detail
    if (s === 'D3-3' && (screen === 'D3-2' || screen === 'D3-1')) {
      setLoading(true)
      setTimeout(() => { setLoading(false); setScreen(s) }, 400)
    } else {
      setScreen(s)
    }
  }

  const setStatus = (s: TicketStatus) => setTicketStatus(s)

  const onRecognize = () => {
    if (ticketStatus === 'Generada') setTicketStatus('Reconocida')
  }

  useEffect(() => {
    // Reset state when component mounts
    setScreen('D3-1')
  }, [])

  const renderScreen = () => {
    switch (screen) {
      case 'D3-1': return <D3_1 onNav={onNav} ticketStatus={ticketStatus} onRecognize={onRecognize} showToast={showToast} navigateMain={navigate} />
      case 'D3-2': return <D3_2 onNav={onNav} ticketStatus={ticketStatus} onRecognize={onRecognize} showToast={showToast} navigateMain={navigate} />
      case 'D3-3': return <D3_3 onNav={onNav} setStatus={setStatus} showToast={showToast} navigateMain={navigate} />
      case 'D3-4': return <D3_4 onNav={onNav} setStatus={setStatus} showToast={showToast} />
      case 'D3-5': return <D3_5 onNav={onNav} setStatus={setStatus} showToast={showToast} navigateMain={navigate} />
      case 'D3-6': return <D3_6 onNav={onNav} showToast={showToast} navigateMain={navigate} />
      case 'D3-7': return <D3_7 />
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Breadcrumb & step progress bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-1.5 flex items-center gap-2 text-xs text-gray-400">
        <span>NextGen Nutri</span>
        <span>›</span>
        <span>Planta Maipú</span>
        <span>›</span>
        <span className="text-gray-700 font-medium">Mantenimiento</span>
        {['D3-2','D3-3','D3-4','D3-5','D3-6'].includes(screen) && (
          <>
            <span>›</span>
            <span className="text-blue-800 font-semibold">
              {screen === 'D3-2' ? 'Detalle MT-2026-047' :
               screen === 'D3-3' ? 'Diagnóstico MT-2026-047' :
               screen === 'D3-4' ? 'Reparación MT-2026-047' :
               screen === 'D3-5' ? 'Cierre MT-2026-047' :
               'Cerrado MT-2026-047'}
            </span>
          </>
        )}
        <span className="ml-auto text-gray-300 font-mono">Node-RED · Grafana</span>
        {/* Role badge */}
        {role !== 'tecnico' && (
          <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: role === 'gerente' ? '#DBEAFE' : '#EDE9FE', color: role === 'gerente' ? '#1E40AF' : '#7C3AED' }}>
            {role === 'gerente' ? '👁 Solo lectura — Gerente' : '👁 Solo lectura — Supervisor'}
          </span>
        )}
        {/* Sub-navigation actions */}
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => setScreen('D3-1')}
            className={`px-2 py-0.5 rounded text-xs cursor-pointer transition-colors ${screen === 'D3-1' ? 'bg-blue-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Bandeja
          </button>
          <button
            onClick={() => setScreen('D3-7')}
            className={`px-2 py-0.5 rounded text-xs cursor-pointer transition-colors ${screen === 'D3-7' ? 'bg-blue-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Referencia
          </button>
        </div>
      </div>

      {/* Step progress (only shown when in a ticket flow) */}
      {['D3-2','D3-3','D3-4','D3-5','D3-6'].includes(screen) && (
        <div className="bg-white border-b border-gray-100 px-5 py-2">
          <div className="flex items-center gap-0">
            {[
              { id: 'D3-2', label: 'Detalle' },
              { id: 'D3-3', label: 'Diagnóstico' },
              { id: 'D3-4', label: 'Reparación' },
              { id: 'D3-5', label: 'Cierre' },
              { id: 'D3-6', label: 'Confirmado' },
            ].map((step, i, arr) => {
              const idx = arr.findIndex(s => s.id === screen)
              const done = i < idx
              const active = i === idx
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded transition-colors
                    ${active ? 'text-blue-800 font-bold' : done ? 'text-green-700 font-medium' : 'text-gray-400'}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                      ${active ? 'bg-blue-800 text-white' : done ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    {step.label}
                  </div>
                  {i < arr.length - 1 && <span className="text-gray-200 mx-1">—</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 p-5 flex flex-col gap-4 animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-100 rounded" />
            <div className="flex gap-4 mt-2">
              <div className="h-32 flex-1 bg-gray-100 rounded-lg" />
              <div className="h-32 flex-1 bg-gray-100 rounded-lg" />
              <div className="h-32 w-48 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-48 bg-gray-100 rounded-lg" />
          </div>
        ) : renderScreen()}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

import { useState } from 'react'
import type { Screen, LineTab, Role } from './types'
import Sidebar from './components/Sidebar'
import Screen1Login from './screens/Screen1Login'
import Screen2Dashboard from './screens/Screen2Dashboard'
import Screen3LineDetail from './screens/Screen3LineDetail'
import Screen3EventDetail from './screens/Screen3EventDetail'
import Screen4KPIs from './screens/Screen4KPIs'
import Screen5Events from './screens/Screen5Events'
import Screen6Downtime from './screens/Screen6Downtime'
import Screen7Alerts from './screens/Screen7Alerts'
import Screen8Maintenance from './screens/Screen8Maintenance'
import Screen9Reports from './screens/Screen9Reports'
import Screen10Audit from './screens/Screen10Audit'
import Screen11Config from './screens/Screen11Config'

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [lineTab, setLineTab] = useState<LineTab>('A')
  const [role, setRole] = useState<Role>('gerente')

  function navigate(s: Screen) {
    setScreen(s)
  }

  function navigateLine(l: LineTab) {
    setLineTab(l)
    setScreen('lines')
  }

  function handleLogin(r: Role) {
    setRole(r)
    // Técnico entra directo a la bandeja de alertas/mantenimiento
    setScreen(r === 'tecnico' ? 'alerts' : 'dashboard')
  }

  if (screen === 'login') {
    return <Screen1Login onLogin={handleLogin} />
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FA' }}>
      <Sidebar active={screen} navigate={navigate} role={role} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        {screen === 'dashboard' && (
          <Screen2Dashboard navigate={navigate} navigateLine={navigateLine} role={role} />
        )}
        {screen === 'lines' && (
          <Screen3LineDetail navigate={navigate} initialTab={lineTab} role={role} />
        )}
        {screen === 'event-detail' && (
          <Screen3EventDetail navigate={navigate} role={role} />
        )}
        {screen === 'kpis' && <Screen4KPIs />}
        {screen === 'events' && <Screen5Events navigate={navigate} role={role} />}
        {screen === 'downtime' && <Screen6Downtime navigate={navigate} />}
        {screen === 'alerts' && <Screen7Alerts navigate={navigate} role={role} />}
        {screen === 'maintenance' && <Screen8Maintenance navigate={navigate} role={role} />}
        {screen === 'reports' && <Screen9Reports />}
        {screen === 'audit' && <Screen10Audit />}
        {screen === 'config' && <Screen11Config />}
      </main>
    </div>
  )
}

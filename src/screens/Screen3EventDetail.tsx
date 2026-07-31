import React, { useState } from 'react';
import type { Screen, Role } from '../types';

interface Props {
  navigate: (s: Screen) => void;
  role: Role;
}

export default function Screen3EventDetail({ navigate, role }: Props) {
  // Styles based on the guidelines
  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '24px',
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#333',
    },
    breadcrumb: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '16px',
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    title: {
      margin: 0,
      fontSize: '24px',
      fontWeight: 600,
    },
    badgeCritical: {
      backgroundColor: '#FEF2F2',
      color: '#DC2626',
      border: '1px solid #FCA5A5',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    badgeStatus: {
      backgroundColor: '#FEF9C3',
      color: '#CA8A04',
      border: '1px solid #FDE047',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    actionsRow: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    btnSecondary: {
      padding: '8px 16px',
      backgroundColor: '#FFF',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#374151',
      cursor: 'pointer',
    },
    btnPrimary: {
      padding: '8px 16px',
      backgroundColor: '#1E40AF',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#FFF',
      cursor: 'pointer',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
    },
    card: {
      backgroundColor: '#FFF',
      borderRadius: '10px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      padding: '24px',
    },
    cardTitle: {
      marginTop: 0,
      marginBottom: '16px',
      fontSize: '18px',
      fontWeight: 600,
      color: '#111827',
      borderBottom: '1px solid #E5E7EB',
      paddingBottom: '12px',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '20px',
    },
    label: {
      fontSize: '13px',
      color: '#6B7280',
      marginBottom: '4px',
      display: 'block',
      fontWeight: 500,
    },
    value: {
      fontSize: '15px',
      color: '#111827',
      fontWeight: 500,
      margin: 0,
    },
    fullWidthRow: {
      gridColumn: '1 / -1',
    },
    descText: {
      fontSize: '15px',
      color: '#374151',
      lineHeight: 1.5,
      backgroundColor: '#F9FAFB',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #E5E7EB',
      margin: 0,
    },
    timelineContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    timelineItem: {
      display: 'flex',
      gap: '16px',
    },
    timelineTime: {
      fontSize: '13px',
      color: '#6B7280',
      fontWeight: 500,
      minWidth: '65px',
    },
    timelineContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      flex: 1,
    },
    dotRed: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#DC2626',
      marginTop: '4px',
      flexShrink: 0,
    },
    dotBlue: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#3B82F6',
      marginTop: '4px',
      flexShrink: 0,
    },
    dotGreen: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#16A34A',
      marginTop: '4px',
      flexShrink: 0,
    },
    timelineText: {
      margin: 0,
      fontSize: '14px',
      color: '#374151',
    },
    similarTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px',
    },
    similarRow: {
      borderBottom: '1px solid #E5E7EB',
    },
    similarCell: {
      padding: '10px 0',
      color: '#374151',
    },
    toast: {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#1F2937',
      color: '#FFF',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 1000,
    }
  };

  const [toastVisible, setToastVisible] = useState(false);

  const handleSimilaresClick = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const getMaintenanceLabel = () => {
    if (role === 'tecnico') return 'Ir a mi bandeja de trabajo';
    return 'Ver atención (solo lectura)';
  };

  return (
    <div style={styles.container}>
      <div style={styles.breadcrumb}>
        NextGen Nutri › Eventos › EV-2451
      </div>

      <div style={styles.headerRow}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Detalle del Evento · EV-2451</h1>
          <span style={styles.badgeCritical}>⚠ Crítica</span>
          <span style={styles.badgeStatus}>Abierto</span>
        </div>
        
        <div style={styles.actionsRow}>
          <button style={styles.btnSecondary} onClick={() => navigate('lines')}>
            ← Volver a la línea
          </button>
          <button style={styles.btnSecondary} onClick={handleSimilaresClick}>
            Ver eventos similares
          </button>
          <button style={styles.btnPrimary} onClick={() => navigate('maintenance')}>
            {getMaintenanceLabel()}
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Info Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Información del Evento</h2>
            <div style={styles.infoGrid}>
              <div>
                <span style={styles.label}>Código del evento</span>
                <p style={styles.value}>EV-2451</p>
              </div>
              <div>
                <span style={styles.label}>Fecha y hora</span>
                <p style={styles.value}>30/07/2026 · 10:42:03</p>
              </div>
              <div>
                <span style={styles.label}>Línea</span>
                <p style={styles.value}>Línea A — Envasado Líquidos</p>
              </div>
              <div>
                <span style={styles.label}>Duración</span>
                <p style={styles.value}>23 min 37 s</p>
              </div>
              <div>
                <span style={styles.label}>Máquina</span>
                <p style={styles.value}>Envasadora ENV-01</p>
              </div>
              <div>
                <span style={styles.label}>Responsable</span>
                <p style={styles.value}>L. Rojas Meza</p>
              </div>
              <div>
                <span style={styles.label}>Tipo de falla</span>
                <p style={styles.value}>Falla de sensor</p>
              </div>
              
              <div style={styles.fullWidthRow}>
                <span style={styles.label}>Descripción</span>
                <p style={styles.descText}>
                  Sensor de temperatura en cabezal de envasado superó umbral de 85°C. Se detectó posible descalibración o acumulación térmica. Alerta generada automáticamente por Node-RED.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Línea de tiempo</h2>
            <div style={styles.timelineContainer}>
              <div style={styles.timelineItem}>
                <span style={styles.timelineTime}>10:42:03</span>
                <div style={styles.timelineContent}>
                  <div style={styles.dotRed}></div>
                  <p style={styles.timelineText}>Node-RED detecta temperatura fuera de rango</p>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineTime}>10:42:07</span>
                <div style={styles.timelineContent}>
                  <div style={styles.dotBlue}></div>
                  <p style={styles.timelineText}>Alerta creada automáticamente · EV-2451</p>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineTime}>10:43:10</span>
                <div style={styles.timelineContent}>
                  <div style={styles.dotBlue}></div>
                  <p style={styles.timelineText}>Ticket de mantenimiento generado · MT-2026-047</p>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineTime}>10:50:35</span>
                <div style={styles.timelineContent}>
                  <div style={styles.dotBlue}></div>
                  <p style={styles.timelineText}>Técnico L. Rojas inicia diagnóstico</p>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineTime}>11:05:40</span>
                <div style={styles.timelineContent}>
                  <div style={styles.dotGreen}></div>
                  <p style={styles.timelineText}>Falla resuelta · Sensor calibrado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Events Card */}
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Eventos similares</h2>
            <table style={styles.similarTable}>
              <tbody>
                <tr style={styles.similarRow}>
                  <td style={styles.similarCell}>
                    <div style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>EV-2380 · 15/07/2026</div>
                    <div>Sensor temp. ENV-01</div>
                    <div style={{ color: '#16A34A', marginTop: '2px', fontSize: '12px' }}>✓ Resuelta en 18 min</div>
                  </td>
                </tr>
                <tr style={styles.similarRow}>
                  <td style={styles.similarCell}>
                    <div style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>EV-2201 · 28/06/2026</div>
                    <div>Sensor temp. ENV-01</div>
                    <div style={{ color: '#16A34A', marginTop: '2px', fontSize: '12px' }}>✓ Resuelta en 31 min</div>
                  </td>
                </tr>
                <tr>
                  <td style={styles.similarCell}>
                    <div style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>EV-1984 · 14/05/2026</div>
                    <div>Sensor temp. cabezal</div>
                    <div style={{ color: '#16A34A', marginTop: '2px', fontSize: '12px' }}>✓ Resuelta en 42 min</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {toastVisible && (
        <div style={styles.toast}>
          Sección de eventos similares resaltada.
        </div>
      )}
    </div>
  );
}

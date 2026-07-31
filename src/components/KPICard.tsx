import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface LineData {
  value: number
  status: 'ok' | 'warning' | 'critical'
}

interface Props {
  title: string
  lineA: LineData
  lineB: LineData
  meta: string
  unit?: string
  inverse?: boolean // for mermas/MTTR: lower = better
  sparkA?: number[]
  sparkB?: number[]
}

const STATUS_COLOR: Record<string, string> = {
  ok: '#16A34A',
  warning: '#F59E0B',
  critical: '#DC2626',
}

const STATUS_BG: Record<string, string> = {
  ok: '#DCFCE7',
  warning: '#FEF3C7',
  critical: '#FEE2E2',
}

function Dot({ status }: { status: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: STATUS_COLOR[status],
        flexShrink: 0,
      }}
    />
  )
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ v }))
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={pts}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          dot={false}
          strokeWidth={1.5}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function KPICard({ title, lineA, lineB, meta, unit = '%', inverse, sparkA, sparkB }: Props) {
  const defaultSpark = [65, 68, 70, 67, 71, 69, 72, 70, 71]
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 10,
        border: '1px solid #E5E7EB',
        padding: '14px 16px',
        flex: 1,
        minWidth: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#6B7280',
            background: '#F3F4F6',
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          Meta {meta}{unit}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        {[
          { label: 'Línea A', data: lineA, spark: sparkA ?? defaultSpark },
          { label: 'Línea B', data: lineB, spark: sparkB ?? defaultSpark },
        ].map(({ label, data, spark }) => (
          <div
            key={label}
            style={{
              flex: 1,
              background: STATUS_BG[data.status],
              borderRadius: 8,
              padding: '8px 10px',
            }}
          >
            <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 4, fontWeight: 500 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
              <Dot status={data.status} />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: STATUS_COLOR[data.status],
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {data.value}
              </span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{unit}</span>
            </div>
            <SparkLine data={spark} color={STATUS_COLOR[data.status]} />
          </div>
        ))}
      </div>
    </div>
  )
}

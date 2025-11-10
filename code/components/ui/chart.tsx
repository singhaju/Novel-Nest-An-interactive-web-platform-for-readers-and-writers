'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'

const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error('useChart must be used within a <ChartContainer />')
  return context
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ReactNode
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          // avoid attribute-based arbitrary variant with quoted value (can produce
          // CSS that breaks PostCSS/Tailwind in some toolchains). Target the
          // grid line class directly instead of filtering by [stroke='#ccc'].
          '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 flex aspect-video justify-center text-xs',
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, c]) => c.theme || c.color
  )
  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.[theme as keyof typeof item.theme] || item.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join('\n')}
}
`
          )
          .join('\n'),
      }}
    />
  )
}

export const ChartTooltip = RechartsPrimitive.Tooltip
export const ChartLegend = RechartsPrimitive.Legend

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = 'dot',
}: {
  active?: boolean
  payload?: any[]
  label?: any
  indicator?: 'dot' | 'line' | 'dashed'
}) {
  const { config } = useChart()
  if (!active || !payload?.length) return null

  return (
    <div className="bg-background border rounded-md p-2 shadow-md text-xs">
      <div className="font-medium">{label}</div>
      {payload.map((item) => {
        const key = item.name || item.dataKey
        const itemConfig = config[key]
        const color = item.color
        return (
          <div key={key} className="flex justify-between">
            <span className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: color }}
              ></span>
              {itemConfig?.label || key}
            </span>
            <span>{item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ChartLegendContent({
  payload,
}: {
  payload?: any[]
}) {
  const { config } = useChart()
  if (!payload?.length) return null

  return (
    <div className="flex justify-center gap-4 pt-3 text-xs">
      {payload.map((item) => {
        const key = item.dataKey || item.value
        const itemConfig = config[key]
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            ></span>
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

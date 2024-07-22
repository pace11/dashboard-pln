import React from 'react'
import { Chart } from 'react-charts'
import ResizableBox from '../resizable-card'

export default function BarReactChart({
  data = [
    {
      label: 'Created',
      data: [
        {
          primary: 'UPT',
          secondary: 10,
        },
      ],
    },
  ],
  width,
  height,
}) {
  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum) => datum.primary,
    }),
    [],
  )

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    [],
  )

  return (
    <ResizableBox width={width} height={height} resizable={false}>
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </ResizableBox>
  )
}

// components/plotly-chart.js
'use client'

import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function TestPlot() {
  var data = [{
    z: [[0, 1, 2, 3, 4, 5, 6],
    [1, 9, 4, 7, 5, 2, 4],
    [2, 4, 2, 1, 6, 9, 3]],
    type: 'heatmap'
  }]

  var layout = {
    title: { text: 'Customize The Edit Chart Link Text' },
    modebar: {
      orientation: 'h', // Horizontal (arriba) o 'v' (vertical-derecha)
      bgcolor: 'black',
      color: 'green',
      activecolor: '#FAFAFA',
    },
  };

  var config = {
    displayModeBar: true,
    displaylogo: false,    // Oculta el logo de Plotly
  };
  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      useResizeHandler
    />
  )
}
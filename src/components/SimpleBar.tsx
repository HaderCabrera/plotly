'use client';
import { useEffect, useRef } from 'react';

interface PowerFactorBarProps {
  powerFactor?: number;     // Valor actual (0.0 a 1.0)
  minPF?: number;           // Mínimo histórico
  maxPF?: number;           // Máximo histórico
  title?: string;           // Título (ej. "Factor de Potencia")
}

const SimpleBar = ({
  powerFactor = 0.85,
  minPF = 0.7,
  maxPF = 1.0,
  title = 'Factor de Potencia'
}: PowerFactorBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadPlot = async () => {
      try {
        const Plotly = await import('plotly.js-dist-min');

        // Color dinámico de la barra
        const getBarColor = (value: number) => {
          if (value >= 0.95) return '#16a34a';  // Verde
          if (value >= 0.85) return '#f59e0b';  // Amarillo
          return '#dc2626';                    // Rojo
        };

        const data: Plotly.Data[] = [
          {
            x: [''],
            y: [powerFactor],
            type: 'bar' as const,
            marker: {
              color: getBarColor(powerFactor),
              line: { width: 2, color: '#ffffff' }
            },
            width: 0.6,
            hoverinfo: 'none'
          }
        ];

        const layout: Partial<Plotly.Layout> = {
          // ✅ Sin título en el gráfico
          yaxis: {
            range: [0, 1.2],
            tickfont: { size: 10 },
            showgrid: true,
            gridcolor: '#e5e7eb',
            gridwidth: 0.5,
            dtick: 0.2,
            showticklabels: true
          },
          xaxis: {
            showticklabels: false,
            showgrid: false,
            zeroline: false
          },
          shapes: [
            // Línea para mínimo
            {
              type: 'line',
              x0: -0.4,
              x1: 0.4,
              y0: minPF,
              y1: minPF,
              xref: 'x',
              yref: 'y',
              line: { color: '#ef4444', width: 2, dash: 'dot' },
              layer: 'above'
            },
            // Línea para máximo
            {
              type: 'line',
              x0: -0.4,
              x1: 0.4,
              y0: maxPF,
              y1: maxPF,
              xref: 'x',
              yref: 'y',
              line: { color: '#10b981', width: 2, dash: 'dot' },
              layer: 'above'
            }
          ],
          annotations: [
            {
              x: 0,
              y: minPF - 0.08,
              xref: 'x',
              yref: 'y',
              text: `Min: ${minPF.toFixed(2)}`,
              showarrow: false,
              font: { size: 10, color: '#6b7280' },
              xanchor: 'center'
            },
            {
              x: 0,
              y: maxPF + 0.06,
              xref: 'x',
              yref: 'y',
              text: `Max: ${maxPF.toFixed(2)}`,
              showarrow: false,
              font: { size: 10, color: '#6b7280' },
              xanchor: 'center'
            }
          ],
          margin: { t: 20, b: 100, l: 40, r: 10 },
          showlegend: false,
          autosize: true,
        };

        const config: Partial<Plotly.Config> = {
          displayModeBar: false,
          responsive: true,
        };

        Plotly.newPlot(containerRef.current!, data, layout, config);

        return () => {
          Plotly.purge(containerRef.current!);
        };
      } catch (error) {
        console.error('Failed to load Plotly:', error);
      }
    };

    loadPlot();
  }, [powerFactor, minPF, maxPF, title]);

  return (
    <div  className=" grid grid-cols-2 items-center text-center  w-full">
        <div ref={containerRef} className='rounded-2xl overflow-hidden'/>
        <div>
            <h1>{title}</h1>
            <p>{powerFactor.toFixed(2)}</p>
        </div>
    </div>
  );
};

export default SimpleBar;
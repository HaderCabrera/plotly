'use client';

import { useEffect, useRef } from 'react';

interface FrequencyTrendChartProps {
  minPF?: number;
  maxPF?: number;
}

interface PlotlyHTMLElement extends HTMLElement {
  on(event: string, callback: (data: any) => void): void;
  off(event: string, callback?: (data: any) => void): void;
}

interface Plotly {
  newPlot: (
    root: HTMLElement,
    data: Plotly.Data[],
    layout?: Partial<Plotly.Layout>,
    config?: Partial<Plotly.Config>
  ) => Promise<PlotlyHTMLElement>;
  react: (
    root: PlotlyHTMLElement,
    data: Plotly.Data[],
    layout?: Partial<Plotly.Layout>
  ) => Promise<void>;
  purge: (root: HTMLElement) => void;
}

const FrequencyTrendChart = ({ minPF = 50, maxPF = 60 }: FrequencyTrendChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotInstance = useRef<PlotlyHTMLElement | null>(null);


  
  useEffect(() => {
    if (!containerRef.current) return;

    const loadPlot = async () => {
      try {
        const Plotly = (await import('plotly.js-dist-min')) as unknown as Plotly;
        

        // Función para generar datos con tipos explícitos
        const generateSampleData = (points: number, timeRange: number) => {
          const now = Date.now();
          return {
            x: Array.from({ length: points }, (_, i) => 
              new Date(now - (timeRange - (timeRange / points * i)))
            ),
            y: Array.from({ length: points }, () => 
              60 + (Math.random() * 2 - 1) * 0.3
            )
          };
        };

        // Datos iniciales (1 hora de datos)
        const initialData = generateSampleData(1000, 3600000);

        // Configuración del layout con tipos explícitos
        const layout: Partial<Plotly.Layout> = {
          title: { text: 'Tendencia de Frecuencia' },
          xaxis: {
            type: 'date',
            rangeselector: {
              buttons: [
                { count: 1, label: '1h', step: 'hour', stepmode: 'backward' },
                { count: 24, label: '1d', step: 'hour', stepmode: 'backward' },
                { count: 7, label: '1w', step: 'day', stepmode: 'backward' },
                { count: 1, label: '1m', step: 'month', stepmode: 'backward' },
                { step: 'all', label: 'Todo' }
              ],
              x: 0,
              xanchor: 'left',
              y: 1.1,
              yanchor: 'top'
            },
            rangeslider: {
              visible: true,
              thickness: 0.1
            },
            autorange: true
          },
          yaxis: {
            title: { text: 'Frecuencia (Hz)' },
            range: [minPF - 1, maxPF + 1],
            fixedrange: false
          },
          margin: { t: 50, l: 50, r: 30, b: 70 },
          showlegend: false
        };

        // Configuración del gráfico con tipos explícitos
        const config: Partial<Plotly.Config> = {
          responsive: true,
          scrollZoom: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
          displaylogo: false
        };

        // Crear el gráfico inicial con tipos correctos
        plotInstance.current = await Plotly.newPlot(
          containerRef.current!,
          [{
            x: initialData.x,
            y: initialData.y,
            type: 'scatter',
            mode: 'lines',
            line: { width: 1 }
          } as Plotly.Data],
          layout,
          config
        );

        // Manejador de eventos con tipo explícito
        const handleRelayout = (event: any) => {
          if (event['rangeselector.click']) {
            const button = event['rangeselector.click'];
            let timeRange = 3600000; // 1 hora por defecto
            
            if (button.label === '1h') timeRange = 3600000;
            else if (button.label === '1d') timeRange = 86400000;
            else if (button.label === '1w') timeRange = 604800000;
            else if (button.label === '1m') timeRange = 2592000000;
            
            const newData = generateSampleData(1000, timeRange);
            
            Plotly.react(
              plotInstance.current!,
              [{
                x: newData.x,
                y: newData.y,
                type: 'scatter',
                mode: 'lines',
                line: { width: 1 }
              } as Plotly.Data],
              {
                'xaxis.autorange': true,
                'yaxis.autorange': true
              }
            );
          }
        };

        // Añadir event listener usando la instancia de Plotly
        plotInstance.current.on('plotly_relayout', handleRelayout);

        return () => {
          if (plotInstance.current) {
            // Limpiar event listener antes de purgar
            plotInstance.current.off('plotly_relayout', handleRelayout);
            Plotly.purge(plotInstance.current);
          }
        };

      } catch (error) {
        console.error('Error al cargar Plotly:', error);
      }
    };

    loadPlot();

    return () => {
      if (plotInstance.current && containerRef.current) {
        const Plotly = require('plotly.js-dist-min') as unknown as Plotly;
        Plotly.purge(containerRef.current);
      }
    };
  }, [minPF, maxPF]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '500px',
        minHeight: '400px'
      }} 
    />
  );
};

export default FrequencyTrendChart;
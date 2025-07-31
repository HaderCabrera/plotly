'use client';

import { useEffect, useRef, useState } from 'react';

interface FrequencyTrendChartProps {
  minPF?: number;
  maxPF?: number;
}

const FrequencyTrendChart = ({ minPF = 50, maxPF = 60 }: FrequencyTrendChartProps) => {

  const containerRef = useRef<HTMLDivElement>(null);
  const [themeVersion, setThemeVersion] = useState(0); // Forzar recarga
  const currentTheme = useRef<string>('');

  // Detectar cambios de tema
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      if (newTheme !== currentTheme.current) {
        currentTheme.current = newTheme;
        setThemeVersion(v => v + 1); // Incrementar para forzar recarga
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Cargar el gráfico
  useEffect(() => {
    if (!containerRef.current) return;

    const loadPlot = async () => {
      try {
        const Plotly = await import('plotly.js-dist-min');
        const style = getComputedStyle(document.documentElement);

        // Obtener colores actuales
        const colors = {
          bgColor: style.getPropertyValue('--color-background').trim(),
          cardColor: style.getPropertyValue('--color-card').trim(),
          buttonColor: style.getPropertyValue('--color-muted').trim(),
          textColor: style.getPropertyValue('--color-foreground').trim(),
          gridColor: style.getPropertyValue('--color-border').trim(),
          lineColor: style.getPropertyValue('--color-chart-5').trim(),
        };

        // Función para generar datos
        const generateData = (points: number, timeRange: number) => ({
          x: Array.from({ length: points }, (_, i) =>
            new Date(Date.now() - (timeRange - (timeRange / points * i)))
          ),
          y: Array.from({ length: points }, () =>
            60 + (Math.random() * 2 - 1) * 0.3
          )
        });

        // Configuración completa del layout
        const layout: Partial<Plotly.Layout> = {
          // title: {
          //   text: 'Tendencia de Frecuencia',
          //   font: { color: colors.textColor, size: 10 }
          // },
          paper_bgcolor: colors.bgColor,
          plot_bgcolor: colors.cardColor,
          font: { color: colors.textColor },
          xaxis: {
            type: 'date',
            gridcolor: colors.gridColor,
            linecolor: colors.gridColor,
            zerolinecolor: colors.gridColor,
            autorange: true,
            rangeselector: {
              buttons: [
                { count: 1, label: '1h', step: 'hour', stepmode: 'backward' },
                { count: 24, label: '1d', step: 'hour', stepmode: 'backward' },
                { count: 7, label: '1w', step: 'day', stepmode: 'backward' },
                { count: 1, label: '1m', step: 'month', stepmode: 'backward' },
                { step: 'all', label: 'Todo' }
              ],
              bgcolor: colors.buttonColor,
              font: { color: colors.textColor },
              activecolor: colors.bgColor,
              x: 0,
              xanchor: 'auto',
              y: 1.1,
              yanchor: 'auto'
            },
            rangeslider: {
              visible: true,
              thickness: 0.1,
              bgcolor: colors.cardColor,
              bordercolor: colors.gridColor
            }
          },
          yaxis: {
            title: {
              text: 'Frecuencia (Hz)',
              font: { color: colors.textColor }
            },
            range: [minPF - 1, maxPF + 1],
            gridcolor: colors.gridColor,
            fixedrange: false,
            linecolor: colors.gridColor,
            zerolinecolor: colors.gridColor,
          },
          margin: { t: 40, l: 50, r: 30, b: 70},
          showlegend: false
        };

        const config = {
          responsive: true,
          scrollZoom: true,
          displayModeBar: true,
          displaylogo: false
        };

        // Crear gráfico nuevo
        await Plotly.newPlot(
          containerRef.current!,
          [{
            x: generateData(1000, 3600000).x,
            y: generateData(1000, 3600000).y,
            type: 'scatter',
            mode: 'lines',
            line: {
              color: colors.lineColor,
              width: 1
            }
          }],
          layout,
          config
        );

      } catch (error) {
        console.error('Error al cargar Plotly:', error);
      }
    };

    loadPlot();

    return () => {
      if (containerRef.current) {
        const Plotly = require('plotly.js-dist-min');
        Plotly.purge(containerRef.current);
      }
    };
  }, [themeVersion, minPF, maxPF]);

  return (
    <div
      ref={containerRef}
      className='w-full rounded-2xl  overflow-hidden'
    />
  );
};

export default FrequencyTrendChart;
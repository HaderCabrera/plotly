'use client';

import { useEffect, useRef, useState } from 'react';

interface PowerFactorBarProps {
  powerFactor?: number;
  minPF?: number;
  maxPF?: number;
  title?: string;
}

const SimpleBar = ({
  powerFactor = 0.9,
  minPF = 0.7,
  maxPF = 1.0,
  title = 'Factor de Potencia'
}: PowerFactorBarProps) => {

  const containerRef = useRef<HTMLDivElement>(null);
  const [themeVersion, setThemeVersion] = useState(0); // Forzar recarga
  const currentTheme = useRef<string>('');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      if (newTheme !== currentTheme.current) {
        currentTheme.current = newTheme;
        setThemeVersion(v => v + 1);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadPlot = async () => {
      try {
        const Plotly = await import('plotly.js-dist-min');
        const style = getComputedStyle(document.documentElement);

        const colors = {
          bgColor: style.getPropertyValue('--color-background').trim(),
          cardColor: style.getPropertyValue('--color-card').trim(),
          buttonColor: style.getPropertyValue('--color-muted').trim(),
          textColor: style.getPropertyValue('--color-foreground').trim(),
          dangerColor: style.getPropertyValue('--color-danger').trim(),
          warningColor: style.getPropertyValue('--color-warning').trim(),
          successColor: style.getPropertyValue('--color-success').trim(),
          lineColor: style.getPropertyValue('--color-chart-3').trim(),
          gridColor: style.getPropertyValue('--color-border').trim(),
        }

        // Color dinámico de la barra
        const getBarColor = (value: number) => {
          if (value >= 0.95) return colors.dangerColor;
          if (value >= 0.85) return colors.warningColor;
          return colors.successColor;
        };

        const data: Plotly.Data[] = [
          {
            x: [''],
            y: [powerFactor],
            type: 'bar' as const,
            marker: {
              color: getBarColor(powerFactor),
            },
            width: 0.6,
            hoverinfo: 'y'
          }
        ];

        const layout: Partial<Plotly.Layout> = {
          paper_bgcolor: colors.bgColor,
          plot_bgcolor: colors.bgColor,
          font: { color: colors.textColor },
          yaxis: {
            range: [0, 1.2],
            showgrid:false,
          },
          xaxis: {
            showgrid: false,
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
              line: { color: colors.dangerColor, width: 1, dash: 'dashdot' },
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
              line: { color: colors.successColor, width: 1, dash: 'dashdot' },
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
              font: { size: 10 },
              xanchor: 'center'
            },
            {
              x: 0,
              y: maxPF + 0.06,
              xref: 'x',
              yref: 'y',
              text: `Max: ${maxPF.toFixed(2)}`,
              showarrow: false,
              font: { size: 10 },
              xanchor: 'center'
            }
          ],
          margin: { t: 20, b: 100, l: 40, r: 10 },
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
  }, [powerFactor, minPF, maxPF, title, themeVersion]);

  return (
    <div className=" grid grid-cols-2 items-center text-center  w-full">
      <div ref={containerRef} className='rounded-2xl overflow-hidden' />
      <div>
        <h1>{title}</h1>
        <p>{powerFactor.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SimpleBar;
'use client';
import { useEffect, useRef, useState } from 'react';

interface CylinderTempProps {
  minTemp?: number;
  maxTemp?: number;
  title?: string;
}

const CylinderTemperatureChart = ({
  minTemp = 70,
  maxTemp = 120,
  title = 'Temperatura de Cilindros'
}: CylinderTempProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [themeVersion, setThemeVersion] = useState(0);
  const currentTheme = useRef<string>('');

  // Datos simulados para 10 cilindros
  const generateSimulatedData = () => {
    const cylinders = Array.from({length: 10}, (_, i) => `C${i+1}`);
    const currentTemps = cylinders.map(() => minTemp + Math.random() * (maxTemp - minTemp));
    
    return {
      cylinders,
      current: currentTemps,
      min: currentTemps.map(temp => temp - 5 - Math.random() * 10),
      max: currentTemps.map(temp => temp + 5 + Math.random() * 10)
    };
  };

  const {cylinders, current, min, max} = generateSimulatedData();

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
          textColor: style.getPropertyValue('--color-foreground').trim(),
          dangerColor: style.getPropertyValue('--color-danger').trim(),
          warningColor: style.getPropertyValue('--color-warning').trim(),
          successColor: style.getPropertyValue('--color-success').trim(),
          gridColor: style.getPropertyValue('--color-border').trim(),
        };

        // Gráfico principal con barras de rango
        const data: Plotly.Data[] = [{
          type: 'bar',
          x: cylinders,
          y: current,
          name: 'Temperatura Actual',
          marker: {
            color: current.map(temp => 
              temp > maxTemp ? colors.dangerColor : 
              temp > maxTemp * 0.9 ? colors.warningColor : colors.successColor
            )
          },
          error_y: {
            type: 'data',
            array: max.map((m, i) => m - current[i]),
            arrayminus: current.map((c, i) => c - min[i]),
            color: colors.textColor,
            thickness: 1.5
          }
        }];

        const layout: Partial<Plotly.Layout> = {
          title: {
            text: title,
            font: { color: colors.textColor }
          },
          paper_bgcolor: colors.bgColor,
          plot_bgcolor: colors.cardColor,
          font: { color: colors.textColor },
          xaxis: {
            title: 'Cilindros',
            linecolor: colors.gridColor,
            gridcolor: colors.gridColor,
          },
          yaxis: {
            title: 'Temperatura (°C)',
            range: [minTemp - 10, maxTemp + 10],
            linecolor: colors.gridColor,
            gridcolor: colors.gridColor,
          },
          margin: { t: 60, l: 60, r: 30, b: 80 },
          // Líneas de referencia para los límites
          shapes: [
            {
              type: 'line',
              x0: -0.5,
              x1: cylinders.length - 0.5,
              y0: maxTemp,
              y1: maxTemp,
              line: {
                color: colors.dangerColor,
                width: 2,
                dash: 'dash'
              }
            },
            {
              type: 'line',
              x0: -0.5,
              x1: cylinders.length - 0.5,
              y0: minTemp,
              y1: minTemp,
              line: {
                color: colors.successColor,
                width: 2,
                dash: 'dash'
              }
            }
          ],
          annotations: [
            {
              x: -0.3,
              y: maxTemp,
              xref: 'x',
              yref: 'y',
              text: `Máx: ${maxTemp}°C`,
              showarrow: false,
              font: { color: colors.dangerColor }
            },
            {
              x: -0.3,
              y: minTemp,
              xref: 'x',
              yref: 'y',
              text: `Mín: ${minTemp}°C`,
              showarrow: false,
              font: { color: colors.successColor }
            }
          ]
        };

        const config: Partial<Plotly.Config> = {
          responsive: true,
          displayModeBar: false
        };

        Plotly.newPlot(containerRef.current!, data, layout, config);

        return () => {
          Plotly.purge(containerRef.current!);
        };
      } catch (error) {
        console.error('Error al cargar Plotly:', error);
      }
    };

    loadPlot();
  }, [minTemp, maxTemp, title, themeVersion]);

  return (
    <div ref={containerRef} className='w-full h-full rounded-2xl overflow-hidden' />
  );
};

export default CylinderTemperatureChart;
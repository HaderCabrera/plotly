'use client';

import { useEffect, useRef, useState } from 'react';

interface PowerFactorBarProps {
    minPF?: number;
    maxPF?: number;
    title?: string;
}

const BarPlotly = ({
    minPF = 70,
    maxPF = 120,
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

                const powerFactor = [100, 90, 100, 90, 100, 95, 100, 96, 101, 95, 99, 97, 100, 100, 94, 92, 93, 87, 96, 87];
                const powerFactorMax = [105, 97, 110, 92, 105, 97, 101, 98, 107, 92, 102, 99, 102, 101, 97, 94, 96, 89, 96, 88];
                const powerFactorDiff = powerFactorMax.map((max, index) => max - powerFactor[index]);

                const data1: Plotly.Data =
                {
                    x: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
                    y: powerFactorMax,
                    type: 'bar',
                    name: "Actual"
                    // marker: {
                    //     color: "blue",
                    // },
                    // width: 0.6,
                    // hoverinfo: 'y'
                }
                    ;

                const data2: Plotly.Data =
                {
                    x: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
                    y: powerFactorDiff,
                    type: 'bar',
                    name: "Maximo"
                };

                const data = [data1, data2];

                const layout: Partial<Plotly.Layout> = {
                    paper_bgcolor: colors.bgColor,
                    plot_bgcolor: colors.bgColor,
                    font: { color: colors.textColor },
                    yaxis: {
                        title:{text:"Temperatura [°C]"},
                        linecolor: colors.gridColor,
                        gridcolor: colors.gridColor,
                    },
                    xaxis: {
                        tickangle: -90,
                        linecolor: colors.gridColor,
                        gridcolor: colors.gridColor,
                    },
                    shapes: [
                        // Línea para mínimo
                        {
                            type: 'line',
                            x0: 0,
                            x1: 1,
                            y0: minPF,
                            y1: minPF,
                            xref: 'paper', // ¡Clave! Usa coordenadas relativas
                            yref: 'y',
                            line: {
                                color: colors.dangerColor,
                                width: 2,
                                dash: 'dashdot'
                            },
                            layer: 'above'
                        },
                        // Línea para máximo
                        {
                            type: 'line',
                            x0: 0,
                            x1: 1,
                            y0: maxPF,
                            y1: maxPF,
                            xref: 'paper',
                            yref: 'y',
                            line: {
                                color: colors.successColor,
                                width: 2,
                                dash: 'dashdot'
                            },
                            layer: 'above'
                        }
                    ],
                    annotations: [
                        {
                            x: 1.01,
                            y: minPF,
                            xref: "paper",
                            yref: 'y',
                            text: `${minPF}`,
                            font: { size: 10 },
                            xanchor: 'center',
                            showarrow: false,

                        },
                        {
                            x: 1.01,
                            y: maxPF,
                            xref: "paper",
                            yref: 'y',
                            text: `${maxPF}`,
                            showarrow: false,
                            font: { size: 10 },
                            xanchor: 'center'
                        }
                    ],
                    //   margin: { t: 20, b: 100, l: 40, r: 10 },
                    autosize: true,
                    barmode: 'stack',
                    margin: { t: 40, l: 50, r: 30, b: 70 },
                    // legend: {
                    //     y: 0.2,          // Posición vertical (0 = fondo, 1 = parte superior)
                    //     yanchor: "top",   // Ancla el a leyenda en la posición y
                    //     yref: "paper",
                    //     x: 1.07,
                    //     xanchor: "center", // Ancla la leyenda en el centro horizontal
                    //     orientation: "v"   // Orientación horizontal (opcional)
                    // },
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
    }, [minPF, maxPF, title, themeVersion]);


    return (
        <div ref={containerRef} className='w-full h-full rounded-2xl overflow-hidden' />
    );
};

export default BarPlotly;
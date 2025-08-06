'use client';
import { useEffect, useRef, useState } from 'react';


interface VoltageGaugeProps {
    type?: string;
    variable?: number;
    minVariable?: number;
    maxVariable?: number;
    title?: string;
    unit?: string;
    warningLow?: number;
    warningHight?: number;
    reference?: number;
    optimalMin?: number;
    optimalMax?: number;
}

const Gauge = ({
    type = 'startToEnd',
    variable = 10.4,
    minVariable = 0,
    maxVariable = 24,
    title = 'Grafico tipo gauge',
    unit = '[]',
    warningLow = 10,
    warningHight = 35,
    reference = 10,
    optimalMin = 5,
    optimalMax = 10,

}: VoltageGaugeProps) => {

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

        const style = getComputedStyle(document.documentElement);

        // Obtener colores actuales
        const colors = {
            bgColor: style.getPropertyValue('--color-background').trim(),
            cardColor: style.getPropertyValue('--color-card').trim(),
            buttonColor: style.getPropertyValue('--color-muted').trim(),
            textColor: style.getPropertyValue('--color-foreground').trim(),
            gridColor: style.getPropertyValue('--color-border').trim(),
            space1Color: style.getPropertyValue('--color-chart-1').trim(),
            space2olor: style.getPropertyValue('--color-chart-2').trim(),
            space3Color: style.getPropertyValue('--color-chart-3').trim(),
            lineColor: style.getPropertyValue('--color-chart-5').trim(),
            dangerColor: style.getPropertyValue('--color-danger').trim(),
        };

        const loadPlot = async () => {
            try {
                const Plotly = await import('plotly.js-dist-min');

                const getGaugeColor = (value: number) => {
                    if (value <= warningLow) return '#dc2626';             // Danger bajo
                    if (value <= optimalMin) return '#f59e0b';              // Warning bajo
                    if (value <= optimalMax) return '#16a34a';              // Óptimo
                    if (value <= warningHight) return '#f59e0b';            // Warning alto
                    return '#dc2626';                                       // Danger alto
                };


                const data: Plotly.Data[] = [
                    {
                        domain: { x: [0, 1], y: [0, 1] },
                        value: variable,
                        title: {
                            text: `<b>${title}</b><br><span style="font-size:0.8em">${`referencia: ${reference}`}[${unit}]</span>`,
                            font: { size: 16 }
                        },
                        type: 'indicator',
                        mode: 'gauge+number+delta',
                        gauge: {
                            shape: "angular",
                            axis: {
                                range: [minVariable, maxVariable],
                                tickwidth: 0.1,
                                tickcolor: colors.textColor,
                                tickfont: { size: 15 }
                            },
                            bar: {
                                color: getGaugeColor(variable),
                                thickness: 0.5
                            },
                            borderwidth: 1,
                            bordercolor: colors.bgColor,
                            steps: [
                                {
                                    range: [minVariable, warningLow],
                                    color: colors.space1Color
                                },
                                {
                                    range: [warningLow, optimalMin],
                                    color: colors.space2olor
                                },
                                {
                                    range: [optimalMin, optimalMax],
                                    color: colors.space3Color
                                },
                                {
                                    range: [optimalMax, warningHight],
                                    color: colors.space2olor
                                },
                                {
                                    range: [warningHight, maxVariable],
                                    color: colors.space1Color
                                }
                            ],
                            threshold: {
                                line: { color: colors.dangerColor, width: 4 },
                                thickness: 1,
                                value: warningHight
                            }
                        },
                        delta: { reference: reference },
                    }
                ];

                const layout: Partial<Plotly.Layout> = {
                    margin: { t: 80, b: 40, l: 40, r: 40 },
                    paper_bgcolor: colors.bgColor,
                    font: { color: colors.textColor },
                    autosize: true,
                };

                const config: Partial<any> = {
                    displayModeBar: false,
                    responsive: true,
                    staticPlot: false
                };

                await Plotly.newPlot(containerRef.current!, data, layout, config);

            } catch (error) {
                console.error('Failed to load Plotly:', error);
            }
        };

        loadPlot();

        // Cleanup
        return () => {
            if (containerRef.current) {
                const Plotly = require('plotly.js-dist-min');
                Plotly.purge(containerRef.current);
            }
        };
    }, [variable, minVariable, maxVariable, title, unit, warningLow, warningHight, themeVersion]);

    return (
        <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden" />
    );
};

export default Gauge;
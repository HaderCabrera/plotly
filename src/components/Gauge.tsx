'use client';
import { useEffect, useRef, useState } from 'react';

interface VoltageGaugeProps {
    voltage?: number;
    minVoltage?: number;
    maxVoltage?: number;
    title?: string;
    unit?: string;
    dangerThreshold?: number;
    warningThreshold?: number;
}

const Gauge = ({
    voltage = 10.4,
    minVoltage = 0,
    maxVoltage = 24,
    title = 'Voltaje del Sistema',
    unit = 'V',
    dangerThreshold = 20,
    warningThreshold = 16
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

                //Colores según umbrales
                const getGaugeColor = (value: number) => {
                    if (value >= dangerThreshold) return '#dc2626';
                    if (value >= warningThreshold) return '#f59e0b';
                    return '#16a34a';
                };

                const data: Plotly.Data[] = [
                    {
                        domain: { x: [0, 1], y: [0, 1] },
                        value: voltage,
                        title: {
                            text: `<b>${title}</b><br><span style="font-size:0.8em">${`Rango: ${minVoltage}- ${maxVoltage}`} ${unit}</span>`,
                            font: { size: 16 }
                        },
                        type: 'indicator',
                        mode: 'gauge+number+delta',
                        gauge: {
                            shape: "angular",
                            axis: {
                                range: [minVoltage, maxVoltage],
                                tickwidth: 0.1,
                                tickcolor: colors.textColor,
                                tickfont: { size: 15 }
                            },
                            bar: {
                                color: getGaugeColor(voltage),
                                thickness: 0.5
                            },
                            borderwidth: 1,
                            bordercolor: colors.bgColor,
                            steps: [
                                {
                                    range: [minVoltage, warningThreshold],
                                    color: colors.space2olor
                                },
                                {
                                    range: [warningThreshold, dangerThreshold],
                                    color: colors.space3Color
                                },
                                {
                                    range: [dangerThreshold, maxVoltage],
                                    color: colors.space1Color
                                }
                            ],
                            threshold: {
                                line: { color: colors.dangerColor, width: 4 },
                                thickness: 1,
                                value: 23.2
                            }
                        },
                        delta: { reference: 20 },
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
    }, [voltage, minVoltage, maxVoltage, title, unit, dangerThreshold, warningThreshold, themeVersion]);

    return (
        <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden" />
    );
};

export default Gauge;
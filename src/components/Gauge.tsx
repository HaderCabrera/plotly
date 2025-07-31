'use client';
import { useEffect, useRef } from 'react';

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
    voltage = 10,
    minVoltage = 0,
    maxVoltage = 24,
    title = 'Voltaje del Sistema',
    unit = 'V',
    dangerThreshold = 20,
    warningThreshold = 16
}: VoltageGaugeProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const loadPlot = async () => {
            try {
                const Plotly = await import('plotly.js-dist-min');

                // Definir colores según umbrales
                const getGaugeColor = (value: number) => {
                    if (value >= dangerThreshold) return '#dc2626'; // Rojo peligro
                    if (value >= warningThreshold) return '#f59e0b'; // Amarillo advertencia
                    return '#16a34a'; // Verde normal
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
                        mode: 'gauge+number',
                        gauge: {
                            shape:"angular",
                            axis: {
                                range: [minVoltage, maxVoltage],
                                tickwidth: 1,
                                tickcolor: "#374151",
                                tickfont: { size: 15 }
                            },
                            bar: {
                                color: getGaugeColor(voltage),
                                thickness: 0.75
                            },
                            bgcolor: "black",
                            borderwidth: 1,
                            bordercolor: "#a3a3a3",
                            steps: [
                                {
                                    range: [minVoltage, warningThreshold],
                                    color: "#bbf7d0" // Verde claro
                                },
                                {
                                    range: [warningThreshold, dangerThreshold],
                                    color: "#fef08a" // Amarillo claro
                                },
                                {
                                    range: [dangerThreshold, maxVoltage],
                                    color: "#fecaca" // Rojo claro
                                }
                            ],
                            threshold: {
                                line: { color: "#374151", width: 4 },
                                thickness: 1,
                                value: dangerThreshold
                            }
                        }
                    }
                ];

                const layout: Partial<Plotly.Layout> = {
                    margin: { t: 80, b: 40, l: 40, r: 40 },
                    paper_bgcolor: "rgba(0,0,0,0)",
                    plot_bgcolor: "rgba(0,0,0,0)",
                    font: {
                        color: "#374151",
                        family: "Arial, sans-serif"
                    },
                    autosize: true,
                };

                const config: Partial<any> = {
                    displayModeBar: false,
                    responsive: true,
                    staticPlot: false
                };

                Plotly.newPlot(containerRef.current!, data, layout, config);
            } catch (error) {
                console.error('Failed to load Plotly:', error);
            }
        };

        loadPlot();

        // Cleanup
        return () => {
            if (containerRef.current) {
                import('plotly.js-dist-min').then((Plotly) => {
                    Plotly.purge(containerRef.current!);
                });
            }
        };
    }, [voltage, minVoltage, maxVoltage, title, unit, dangerThreshold, warningThreshold]);

    return (
        <div ref={containerRef} className="w-full rounded-2xl overflow-hidden" />
    );
};

export default Gauge;
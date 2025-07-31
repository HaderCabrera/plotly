'use client';

import { useEffect, useRef } from 'react';

const PlotlyChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadPlot = async () => {
      try {
        const Plotly = await import('plotly.js-dist-min');

        const data = [
          {
            z: [
              [0, 1, 2, 3, 4, 5, 6],
              [1, 9, 4, 7, 5, 2, 4],
              [2, 4, 2, 1, 6, 9, 3],
            ],
            type: 'heatmap' as const,
          },
        ];

        const layout = {
          title: { text: 'Customize The Edit Chart Link Text' },
          margin: { t: 50, b: 30 },
          autosize: true,
        };

        const config: Partial<Plotly.Config> = {
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          responsive: true,
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
  }, []);

  return <div ref={containerRef}   className="w-full rounded-2xl overflow-hidden" />;
};

export default PlotlyChart;
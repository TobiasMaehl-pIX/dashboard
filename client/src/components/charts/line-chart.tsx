'use client';

import { getChartColors } from '@/lib/colors';
import { ChartData, ChartOptions } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
import './chart-component-registry'; // Import to register Chart.js components

interface LineChartProps {
  data: ChartData<'line'>;
}

export const LineChart = React.memo(function LineChart({ data }: LineChartProps) {
  const colors = getChartColors();

  const options: ChartOptions<'line'> = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: colors.card,
          titleColor: colors.cardForeground,
          bodyColor: colors.cardForeground,
          borderColor: colors.border,
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: {
            color: colors.border,
          },
          ticks: {
            color: colors.mutedForeground,
          },
        },
        y: {
          grid: {
            color: colors.border,
          },
          ticks: {
            color: colors.mutedForeground,
          },
        },
      },
    }),
    [colors],
  );

  const styledData = React.useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}1a`, // Add transparency for fill
        tension: 0.4,
      })),
    }),
    [data, colors.primary],
  );

  return <Line data={styledData} options={options} />;
});

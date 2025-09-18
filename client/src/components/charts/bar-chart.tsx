'use client';

import { getChartColors } from '@/lib/colors';
import { ChartData, ChartOptions } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import './chart-component-registry'; // Import to register Chart.js components

interface BarChartProps {
  data: ChartData<'bar'>;
}

export const BarChart = React.memo(function BarChart({ data }: BarChartProps) {
  const colors = getChartColors();

  const options: ChartOptions<'bar'> = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
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
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
        borderWidth: 1,
      })),
    }),
    [data, colors.secondary],
  );

  return <Bar data={styledData} options={options} />;
});

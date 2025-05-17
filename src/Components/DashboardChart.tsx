import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardChartProps {
  user: { name: string; role: string } | undefined;
  data: number[];
  labels: string[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
}


export default function DashboardChart({ user, data, labels, backgroundColor, borderColor, borderWidth }: DashboardChartProps) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Count',
        data: data,
        backgroundColor: backgroundColor || ['rgba(44, 93, 99, 0.5)',
                        'rgba(45, 75, 115, 0.5)',
                        'rgba(171, 164, 21, 0.3)',
                        'rgba(88, 64, 105, 0.5)'],
        borderRadius: 4,
        barThickness: 100,
        borderWidth: 3,
        borderColor: borderColor || ['rgba(44, 93, 99, 1)',
                        'rgba(45, 75, 115, 1)',
                        'rgba(171, 164, 21,1)',
                        'rgba(88, 64, 105, 1)',]
      },
    ],
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(1, 1,1, 0.1)'  },
        ticks: { color: '#999' },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(1, 1,1, 0.1)'  },
        ticks: { color: '#999' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#252525',
        titleColor: '#fff',
        bodyColor: '#ccc',
      },
    },
  };

  return (
    <div className="mt-10">
      <h3 className="text-center text-[#777] text-lg mb-4">
        {user ? `Dashboard Overview for ${user.name}` : 'Admin Dashboard Overview'}
      </h3>
      <div className="w-full h-[300px] bg-[#1e1e1e] p-4 rounded-lg shadow-md">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

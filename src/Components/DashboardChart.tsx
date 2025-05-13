import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardChartProps {
  user: { name: string; role: string } | undefined;
  data: number[];
  labels: string[];
  backgroundColor?: string[];
}


export default function DashboardChart({ user, data, labels, backgroundColor }: DashboardChartProps) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Count',
        data: data,
        backgroundColor: backgroundColor || ['#3467eb', '#ccc', '#252525', '#ccc'],
        borderRadius: 4,
        barThickness: 100,
      },
    ],
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: '#333' },
        ticks: { color: '#ccc' },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#333' },
        ticks: { color: '#ccc' },
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

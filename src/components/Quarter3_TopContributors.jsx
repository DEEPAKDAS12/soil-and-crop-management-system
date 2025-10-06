import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaStar, FaTrophy } from 'react-icons/fa';

// Custom Y-Axis tick with icon for top contributor
const CustomYAxisTick = ({ x, y, payload }) => {
  const IconComponent = payload.index === 0 ? FaTrophy : FaStar;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={5} textAnchor="end" fill="#e2e8f0" className="text-sm font-medium">
        <tspan>{payload.value}</tspan>
      </text>
      <foreignObject x={-65} y={-10} width={20} height={20}>
        <IconComponent size={16} className={payload.index === 0 ? 'text-yellow-400' : 'text-gray-400'} style={{ position: 'relative', top: '2px', left: '2px' }} />
      </foreignObject>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 text-gray-100 text-sm">
        <p className="font-semibold text-white mb-1">{label}</p>
        <p>Hours Added: <span className="font-bold text-yellow-400">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

/*
  Quarter3_TopContributors
  - Uses height="100%" ResponsiveContainer; parent flex-1 min-h-0
  - Shows top 5 contributors sorted by hours
*/
const Quarter3_TopContributors = ({ inFocusMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quarter3/top-contributors');
        const result = await response.json();
        if (!result || result.length === 0) {
          setNoData(true);
          setData([]);
        } else {
          const sorted = [...result].sort((a, b) => b.total_hours_added - a.total_hours_added);
          setData(sorted.slice(0, 5));
          setNoData(false);
        }
      } catch (error) {
        console.error('Error fetching Quarter 3 data:', error);
        setNoData(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center flex-1 text-gray-400">Loading chart...</div>;

  if (noData) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400">
        <p className="text-sm">No top contributors data available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 8, right: 24, left: 80, bottom: 8 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
            <XAxis type="number" stroke="#a0aec0" tickFormatter={(value) => value.toFixed(0)} />
            <YAxis dataKey="name" type="category" stroke="#a0aec0" tick={<CustomYAxisTick />} width={100} interval={0} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.06)' }} content={<CustomTooltip />} />
            <Bar dataKey="total_hours_added" name="Hours Added" fill="#FFC400" radius={[0, 4, 4, 0]} animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Quarter3_TopContributors;

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 text-gray-100 text-sm">
        <p className="font-semibold text-white mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            {entry.name}: <span className="font-bold ml-1">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/*
  Quarter2_SubCompPerf
  - Parent drives height (flex-1 min-h-0). ResponsiveContainer uses height="100%"
  - Avoid fixed pixel heights so grid can stretch naturally
*/
const Quarter2_SubCompPerf = ({ inFocusMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quarter2/subcompetency-performance');
        const result = await response.json();
        if (!result || result.length === 0) {
          setNoData(true);
          setData([]);
        } else {
          const sortedData = [...result].sort((a, b) => b.total_resources - a.total_resources);
          setData(sortedData);
          setNoData(false);
        }
      } catch (error) {
        console.error('Error fetching Quarter 2 data:', error);
        setNoData(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center flex-1 text-gray-400">Loading chart...</div>;
  }

  if (noData) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400">
        <p className="text-sm">No sub-competency performance data available.</p>
      </div>
    );
  }

  // Let container dictate size; legend layout adapts in focus mode
  return (
    <div className="flex flex-col h-full w-full min-h-0">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 8, right: 24, left: 120, bottom: 8 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
            <XAxis type="number" stroke="#a0aec0" tickFormatter={(value) => value.toFixed(0)} />
            <YAxis
              dataKey="sub_competency_name"
              type="category"
              stroke="#a0aec0"
              width={110}
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
              interval={0}
            />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.06)' }} content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: inFocusMode ? '24px' : '8px' }}
              formatter={(value) => <span className="text-gray-300 text-xs sm:text-sm font-medium">{value}</span>}
              iconType="circle"
              iconSize={10}
            />
            <Bar dataKey="total_resources" name="Total Resources" fill="#FFC400" radius={[0, 4, 4, 0]} animationDuration={700} />
            <Bar dataKey="resources_in_project" name="Resources in Project" fill="#2563EB" radius={[0, 4, 4, 0]} animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Quarter2_SubCompPerf;

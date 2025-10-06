import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 text-gray-100 text-sm">
        <p className="font-semibold text-white mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            {entry.name}: <span className="font-bold ml-1">{Number(entry.value).toFixed(1)}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/*
  Quarter4_UtilizationTrends
  - Full responsive height via ResponsiveContainer height="100%"
  - Highlights current month with a custom dot
*/
const Quarter4_UtilizationTrends = ({ inFocusMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quarter4/utilization-trend');
        const result = await response.json();
        if (!result || result.length === 0) {
          setNoData(true);
          setData([]);
          return;
        }

        const totalUtilizationSum = result.reduce((sum, entry) => sum + entry.utilization_percent, 0);
        const avgUtilization = result.length > 0 ? totalUtilizationSum / result.length : 0;

        const dataWithTrend = result.map((entry) => ({
          ...entry,
          month_year_short: new Date(entry.month_year).toLocaleString('en-US', { month: 'short', year: '2-digit' }),
          monthly_util: entry.utilization_percent,
          total_util_trend: avgUtilization,
        }));

        setData(dataWithTrend);
        setNoData(false);

        const now = new Date();
        const currentFormatted = now.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        const idx = dataWithTrend.findIndex((d) => d.month_year_short === currentFormatted);
        setCurrentMonthIndex(idx);
      } catch (e) {
        console.error('Error fetching Quarter 4 data:', e);
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
        <p className="text-sm">No historical data available for utilization trend.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 24, left: 16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="month_year_short"
              stroke="#a0aec0"
              interval="preserveStartEnd"
              tickFormatter={(tick, index) => (index === currentMonthIndex ? `▶ ${tick} ◀` : tick)}
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
            />
            <YAxis stroke="#a0aec0" tickFormatter={(value) => `${Number(value).toFixed(0)}%`} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.06)' }} content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: inFocusMode ? '24px' : '8px' }}
              formatter={(value) => <span className="text-gray-300 text-xs sm:text-sm font-medium">{value}</span>}
              iconType="circle"
              iconSize={10}
            />
            <Line
              type="monotone"
              dataKey="monthly_util"
              name="Monthly Utilization"
              stroke="#FFC400"
              strokeWidth={3}
              activeDot={{ r: 6, fill: '#FFC400', stroke: '#FFC400', strokeWidth: 2 }}
              dot={({ cx, cy, key, index }) => {
                if (index === currentMonthIndex) {
                  return <circle key={key} cx={cx} cy={cy} r={8} fill="#2563EB" stroke="#FFC400" strokeWidth={3} />;
                }
                return null;
              }}
              animationDuration={700}
            />
            <Line
              type="monotone"
              dataKey="total_util_trend"
              name="Overall Average Utilization"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              strokeDasharray="8 8"
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Quarter4_UtilizationTrends;

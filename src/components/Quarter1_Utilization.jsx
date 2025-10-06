import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Filters from './Filters';

// Colors for segments
const CHART_COLORS = ['#FFC400', '#2563EB', '#F97316'];

// Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 text-gray-100 text-sm">
        <p className="font-semibold text-white mb-1">{data.name}</p>
        <p>Resources: <span className="font-bold text-yellow-400">{data.value}</span></p>
        <p>Percentage: <span className="font-bold text-blue-400">{(data.percent * 100).toFixed(1)}%</span></p>
      </div>
    );
  }
  return null;
};

/*
  Quarter1_Utilization
  - ResponsiveContainer set to height="100%" inside a parent that stretches (h-full)
  - Filters hidden in focus mode
  - No fixed pixel heights; uses flex/min-h-0 to avoid overflow and scrolling
*/
const Quarter1_Utilization = ({ inFocusMode }) => {
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [subCompetencies, setSubCompetencies] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSubComp, setSelectedSubComp] = useState('');
  const [noData, setNoData] = useState(false);
  const [totalResources, setTotalResources] = useState(0);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const locationsRes = await fetch('http://localhost:5000/api/employees/locations');
        const locationsData = await locationsRes.json();
        setLocations(locationsData);

        const subCompRes = await fetch('http://localhost:5000/api/subcompetencies');
        const subCompData = await subCompRes.json();
        setSubCompetencies(subCompData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    if (!inFocusMode) fetchFilters();
  }, [inFocusMode]);

  const fetchData = useCallback(async () => {
    setNoData(false);
    try {
      const url = new URL('http://localhost:5000/api/quarter1/utilization');
      if (selectedLocation) url.searchParams.append('location', selectedLocation);
      if (selectedSubComp) url.searchParams.append('subCompId', selectedSubComp);

      const response = await fetch(url);
      const result = await response.json();

      const formattedData = [
        { name: 'In Project', value: Number(result.inProject?.value) || 0 },
        { name: 'On Bench', value: Number(result.onBench?.value) || 0 },
        { name: 'Coming to Bench', value: Number(result.comingToBench?.value) || 0 },
      ];

      const total = formattedData.reduce((sum, entry) => sum + entry.value, 0);
      setTotalResources(total);

      if (total === 0) {
        setNoData(true);
        setData([]);
      } else {
        setData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching Quarter 1 data:', error);
      setNoData(true);
      setTotalResources(0);
      setData([]);
    }
  }, [selectedLocation, selectedSubComp]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Chart sizing is fully responsive; outer/inner radii adjust proportionally
  // For focus mode we render bigger radii, but container still dictates final size
  const outerRadius = inFocusMode ? 150 : 90;
  const innerRadius = inFocusMode ? 100 : 60;
  const textFontSize = inFocusMode ? '3.5rem' : '2.4rem';

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      {!inFocusMode && (
        <div className="flex justify-end items-center mb-3 flex-shrink-0">
          <Filters
            locations={locations}
            subCompetencies={subCompetencies}
            selectedLocation={selectedLocation}
            selectedSubComp={selectedSubComp}
            onLocationChange={setSelectedLocation}
            onSubCompChange={setSelectedSubComp}
          />
        </div>
      )}

      {noData ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400">
          <p className="text-sm">No resource utilization data available for this selection.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                animationDuration={500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={2} />
                ))}
              </Pie>

              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-0.8em" className="fill-current text-white text-xs sm:text-sm font-medium">Total Resources</tspan>
                <tspan x="50%" dy="1.6em" fill="#FFC400" style={{ fontSize: textFontSize, fontWeight: 'bold' }}>{totalResources}</tspan>
              </text>

              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: inFocusMode ? '24px' : '8px' }}
                formatter={(value) => <span className="text-gray-300 text-xs sm:text-sm font-medium">{value}</span>}
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Quarter1_Utilization;

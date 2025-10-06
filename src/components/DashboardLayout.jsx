import React, { useCallback, useState } from 'react';
import { FaBars, FaChartBar, FaSignOutAlt, FaTachometerAlt, FaTimes, FaUser, FaBell } from 'react-icons/fa';
import Modal from './Modal';
import Quarter1_Utilization from './Quarter1_Utilization';
import Quarter2_SubCompPerf from './Quarter2_SubCompPerf';
import Quarter3_TopContributors from './Quarter3_TopContributors';
import Quarter4_UtilizationTrends from './Quarter4_UtilizationTrends';

/*
  DashboardLayout (Dark, Space-Optimized)
  - Compact header: merges greeting + notifications into one minimal bar
  - Collapsible sidebar with PUSH behavior: content area resizes, not overlay
  - Dynamic grid: fills all remaining height below header; rows auto-stretch
  - Charts fill their parent: each quarter card is a flex column, chart container flex-1 min-h-0 with ResponsiveContainer height="100%"
*/
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [focusedChart, setFocusedChart] = useState(null);

  // Sidebar widths for push layout
  const sidebarWidth = isSidebarOpen ? 240 : 64; // px

  // Handle focus mode (chart zoom)
  const openFocus = useCallback((title, Component) => setFocusedChart({ title, Component }), []);
  const closeFocus = useCallback(() => setFocusedChart(null), []);

  return (
    <div className="h-screen w-screen bg-gray-950 text-gray-100 overflow-hidden flex">
      {/* Sidebar (push layout via fixed width; main uses calc) */}
      <aside
        className={`h-full bg-gray-900/80 border-r border-gray-800 transition-[width] duration-300 ease-in-out flex flex-col`}
        style={{ width: sidebarWidth }}
      >
        {/* Sidebar header */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-gray-800">
          {isSidebarOpen && (
            <span className="text-lg font-semibold tracking-tight text-yellow-400">MyBuddy</span>
          )}
          <button
            className={`text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 ${isSidebarOpen ? '' : 'mx-auto'}`}
            onClick={() => setIsSidebarOpen((v) => !v)}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" href="#">
            <FaTachometerAlt className="shrink-0" />
            {isSidebarOpen && <span className="font-medium">Dashboard</span>}
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" href="#">
            <FaChartBar className="shrink-0" />
            {isSidebarOpen && <span className="font-medium">Reports</span>}
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" href="#">
            <FaUser className="shrink-0" />
            {isSidebarOpen && <span className="font-medium">Profile</span>}
          </a>
        </nav>

        <div className="mt-auto p-3">
          <button className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors`}>
            <FaSignOutAlt />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main area (push) */}
      <div className="flex-1 min-w-0 flex flex-col transition-[width] duration-300 ease-in-out" style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
        {/* Compact Header: single row for greeting + notifications */}
        <header className="flex items-center justify-between h-12 px-4 border-b border-gray-800 bg-gray-900/60 backdrop-blur">
          <button
            className="flex items-center gap-3 text-sm text-gray-300 hover:text-white"
            onClick={() => setIsSidebarOpen((v) => !v)}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <FaBars className="text-gray-500" />
            <span className="text-gray-300">Welcome, <span className="text-blue-400 font-semibold">Deepakdas</span></span>
          </button>
          <div className="flex items-center gap-2">
            <FaBell className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-950 bg-yellow-400 rounded-full px-3 py-1">4 New</span>
          </div>
        </header>

        {/* Grid that fills remaining height below header */}
        <main className="flex-1 min-h-0 flex flex-col">
          <section className="flex-1 min-h-0 h-full p-3 sm:p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 h-full auto-rows-fr">
              {/* Card template: title + grow chart area */}
              <article
                className="bg-gray-900/70 border border-gray-800 rounded-xl shadow-lg flex flex-col min-h-0 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openFocus('Resource Utilization', Quarter1_Utilization)}
              >
                <div className="px-4 pt-3 pb-2 border-b border-gray-800">
                  <h2 className="text-sm font-semibold text-gray-200">Resource Utilization</h2>
                </div>
                <div className="flex-1 min-h-0 p-3">
                  {/* The inner wrapper ensures the chart container can expand to full height */}
                  <div className="h-full">
                    <Quarter1_Utilization inFocusMode={false} />
                  </div>
                </div>
              </article>

              <article
                className="bg-gray-900/70 border border-gray-800 rounded-xl shadow-lg flex flex-col min-h-0 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openFocus('Sub-Competency Performance', Quarter2_SubCompPerf)}
              >
                <div className="px-4 pt-3 pb-2 border-b border-gray-800">
                  <h2 className="text-sm font-semibold text-gray-200">Sub-Competency Performance</h2>
                </div>
                <div className="flex-1 min-h-0 p-3">
                  <div className="h-full">
                    <Quarter2_SubCompPerf inFocusMode={false} />
                  </div>
                </div>
              </article>

              <article
                className="bg-gray-900/70 border border-gray-800 rounded-xl shadow-lg flex flex-col min-h-0 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openFocus('Top 5 Contributors', Quarter3_TopContributors)}
              >
                <div className="px-4 pt-3 pb-2 border-b border-gray-800">
                  <h2 className="text-sm font-semibold text-gray-200">Top 5 Contributors</h2>
                </div>
                <div className="flex-1 min-h-0 p-3">
                  <div className="h-full">
                    <Quarter3_TopContributors inFocusMode={false} />
                  </div>
                </div>
              </article>

              <article
                className="bg-gray-900/70 border border-gray-800 rounded-xl shadow-lg flex flex-col min-h-0 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openFocus('Utilization Trends', Quarter4_UtilizationTrends)}
              >
                <div className="px-4 pt-3 pb-2 border-b border-gray-800">
                  <h2 className="text-sm font-semibold text-gray-200">Utilization Trends</h2>
                </div>
                <div className="flex-1 min-h-0 p-3">
                  <div className="h-full">
                    <Quarter4_UtilizationTrends inFocusMode={false} />
                  </div>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>

      {/* Focus Mode */}
      <Modal
        isOpen={!!focusedChart}
        title={focusedChart?.title}
        onClose={closeFocus}
      >
        {focusedChart && (
          <div className="w-full h-full">
            {React.createElement(focusedChart.Component, { inFocusMode: true })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardLayout;

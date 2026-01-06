import React from 'react';

const Sidebar = ({ 
  todos, 
  activeView, 
  setActiveView, 
  categories, 
  priorityCounts,
  collapsed,
  toggleSidebar 
}) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const progress = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="sidebar-toggle">
          {collapsed ? '→' : '←'}
        </button>
        {!collapsed && (
          <div className="app-logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">Productify</span>
          </div>
        )}
      </div>

      <div className="sidebar-content">
        {!collapsed && (
          <>
            <div className="sidebar-section">
              <h3 className="section-title">Views</h3>
              <div className="view-buttons">
                <button 
                  onClick={() => setActiveView('list')}
                  className={`view-btn ${activeView === 'list' ? 'active' : ''}`}
                >
                  <span className="view-icon">📝</span>
                  <span className="view-text">List View</span>
                </button>
                <button 
                  onClick={() => setActiveView('board')}
                  className={`view-btn ${activeView === 'board' ? 'active' : ''}`}
                >
                  <span className="view-icon">📋</span>
                  <span className="view-text">Board View</span>
                </button>
                <button 
                  onClick={() => setActiveView('calendar')}
                  className={`view-btn ${activeView === 'calendar' ? 'active' : ''}`}
                >
                  <span className="view-icon">📅</span>
                  <span className="view-text">Calendar</span>
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title">Progress Overview</h3>
              <div className="progress-overview">
                <div className="progress-circle">
                  <svg width="80" height="80" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="#e0e0e0" 
                      strokeWidth="8" 
                      fill="none"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="#4361ee" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${progress * 2.513} 251.3`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text 
                      x="50" 
                      y="55" 
                      textAnchor="middle" 
                      fontSize="18" 
                      fontWeight="bold"
                      fill="#4361ee"
                    >
                      {progress}%
                    </text>
                  </svg>
                </div>
                <div className="progress-stats">
                  <div className="progress-stat">
                    <span className="stat-number">{totalTodos}</span>
                    <span className="stat-label">Total</span>
                  </div>
                  <div className="progress-stat">
                    <span className="stat-number">{completedTodos}</span>
                    <span className="stat-label">Done</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title">Priority Filter</h3>
              <div className="priority-filters">
                <button className="priority-filter high">
                  <span className="priority-dot"></span>
                  <span className="priority-text">High Priority</span>
                  <span className="priority-count">{priorityCounts.high}</span>
                </button>
                <button className="priority-filter medium">
                  <span className="priority-dot"></span>
                  <span className="priority-text">Medium Priority</span>
                  <span className="priority-count">{priorityCounts.medium}</span>
                </button>
                <button className="priority-filter low">
                  <span className="priority-dot"></span>
                  <span className="priority-text">Low Priority</span>
                  <span className="priority-count">{priorityCounts.low}</span>
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title">Productivity</h3>
              <div className="productivity-metrics">
                <div className="metric">
                  <div className="metric-value">{todos.filter(t => !t.completed).length}</div>
                  <div className="metric-label">Pending</div>
                </div>
                <div className="metric">
                  <div className="metric-value">
                    {todos.length > 0 
                      ? Math.round((completedTodos / totalTodos) * 100) 
                      : 0}%
                  </div>
                  <div className="metric-label">Completion</div>
                </div>
                <div className="metric">
                  <div className="metric-value">
                    {categories.length}
                  </div>
                  <div className="metric-label">Categories</div>
                </div>
              </div>
            </div>
          </>
        )}

        {collapsed && (
          <div className="sidebar-collapsed">
            <button 
              onClick={() => setActiveView('list')}
              className={`collapsed-btn ${activeView === 'list' ? 'active' : ''}`}
              title="List View"
            >
              📝
            </button>
            <button 
              onClick={() => setActiveView('board')}
              className={`collapsed-btn ${activeView === 'board' ? 'active' : ''}`}
              title="Board View"
            >
              📋
            </button>
            <button 
              onClick={() => setActiveView('calendar')}
              className={`collapsed-btn ${activeView === 'calendar' ? 'active' : ''}`}
              title="Calendar"
            >
              📅
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
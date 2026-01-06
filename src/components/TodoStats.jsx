import React from 'react';

const TodoStats = ({ todos, clearAllTodos }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const progress = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="todo-stats">
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{totalTodos}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completedTodos}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{totalTodos - completedTodos}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-header">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {totalTodos > 0 && (
        <button onClick={clearAllTodos} className="clear-all-btn">
          🗑️ Clear All
        </button>
      )}
    </div>
  );
};

export default TodoStats;
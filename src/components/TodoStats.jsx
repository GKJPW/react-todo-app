import React from 'react';

const TodoStats = ({ todos, clearAllTodos }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const progress = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="todo-stats">
      <div className="stats-info">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{totalTodos}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{completedTodos}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Remaining:</span>
          <span className="stat-value">{totalTodos - completedTodos}</span>
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{progress}% Complete</span>
      </div>
      
      {totalTodos > 0 && (
        <button onClick={clearAllTodos} className="clear-all-btn">
          Clear All Tasks
        </button>
      )}
    </div>
  );
};

export default TodoStats;
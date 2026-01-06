import React from 'react';

const TodoFilter = ({ filter, setFilter, searchQuery, setSearchQuery, categories }) => {
  return (
    <div className="todo-filter">
      <div className="filter-header">
        <h3>Filter Tasks</h3>
      </div>
      
      <div className="filter-content">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="clear-search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="filter-tabs">
          <button
            onClick={() => setFilter('all')}
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
        </div>
        
        {categories.length > 0 && (
          <div className="category-filters">
            <div className="category-label">Categories:</div>
            <div className="category-chips">
              <button
                onClick={() => setFilter('all')}
                className={`category-chip ${filter === 'all' ? 'active' : ''}`}
              >
                All
              </button>
              {categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => setFilter(`category:${cat}`)}
                  className={`category-chip ${filter === `category:${cat}` ? 'active' : ''}`}
                >
                  #{cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoFilter;
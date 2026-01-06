import React from 'react';

const TodoFilter = ({ filter, setFilter, searchQuery, setSearchQuery, categories }) => {
  return (
    <div className="todo-filter">
      <div className="filter-group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="search-input"
        />
      </div>
      
      <div className="filter-group">
        <div className="filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {categories.length > 0 && (
        <div className="filter-group">
          <select
            onChange={(e) => setFilter(e.target.value === 'all-categories' ? 'all' : `category:${e.target.value}`)}
            className="category-filter"
            value={filter.startsWith('category:') ? filter.split(':')[1] : 'all-categories'}
          >
            <option value="all-categories">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TodoFilter;
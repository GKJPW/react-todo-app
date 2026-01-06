import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';
import TodoStats from './components/TodoStats';
import TodoFilter from './components/TodoFilter';
import TimeDateDisplay from './components/TimeDateDisplay';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
  // Load todos from localStorage on initial render
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('list'); // list, board, calendar

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTodo = (text, priority = 'medium', category = '') => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString(),
      order: todos.length,
      tags: category ? [category] : []
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearAllTodos = () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      setTodos([]);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order property after reordering
        return newItems.map((item, index) => ({
          ...item,
          order: index
        }));
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Get unique categories for filter
  const categories = [...new Set(todos.map(todo => todo.category).filter(Boolean))];
  
  // Get priority counts
  const priorityCounts = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length
  };

  // Filter and search todos
  const filteredTodos = todos.filter(todo => {
    // Filter by status
    if (filter === 'active') {
      if (todo.completed) return false;
    } else if (filter === 'completed') {
      if (!todo.completed) return false;
    } else if (filter.startsWith('category:')) {
      const categoryFilter = filter.split(':')[1];
      if (todo.category !== categoryFilter) return false;
    } else if (filter.startsWith('priority:')) {
      const priorityFilter = filter.split(':')[1];
      if (todo.priority !== priorityFilter) return false;
    }

    // Search by text
    if (searchQuery) {
      return todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Sort by order property for drag and drop
  const sortedTodos = [...filteredTodos].sort((a, b) => a.order - b.order);

  return (
    <div className="app">
      <div className="app-layout">
        {/* Sidebar - Column 1 */}
        <Sidebar 
          todos={todos}
          activeView={activeView}
          setActiveView={setActiveView}
          categories={categories}
          priorityCounts={priorityCounts}
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content - Column 2 */}
        <main className="main-content">
          <div className="content-header">
            <div className="header-left">
              <h1 className="app-title">
                {activeView === 'list' ? '📝 Todo List' : 
                 activeView === 'board' ? '📋 Task Board' : 
                 '📅 Calendar View'}
              </h1>
              <p className="app-subtitle">
                {activeView === 'list' ? 'Manage your daily tasks' : 
                 activeView === 'board' ? 'Organize by priority' : 
                 'Schedule your tasks'}
              </p>
            </div>
            <TimeDateDisplay />
          </div>

          <div className="content-wrapper">
            <TodoForm addTodo={addTodo} />
            
            <TodoStats todos={todos} clearAllTodos={clearAllTodos} />
            
            <TodoFilter 
              filter={filter}
              setFilter={setFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categories={categories}
            />
            
            {sortedTodos.length > 0 ? (
              <div className="todo-list-section">
                <div className="section-header">
                  <h3>Your Tasks ({sortedTodos.length})</h3>
                  <span className="drag-hint">Drag to reorder</span>
                </div>
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={sortedTodos.map(todo => todo.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="todo-list-container">
                      {sortedTodos.map(todo => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          toggleTodo={toggleTodo}
                          deleteTodo={deleteTodo}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h3>No Tasks Found</h3>
                <p>
                  {searchQuery || filter !== 'all' 
                    ? 'No tasks match your current filters' 
                    : 'Start by adding your first task above!'}
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                  className="reset-filters-btn"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Right Panel - Column 3 */}
        <aside className="right-panel">
          <div className="panel-section">
            <h3 className="panel-title">📊 Quick Stats</h3>
            <div className="quick-stats">
              <div className="quick-stat">
                <div className="stat-icon">🔥</div>
                <div className="stat-info">
                  <div className="stat-value">{priorityCounts.high}</div>
                  <div className="stat-label">High Priority</div>
                </div>
              </div>
              <div className="quick-stat">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <div className="stat-value">{priorityCounts.medium}</div>
                  <div className="stat-label">Medium Priority</div>
                </div>
              </div>
              <div className="quick-stat">
                <div className="stat-icon">🌱</div>
                <div className="stat-info">
                  <div className="stat-value">{priorityCounts.low}</div>
                  <div className="stat-label">Low Priority</div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h3 className="panel-title">🏷️ Categories</h3>
            <div className="categories-list">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setFilter(`category:${category}`)}
                    className={`category-item ${filter === `category:${category}` ? 'active' : ''}`}
                  >
                    <span className="category-dot"></span>
                    <span className="category-name">{category}</span>
                    <span className="category-count">
                      {todos.filter(todo => todo.category === category).length}
                    </span>
                  </button>
                ))
              ) : (
                <p className="no-categories">No categories yet</p>
              )}
            </div>
          </div>

          <div className="panel-section">
            <h3 className="panel-title">💡 Quick Actions</h3>
            <div className="quick-actions">
              <button 
                onClick={clearAllTodos}
                className="quick-action-btn danger"
                disabled={todos.length === 0}
              >
                <span className="action-icon">🗑️</span>
                Clear All Tasks
              </button>
              <button 
                onClick={() => {
                  const incomplete = todos.filter(todo => !todo.completed);
                  if (incomplete.length > 0) {
                    setTodos(todos.map(todo => ({ ...todo, completed: true })));
                  }
                }}
                className="quick-action-btn success"
                disabled={todos.length === 0}
              >
                <span className="action-icon">✅</span>
                Complete All
              </button>
              <button 
                onClick={() => {
                  const url = `data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(todos, null, 2)
                  )}`;
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'todos-backup.json';
                  a.click();
                }}
                className="quick-action-btn"
                disabled={todos.length === 0}
              >
                <span className="action-icon">💾</span>
                Export Tasks
              </button>
            </div>
          </div>

          <div className="panel-section">
            <h3 className="panel-title">📅 Recent Activity</h3>
            <div className="recent-activity">
              {todos.slice(-3).reverse().map((todo, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {todo.completed ? '✅' : '📝'}
                  </div>
                  <div className="activity-info">
                    <div className="activity-text">{todo.text}</div>
                    <div className="activity-time">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {todos.length === 0 && (
                <p className="no-activity">No recent activity</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';
import TodoStats from './components/TodoStats';
import TodoFilter from './components/TodoFilter';
import './App.css';

const App = () => {
  // Load todos from localStorage on initial render
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // Load theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragItemIndex, setDragItemIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, priority = 'medium', category = '') => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString(),
      order: todos.length
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

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Drag and drop functionality
  const handleDragStart = (index) => {
    setDragItemIndex(index);
    setIsDragging(true);
    setTimeout(() => {
      const draggedElement = document.querySelector(`[data-index="${index}"]`);
      if (draggedElement) {
        draggedElement.classList.add('dragging');
      }
    }, 0);
  };

  const handleDragEnter = (index) => {
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (dropIndex) => {
    if (dragItemIndex === null || dragItemIndex === dropIndex) {
      resetDragState();
      return;
    }

    const newTodos = [...todos];
    const draggedTodo = newTodos[dragItemIndex];
    
    newTodos.splice(dragItemIndex, 1);
    newTodos.splice(dropIndex, 0, draggedTodo);
    
    const reorderedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index
    }));
    
    setTodos(reorderedTodos);
    resetDragState();
  };

  const resetDragState = () => {
    setIsDragging(false);
    setDragItemIndex(null);
    setDragOverIndex(null);
    document.querySelectorAll('.todo-item.dragging').forEach(el => {
      el.classList.remove('dragging');
    });
  };

  // Get unique categories for filter
  const categories = [...new Set(todos.map(todo => todo.category).filter(Boolean))];

  // Filter and search todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      if (todo.completed) return false;
    } else if (filter === 'completed') {
      if (!todo.completed) return false;
    } else if (filter.startsWith('category:')) {
      const categoryFilter = filter.split(':')[1];
      if (todo.category !== categoryFilter) return false;
    }

    if (searchQuery) {
      return todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Sort todos
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="app-title">📝 What to do?</h1>
            <p className="app-subtitle">Organize your tasks efficiently</p>
          </div>
          <div className="header-right">
            <div className="date-time-display">
              <div className="current-date">{formatDate(currentDateTime)}</div>
              <div className="current-time">{formatTime(currentDateTime)}</div>
            </div>
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <svg className="theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              ) : (
                <svg className="theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              )}
              <span className="theme-text">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="todo-container">
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
            <ul className="todo-list">
              {sortedTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
                  isDragging={isDragging}
                  dragItemIndex={dragItemIndex}
                  dragOverIndex={dragOverIndex}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={resetDragState}
                />
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">{theme === 'light' ? '📝' : '✨'}</div>
              <h3>No Todos</h3>
              <p>{searchQuery || filter !== 'all' 
                ? 'No tasks match your criteria' 
                : 'Add your first task above to get started!'}
              </p>
            </div>
          )}
          
          {todos.length > 0 && (
            <div className="hint">
              <small>
                💡 Tip: Drag and drop tasks to reorder them | Click on task text to toggle completion
              </small>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Total Tasks: {todos.length} | Completed: {todos.filter(t => t.completed).length} | Theme: {theme === 'light' ? '☀️ Light' : '🌙 Dark'}</p>
        <small>Your tasks are saved automatically</small>
      </footer>
    </div>
  );
};

export default App;
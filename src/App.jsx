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

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragItemIndex, setDragItemIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

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
      order: todos.length // Add order property for sorting
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

  // Drag and drop functionality
  const handleDragStart = (index) => {
    setDragItemIndex(index);
    setIsDragging(true);
    // Add a slight delay to ensure the drag image is captured correctly
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
    
    // Remove the dragged item
    newTodos.splice(dragItemIndex, 1);
    // Insert it at the new position
    newTodos.splice(dropIndex, 0, draggedTodo);
    
    // Update order property
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
    // Remove dragging class from all items
    document.querySelectorAll('.todo-item.dragging').forEach(el => {
      el.classList.remove('dragging');
    });
  };

  // Get unique categories for filter
  const categories = [...new Set(todos.map(todo => todo.category).filter(Boolean))];

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
    }

    // Search by text
    if (searchQuery) {
      return todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Sort todos: by order property first, then by priority
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // First sort by order property
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    // Then by priority if order is the same
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
            <h1 className="app-title">📝 Todo Master</h1>
            <p className="app-subtitle">Organize your tasks efficiently</p>
          </div>
          <div className="date-time-display">
            <div className="current-date">{formatDate(currentDateTime)}</div>
            <div className="current-time">{formatTime(currentDateTime)}</div>
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
              <div className="empty-icon">📝</div>
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
        <p>Total Tasks: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>
        <small>Your tasks are saved automatically</small>
      </footer>
    </div>
  );
};

export default App;
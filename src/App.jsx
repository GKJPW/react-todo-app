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
      createdAt: new Date().toISOString()
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

  // Sort todos: high priority first, then by creation date
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">📝 Todo Master</h1>
        <p className="app-subtitle">Organize your tasks efficiently</p>
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
              {sortedTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
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
                💡 Tip: Click on the task text to toggle completion
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
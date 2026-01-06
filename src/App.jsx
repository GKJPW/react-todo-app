import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';
import TodoStats from './components/TodoStats';
import TodoFilter from './components/TodoFilter';
import TimeDateDisplay from './components/TimeDateDisplay';
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

  // Sort by order property for drag and drop
  const sortedTodos = [...filteredTodos].sort((a, b) => a.order - b.order);

  return (
    <div className="app">
      <div className="mobile-layout">
        <div className="mobile-header">
          <div className="header-left">
            <h1 className="app-title">📝 Todo</h1>
            <p className="app-subtitle">Stay organized</p>
          </div>
          <TimeDateDisplay />
        </div>

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
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={sortedTodos.map(todo => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
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
                </SortableContext>
              </DndContext>
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
                  💡 Tip: Drag and drop to reorder • Click task text to toggle
                </small>
              </div>
            )}
          </div>
        </main>

        <footer className="app-footer">
          <div className="footer-stats">
            <span className="footer-stat">
              📋 Total: {todos.length}
            </span>
            <span className="footer-stat">
              ✅ Done: {todos.filter(t => t.completed).length}
            </span>
            <span className="footer-stat">
              ⏳ Pending: {todos.filter(t => !t.completed).length}
            </span>
          </div>
          <small>Your tasks are saved automatically</small>
        </footer>
      </div>
    </div>
  );
};

export default App;
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TodoItem = ({ todo, toggleTodo, deleteTodo }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`todo-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="todo-item-content">
        <div className="drag-handle" {...attributes} {...listeners}>
          <svg
            className="drag-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
        
        <div className="todo-checkbox-container">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            className="todo-checkbox"
          />
        </div>
        
        <div className="todo-details">
          <div className="todo-main">
            <span
              className={`todo-text ${todo.completed ? 'completed' : ''}`}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <div className="todo-actions">
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-btn"
                aria-label={`Delete task: ${todo.text}`}
              >
                <svg
                  className="delete-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="todo-meta">
            <div className="meta-left">
              <span 
                className="priority-indicator"
                style={{ backgroundColor: getPriorityColor(todo.priority) }}
              ></span>
              <span className={`priority-badge priority-${todo.priority}`}>
                {todo.priority === 'high' ? '🔥 High' : 
                 todo.priority === 'medium' ? '⚡ Medium' : '🌱 Low'}
              </span>
              
              {todo.category && (
                <span className="category-badge">
                  #{todo.category}
                </span>
              )}
            </div>
            
            <div className="meta-right">
              <span className="created-date">
                {new Date(todo.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
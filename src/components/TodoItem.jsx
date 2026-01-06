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

  return (
    <li 
      ref={setNodeRef}
      style={style}
      className={`todo-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="todo-content">
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
        
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="todo-checkbox"
        />
        
        <span
          className={`todo-text ${todo.completed ? 'completed' : ''}`}
          onClick={() => toggleTodo(todo.id)}
        >
          {todo.text}
        </span>
        
        <div className="todo-meta">
          {todo.priority && (
            <span className={`priority-badge priority-${todo.priority}`}>
              {todo.priority === 'high' ? '🔥' : todo.priority === 'medium' ? '⚡' : '🌱'} {todo.priority}
            </span>
          )}
          {todo.category && (
            <span className="category-badge">
              #{todo.category}
            </span>
          )}
        </div>
      </div>
      
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
    </li>
  );
};

export default TodoItem;
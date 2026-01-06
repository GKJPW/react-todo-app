import React from 'react';

const TodoItem = ({ 
  todo, 
  index,
  toggleTodo, 
  deleteTodo,
  isDragging,
  dragItemIndex,
  dragOverIndex,
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onDragEnd
}) => {
  const isBeingDragged = dragItemIndex === index;
  const isDragOver = dragOverIndex === index && !isBeingDragged;

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    onDragStart(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver(e, index);
  };

  const handleDrop = () => {
    onDrop(index);
  };

  return (
    <li 
      className={`todo-item ${isBeingDragged ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      data-index={index}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnter={() => onDragEnter(index)}
      onDragLeave={onDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
    >
      <div className="todo-content">
        <div className="drag-handle">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="5" r="1"></circle>
            <circle cx="9" cy="12" r="1"></circle>
            <circle cx="9" cy="19" r="1"></circle>
            <circle cx="15" cy="5" r="1"></circle>
            <circle cx="15" cy="12" r="1"></circle>
            <circle cx="15" cy="19" r="1"></circle>
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
        {todo.priority && (
          <span className={`priority-badge priority-${todo.priority}`}>
            {todo.priority}
          </span>
        )}
        {todo.category && (
          <span className="category-badge">
            {todo.category}
          </span>
        )}
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
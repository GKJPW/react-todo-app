import React, { useState } from 'react';

const TodoForm = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text, priority, category);
      setText('');
      setCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-header">
        <h3>Add New Task</h3>
      </div>
      <div className="form-group">
        <div className="input-group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
            autoFocus
          />
          <button type="submit" className="add-btn">
            <span className="add-icon">+</span>
            Add Task
          </button>
        </div>
        
        <div className="form-options">
          <div className="option-group">
            <span className="option-label">Priority Level:</span>
            <div className="priority-options">
              {['low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`priority-option ${priority === level ? 'active' : ''} ${level}`}
                  onClick={() => setPriority(level)}
                >
                  {level === 'high' ? '🔥 High' : level === 'medium' ? '⚡ Medium' : '🌱 Low'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="option-group">
            <span className="option-label">Category:</span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Work, Personal, Shopping, etc."
              className="category-input"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;
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
      setPriority('medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
          autoFocus
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional)"
          className="category-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit" className="add-btn">
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
import React, { useState, useEffect, useRef } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isManualUpdate, setIsManualUpdate] = useState(false);
  const titleRef = useRef(null);
  const textRef = useRef(null);

  // Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Сохранение данных в localStorage при изменении todos, только если isManualUpdate true
  useEffect(() => {
    if (isManualUpdate) {
      localStorage.setItem('todos', JSON.stringify(todos));
      setIsManualUpdate(false); // Сброс флага после сохранения
    }
  }, [todos, isManualUpdate]);

  const handleAddTodo = () => {
    const title = titleRef.current.value;
    const text = textRef.current.value;
    if (title.trim() && text.trim()) {
      if (editingIndex !== null) {
        const updatedTodos = todos.map((todo, index) =>
          index === editingIndex ? { title, text } : todo
        );
        setTodos(updatedTodos);
        setEditingIndex(null);
      } else {
        setTodos([...todos, { title, text }]);
      }
      setIsManualUpdate(true); // Установить флаг для ручного обновления
      titleRef.current.value = '';
      textRef.current.value = '';
    }
  };

  const handleEditTodo = (index) => {
    setEditingIndex(index);
    titleRef.current.value = todos[index].title;
    textRef.current.value = todos[index].text;
  };

  const handleDeleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
    setIsManualUpdate(true); // Установить флаг для ручного обновления
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Title"
          ref={titleRef}
        />
        <textarea
          placeholder="Text"
          ref={textRef}
        />
        <button
          type="button"
          className={editingIndex !== null ? 'edit-btn' : 'add-btn'}
          onClick={handleAddTodo}
        >
          {editingIndex !== null ? 'Update' : 'Add'}
        </button>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <div className='taskit'>
              <h2>{todo.title}</h2>
              <p>{todo.text}</p>
            </div>
            <div className="todo-actions">
              <button className="edit-btn" onClick={() => handleEditTodo(index)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDeleteTodo(index)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;

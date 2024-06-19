import TodoList from './components/TodoList';
import TodoCreate from './components/TodoCreate';
import todoService from './services/todos';
import './App.css';
import { useState, useEffect } from 'react';

const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    console.log('effect')
    todoService
      .getAll()
      .then(response => {
        setTodos(response.data)
      })
  }, [])

  const createTodo = (title) => {

    const newTodo = { id: crypto.randomUUID(), title, completed: false };
    todoService
      .create(newTodo)
      .then(res => {
        console.log(res);
      })

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
  };

  const removeTodo = (id) => {
    todoService
      .destroy(id)
      .then(res => {
        console.log(`Item deleted successfully, ${res.data}`);
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
    
  };

  const changeTodo = (id, title, completed = false) => {
    const todo = todos.find(n => n.id === id);
    const changedTodo = {...todo, title: title, completed: completed};
    
    todoService
      .update(id, changedTodo)
      .then(res => {
        setTodos(todos.map(n => n.id !== id ? n : res.data));
      })
  }; 

  return (
    <main className="main">
      <h1>
        Daily Planner <span>Streamline Your Day, the React Way!</span>
      </h1>
      <TodoList todos={todos} removeTodo={removeTodo} changeTodo={changeTodo} />
      <TodoCreate createTodo={createTodo} />
    </main>
  );
};

export default App;
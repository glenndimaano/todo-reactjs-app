import {useEffect, useState} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import "./App.css";

export default function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(
    localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos"))
      : []
  );

  const onChange = (value) => {
    setTodo(value);
  };

  const addTodo = (event) => {
    event.preventDefault();
    if (!todo) return;
    const newTodo = {
      id: new Date().getTime().toString(),
      todo: todo,
      isDone: false,
    };
    setTodos([...todos, newTodo]);
    setTodo("");
  };

  const onDelete = (index) => {
    todos.splice(index, 1);
    setTodos([...todos]);
  };

  const isDone = (_id) => {
    todos.map((item) => {
      if (item.id === _id) {
        item.isDone = !item.isDone ? true : false;
      }
    });
    setTodos([...todos]);
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify([...todos]));
  }, [todos]);

  return (
    <>
      <Header />
      <Todos
        todo={todo}
        onChange={onChange}
        onSubmit={addTodo}
      />
      <TodoList
        todos={todos}
        setTodos={setTodos}
        onDelete={onDelete}
        isDone={isDone}
      />
    </>
  );
}

function Header() {
  return (
    <div className="container">
      <div className="wrapper">
        <h1>TODO</h1>
      </div>
    </div>
  );
}

function Todos({todo, onChange, onSubmit}) {
  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <input
          className="input-text"
          value={todo}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          placeholder="Create a new Todo..."
        />
      </form>
    </div>
  );
}

function TodoList({todos, setTodos, onDelete, isDone}) {
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos([...items]);
  };

  return (
    <div className="container">
      {todos.length === 0 ? (
        <p>Nothing todo..</p>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul
                role="list"
                {...provided.droppableProps}
                ref={provided.innerRef}>
                {todos.map((item, index) => {
                  return (
                    <Draggable
                      draggableId={item.id}
                      index={index}
                      key={item.id}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onDoubleClick={() => isDone(item.id)}>
                          <div className="item-list">
                            {!item.isDone ? (
                              <p>{item.todo}</p>
                            ) : (
                              <p style={{color: "green"}}>done</p>
                            )}
                            <button onClick={() => onDelete(index)}>X</button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                {todos.length > 1 ? (
                  <div className="wrapper">
                    <p style={{fontSize: "1rem"}}>
                      Drag to change to position...
                    </p>
                    <p style={{fontSize: "1rem"}}>
                      Double click to <span style={{color: "green"}}>Done</span>
                      /<span style={{color: "red"}}>Undone</span>..
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

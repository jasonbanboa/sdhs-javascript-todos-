import { $, $$, uid } from './lib.js';

const TodoStates = {
  completed: 'completed',
  editing: 'editing',
  active: 'active',
}

class TodoState {
  type;
  constructor(todo) {
    this.todo = todo;
  }
  render() {};
}

class CompletedState extends TodoState {
  type = TodoStates.completed;
  render() {
    return `<li class="completed" data-id="${this.todo.id}">
            <div class="view">
              <input class="toggle" type="checkbox" checked />
              <label>${this.todo.name}</label>
              <button class="destroy"></button>
            </div>
          </li>`;
  }
}
class EditingState extends TodoState {
  type = TodoStates.editing;
  render() {
    return `<li class="editing" data-id="${this.todo.id}">
            <div class="view">
              <input class="toggle" type="checkbox" ${this.todo.prevState.type === TodoStates.completed ? 'checked' : ''} />
              <label>${this.todo.name}</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" type="text" value="${this.todo.name}" />
          </li>`;
  }
}
class ActiveState extends TodoState {
  type = TodoStates.active;
  render() {
    return `<li data-id="${this.todo.id}">
            <div class="view">
              <input class="toggle" type="checkbox" />
              <label>${this.todo.name}</label>
              <button class="destroy"></button>
            </div>
          </li>`;
  }
}


class Todo {
  constructor({ id = uid(), state = new ActiveState(this), prevState = new ActiveState(this), name, }) {
    this.id = id;
    this.state = state;
    this.prevState = prevState;
    this.name = name;
  }
  setState(state) {
    this.prevState = this.state;
    this.state = state;
  }
  render() {
    return this.state.render();
  }
} 


class App {
  constructor() {
    this.init();
  }
  init() {
    this.todos = [];
    this.renderTodos();
    this.setEvents();
  }

  renderTodos() {
    console.log('rendered');
    $('.todo-list').innerHTML = this.todos.reduce((html, todo) => html += todo.render(), '');
  }

  setEvents() {

    $('.new-todo').onkeydown = ({ key, target, target: { value } }) => {
      if (key !== 'Enter') return;
      if (!value.trim()) return alert('뭐를 하겠다는 거야?');
      this.todos.push(new Todo({ name: value }));
      this.renderTodos();
      target.value = '';
    }

    document.onclick = ({ target }) => {

      if (target.matches('.toggle')) {
        const todoId = +target.closest('li').dataset.id;
        const todo = this.todos.find((({ id }) => id === todoId));
        todo.setState(
          target.checked ? new CompletedState(todo) : new ActiveState(todo)
        );
        return this.renderTodos();
      }

      if (target.matches('.destroy')) {
        const todoId = +target.closest('li').dataset.id;
        this.todos = this.todos.filter((({ id }) => id !== todoId));
        return this.renderTodos();
      }
      
    }

    document.ondblclick = ({ target }) => {

      if (target.closest('.view')) {
        const todoId = +target.closest('li').dataset.id;
        const todo = this.todos.find((({ id }) => id === todoId));
        todo.setState(
          new EditingState(todo)
        );

        this.renderTodos();

        const $editInput = $('.edit');
        $editInput.onblur = () => {
          todo.name = $editInput.value;
          todo.setState(
            todo.prevState
          );
          return this.renderTodos();
        }
      }

    }


  }
}

new App();
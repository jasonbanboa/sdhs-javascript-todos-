import { $, $$, uid } from './lib.js';

const TodoStates = {
  completed: 'completed',
  active: 'active',
}

class Todo {
  constructor({ id = uid(), state = TodoStates.active, isEditing = false, name, }) {
    this.id = id;
    this.state = state;
    this.isEditing = isEditing;
    this.name = name;
  }
  setState(state) {
    this.prevState = this.state;
    this.state = state;
  }
  render() {
    const className = this.isEditing ? 'editing' : this.state;
    return `<li class="${className}" data-id="${this.id}">
              <div class="view">
                <input class="toggle" type="checkbox" ${this.state === TodoStates.completed ? 'checked' : ''} />
                <label>${this.name}</label>
                <button class="destroy"></button>
              </div>
              ${this.isEditing ? `<input class="edit" type="text" value="${this.name}" />` : ''}
            </li>`;
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
    $('.todo-list').innerHTML = this.todos.reduce((html, todo) => html += todo.render(), '');
    console.log($('.todo-list').innerHTML);
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
          target.checked ? TodoStates.completed : TodoStates.active
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
        todo.isEditing = true;

        this.renderTodos();

        const $editInput = $('.edit');
        $editInput.onblur = () => {
          todo.name = $editInput.value;
          todo.isEditing = false;
          return this.renderTodos();
        }
      }

    }


  }
}

new App();
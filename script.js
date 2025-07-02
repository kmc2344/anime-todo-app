// テーマ切り替え
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 保存されたテーマを適用
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
}

// Todoアイテムのクラス
class TodoItem {
    constructor(title, episode, platform, priority) {
        this.id = Date.now();
        this.title = title;
        this.episode = episode;
        this.platform = platform;
        this.priority = priority;
        this.completed = false;
    }
}

// Todoリストの管理
class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.form = document.getElementById('todoForm');
        this.list = document.getElementById('todoList');
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });
    }

    addTodo() {
        const title = document.getElementById('title').value;
        const episode = document.getElementById('episode').value;
        const platform = document.getElementById('platform').value;
        const priority = document.getElementById('priority').value;

        const todo = new TodoItem(title, episode, platform, priority);
        this.todos.push(todo);
        this.saveTodos();
        this.render();
        this.form.reset();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        this.list.innerHTML = '';
        this.todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = 'todo-item';
            todoElement.innerHTML = `
                <div class="todo-header">
                    <h3 class="todo-title">${todo.title}</h3>
                    <span class="todo-status ${todo.completed ? 'status-completed' : 'status-pending'}">
                        ${todo.completed ? '完了' : '未完了'}
                    </span>
                </div>
                <div class="todo-details">
                    <div class="todo-detail-item">
                        <span class="todo-detail-label">プレイ予定時間:</span>
                        <span>${todo.episode}時間</span>
                    </div>
                    <div class="todo-detail-item">
                        <span class="todo-detail-label">プラットフォーム:</span>
                        <span>${todo.platform}</span>
                    </div>
                    <div class="todo-detail-item">
                        <span class="todo-detail-label">優先度:</span>
                        <span>${todo.priority}</span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button onclick="todoList.toggleTodo(${todo.id})">
                        ${todo.completed ? '未完了に戻す' : '完了にする'}
                    </button>
                    <button class="delete-btn" onclick="todoList.deleteTodo(${todo.id})">削除</button>
                </div>
            `;
            this.list.appendChild(todoElement);
        });
    }
}

// DOMContentLoadedイベントでTodoListを初期化
document.addEventListener('DOMContentLoaded', function() {
    const todoList = new TodoList();
    // グローバルスコープにtodoListを設定（onclick属性で使用するため）
    window.todoList = todoList;
}); 
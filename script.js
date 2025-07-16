<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const episodeInput = document.getElementById('episode-input');
    const currentEpisodeInput = document.getElementById('current-episode-input');
    const statusInput = document.getElementById('status-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const themeToggle = document.getElementById('theme-toggle');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('animeTasks')) || [];
    let currentFilter = 'all';

    // テーマ切り替え
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // 保存されたテーマを適用
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    // タスクの追加
    addTaskButton.addEventListener('click', () => {
        const title = taskInput.value.trim();
        const totalEpisodes = parseInt(episodeInput.value);
        const currentEpisode = parseInt(currentEpisodeInput.value);
        const status = statusInput.value;

        if (title && !isNaN(totalEpisodes) && !isNaN(currentEpisode)) {
            const task = {
                id: Date.now(),
                title,
                totalEpisodes,
                currentEpisode,
                status,
                completed: status === 'completed'
            };

            tasks.push(task);
            saveTasks();
            renderTasks();
            clearInputs();
        }
    });

    // タスクの削除
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.dataset.id);
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    });

    // ステータスの更新
    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-select')) {
            const taskId = parseInt(e.target.dataset.id);
            const task = tasks.find(task => task.id === taskId);
            if (task) {
                task.status = e.target.value;
                task.completed = e.target.value === 'completed';
                saveTasks();
                renderTasks();
            }
        }
    });

    // フィルターボタンの処理
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    // タスクの保存
    function saveTasks() {
        localStorage.setItem('animeTasks', JSON.stringify(tasks));
    }

    // 入力欄のクリア
    function clearInputs() {
        taskInput.value = '';
        episodeInput.value = '';
        currentEpisodeInput.value = '';
        statusInput.value = 'watching';
    }

    // タスクの表示
    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = currentFilter === 'all' 
            ? tasks 
            : tasks.filter(task => task.status === currentFilter);

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span>${task.title}</span>
                <span>全${task.totalEpisodes}話</span>
                <span>現在${task.currentEpisode}話</span>
                <select class="status-select" data-id="${task.id}">
                    <option value="watching" ${task.status === 'watching' ? 'selected' : ''}>視聴中</option>
                    <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>完了</option>
                    <option value="plan-to-watch" ${task.status === 'plan-to-watch' ? 'selected' : ''}>視聴予定</option>
                </select>
                <button class="delete-btn" data-id="${task.id}">削除</button>
            `;
            taskList.appendChild(li);
        });
    }

    // 初期表示
    renderTasks();
=======
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
>>>>>>> faf745e10ab2e706bdd77515b309a36f2ccc269e
}); 
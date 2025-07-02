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
}); 
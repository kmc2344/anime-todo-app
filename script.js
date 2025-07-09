document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const episodeInput = document.getElementById('episode-input');
    const currentEpisodeInput = document.getElementById('current-episode-input');
    const statusInput = document.getElementById('status-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const todayList = document.getElementById('today-list');
    const importantList = document.getElementById('important-list');
    const themeToggle = document.getElementById('theme-toggle');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    let tasks = JSON.parse(localStorage.getItem('animeTasks')) || [];
    let currentFilter = 'all';
    let currentTab = 'main';

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

    // モバイルメニューの開閉
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    });

    // オーバーレイクリックでメニューを閉じる
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });

    // タブクリック時にモバイルメニューを閉じる
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
            }
        });
    });

    // タブ切り替え
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });

    function switchTab(tabName) {
        // タブボタンのアクティブ状態を更新
        navTabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // タブコンテンツの表示を切り替え
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // ページタイトルを更新
        const titles = {
            'main': 'アニメTodoアプリ',
            'today': '今日の予定',
            'important': '重要なアニメ'
        };
        pageTitle.textContent = titles[tabName];

        currentTab = tabName;
        renderCurrentTab();
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
                completed: status === 'completed',
                important: false,
                today: false,
                createdAt: new Date().toISOString()
            };

            tasks.push(task);
            saveTasks();
            renderCurrentTab();
            clearInputs();
        }
    });

    // タスクの削除
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.dataset.id);
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderCurrentTab();
        }
    });

    // 重要ボタンの処理
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('important-btn')) {
            const taskId = parseInt(e.target.dataset.id);
            const task = tasks.find(task => task.id === taskId);
            if (task) {
                task.important = !task.important;
                saveTasks();
                renderCurrentTab();
            }
        }
    });

    // 今日中トグルスイッチの処理
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-switch')) {
            const taskId = parseInt(e.target.dataset.id);
            const task = tasks.find(task => task.id === taskId);
            if (task) {
                task.today = !task.today;
                saveTasks();
                renderCurrentTab();
            }
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
                renderCurrentTab();
            }
        }
    });

    // フィルターボタンの処理
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderCurrentTab();
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

    // 現在のタブに応じてタスクを表示
    function renderCurrentTab() {
        switch (currentTab) {
            case 'main':
                renderMainTasks();
                break;
            case 'today':
                renderTodayTasks();
                break;
            case 'important':
                renderImportantTasks();
                break;
        }
    }

    // メインタブのタスク表示
    function renderMainTasks() {
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
                <button class="important-btn ${task.important ? 'important' : ''}" data-id="${task.id}">
                    ${task.important ? '⭐️' : '☆'}
                </button>
                <div class="toggle-container">
                    <div class="toggle-switch ${task.today ? 'active' : ''}" data-id="${task.id}"></div>
                    <span class="toggle-label">今日中</span>
                </div>
                <button class="delete-btn" data-id="${task.id}">削除</button>
            `;
            taskList.appendChild(li);
        });
    }

    // 今日の予定タブのタスク表示
    function renderTodayTasks() {
        todayList.innerHTML = '';
        const todayTasks = tasks.filter(task => task.today);

        if (todayTasks.length === 0) {
            todayList.innerHTML = '<li class="no-tasks">今日の予定に追加されたアニメはありません</li>';
            return;
        }

        todayTasks.forEach(task => {
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
                <button class="important-btn ${task.important ? 'important' : ''}" data-id="${task.id}">
                    ${task.important ? '⭐️' : '☆'}
                </button>
                <button class="today-btn today" data-id="${task.id}">📅</button>
                <button class="delete-btn" data-id="${task.id}">削除</button>
            `;
            todayList.appendChild(li);
        });
    }

    // 重要タブのタスク表示
    function renderImportantTasks() {
        importantList.innerHTML = '';
        const importantTasks = tasks.filter(task => task.important);

        if (importantTasks.length === 0) {
            importantList.innerHTML = '<li class="no-tasks">重要なアニメはありません</li>';
            return;
        }

        importantTasks.forEach(task => {
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
                <button class="important-btn important" data-id="${task.id}">⭐️</button>
                <div class="toggle-container">
                    <div class="toggle-switch ${task.today ? 'active' : ''}" data-id="${task.id}"></div>
                    <span class="toggle-label">今日中</span>
                </div>
                <button class="delete-btn" data-id="${task.id}">削除</button>
            `;
            importantList.appendChild(li);
        });
    }

    // 初期表示
    renderCurrentTab();
}); 
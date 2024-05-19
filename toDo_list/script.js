document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);
    clearAllBtn.addEventListener('click', clearAllTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const taskItem = createTaskItem(taskText);
            taskList.appendChild(taskItem);
            saveTasks();
            taskInput.value = '';
        }
    }

    function createTaskItem(taskText) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <div>
                <span>${taskText}</span>
                <button class="add-subtask-btn">+ Subtask</button>
                <div class="progress-bar-container">
                    <div class="progress-bar"></div>
                </div>
                <ul class="subtask-list"></ul>
            </div>
            <div>
                <button class="complete-btn">&#x2713;</button>
                <button class="delete-btn">&#x2715;</button>
            </div>
        `;
        return taskItem;
    }

    function handleTaskActions(e) {
        if (e.target.classList.contains('complete-btn')) {
            e.target.closest('.task-item').classList.toggle('completed');
        } else if (e.target.classList.contains('delete-btn')) {
            e.target.closest('.task-item').remove();
        } else if (e.target.classList.contains('add-subtask-btn')) {
            addSubtask(e.target.closest('.task-item'));
        } else if (e.target.classList.contains('complete-subtask-btn')) {
            e.target.closest('.subtask-item').classList.toggle('completed');
            updateProgress(e.target.closest('.task-item'));
        } else if (e.target.classList.contains('delete-subtask-btn')) {
            e.target.closest('.subtask-item').remove();
            updateProgress(e.target.closest('.task-item'));
        }
        saveTasks();
    }

    function addSubtask(taskItem) {
        const subtaskText = prompt('Enter subtask:');
        if (subtaskText) {
            const subtaskItem = document.createElement('li');
            subtaskItem.className = 'subtask-item';
            subtaskItem.innerHTML = `
                <span>${subtaskText}</span>
                <div>
                    <button class="complete-subtask-btn">&#x2713;</button>
                    <button class="delete-subtask-btn">&#x2715;</button>
                </div>
            `;
            taskItem.querySelector('.subtask-list').appendChild(subtaskItem);
            updateProgress(taskItem);
            saveTasks();
        }
    }

    function updateProgress(taskItem) {
        const subtasks = taskItem.querySelectorAll('.subtask-item');
        const completedSubtasks = taskItem.querySelectorAll('.subtask-item.completed');
        const progress = subtasks.length ? (completedSubtasks.length / subtasks.length) * 100 : 0;
        taskItem.querySelector('.progress-bar').style.width = `${progress}%`;
    }

    function clearAllTasks() {
        taskList.innerHTML = '';
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            const subtasks = [];
            taskItem.querySelectorAll('.subtask-item').forEach(subtaskItem => {
                subtasks.push({
                    text: subtaskItem.querySelector('span').innerText,
                    completed: subtaskItem.classList.contains('completed')
                });
            });
            tasks.push({
                text: taskItem.querySelector('span').innerText,
                completed: taskItem.classList.contains('completed'),
                subtasks: subtasks
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text);
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            task.subtasks.forEach(subtask => {
                const subtaskItem = document.createElement('li');
                subtaskItem.className = 'subtask-item';
                if (subtask.completed) {
                    subtaskItem.classList.add('completed');
                }
                subtaskItem.innerHTML = `
                    <span>${subtask.text}</span>
                    <div>
                        <button class="complete-subtask-btn">&#x2713;</button>
                        <button class="delete-subtask-btn">&#x2715;</button>
                    </div>
                `;
                taskItem.querySelector('.subtask-list').appendChild(subtaskItem);
            });
            updateProgress(taskItem);
            taskList.appendChild(taskItem);
        });
    }
});

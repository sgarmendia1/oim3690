document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterSelect = document.getElementById('filterSelect');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    filterSelect.addEventListener('change', renderTasks);

    renderTasks();

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const task = { id: Date.now(), text: taskText, completed: false };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    function renderTasks() {
        const filter = filterSelect.value;
        taskList.innerHTML = '';
        tasks.filter(task => {
            if (filter === 'pending') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        }).forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleComplete(task.id));

            const span = document.createElement('span');
            span.textContent = task.text;
            span.addEventListener('dblclick', () => editTask(task.id, span));

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editTask(task.id, span));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    function toggleComplete(id) {
        const task = tasks.find(t => t.id === id);
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }

    function editTask(id, span) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        span.replaceWith(input);
        input.focus();
        input.addEventListener('blur', () => saveEdit(id, input, span));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveEdit(id, input, span);
        });
    }

    function saveEdit(id, input, span) {
        const task = tasks.find(t => t.id === id);
        task.text = input.value.trim();
        saveTasks();
        input.replaceWith(span);
        span.textContent = task.text;
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
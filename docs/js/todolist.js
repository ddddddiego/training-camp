export function setupTodoList() {
  const DateEl = document.getElementById("todo-list-date");
  const taskInput = document.getElementById("new-task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // FUNCIONES
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function getLocalYYYYMMDD(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 porque los meses son 0-11
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = "";

    const today = getLocalYYYYMMDD();
    const todayTasks = tasks.filter((task) => task.date === today);

    todayTasks.forEach((task, index) => {
      const li = document.createElement("li");
      if (task.completed) {
        li.classList.add("completed");
      }
      li.innerHTML = `
                <input type="checkbox" class="task-checkbox" data-index="${index}" ${
        task.completed ? "checked" : ""
      }>
                <span class="task-text">${task.text}</span>
                <button class="delete-task-btn" data-index="${index}">✖</button>
            `;
      taskList.appendChild(li);
    });
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      alert("Ingrese una tarea");
      return;
    }

    const today = getLocalYYYYMMDD();
    tasks.push({ text: text, completed: false, date: today });

    taskInput.value = "";
    saveTasks();
    renderTasks();
  }

  function toggleTask(index) {
    const today = getLocalYYYYMMDD();
    const todayTasks = tasks.filter((tasks) => tasks.text === today);
    if (todayTasks[index]) {
      const taskToToggle = task.find(
        (tasks) => tasks.text === todayTasks[index].text && tasks.date === today
      );
      if (taskToToggle) {
        taskToToggle.completed = !taskToToggle.completed;
        saveTask();
        renderTasks();
      }
    }
  }

  function deleteTask(index) {
    const today = getLocalYYYYMMDD();
    const todayTasks = tasks.filter((tasks) => tasks.date === today);

    if (todayTasks[index]) {
      const taskToDelete = tasks.findIndex(
        (tasks) => tasks.text === todayTasks[index].text && tasks.date === today
      );
      if (taskToDelete > -1) {
        tasks.splice(taskToDelete, 1);
        saveTasks();
        renderTasks();
      }
    }
  }

  if (addTaskBtn) {
    DateEl.textContent = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });

    addTaskBtn.addEventListener("click", addTask);
    taskList.addEventListener("click", function (event) {
      const target = event.target;
      if (target.classList.contains("task-checkbox")) {
        toggleTask(target.dataset.index);
      }
      if (target.classList.contains("delete-task-btn")) {
        deleteTask(target.dataset.index);
      }
    });

    renderTasks();
    console.log("Modulo de todolist list.");
  }
}

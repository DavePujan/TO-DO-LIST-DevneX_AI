// script.js
document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const newTaskPage = document.getElementById("newTaskPage");
  const datePickerBtn = document.getElementById("datePickerBtn");
  const taskTemplateBtn = document.getElementById("taskTemplateBtn");
  const datePicker = document.getElementById("datePicker");
  const taskTemplates = document.getElementById("taskTemplates");
  const taskInput = document.getElementById("taskInput");
  const submitTaskBtn = document.getElementById("submitTaskBtn");
  const taskList = document.getElementById("taskList");
  const selectedDate = document.getElementById("selectedDate");
  const historyBtn = document.getElementById("historyBtn");
  const backBtn = document.getElementById("backBtn");
  const historyPage = document.getElementById("historyPage");
  const mainPage = document.getElementById("mainPage");
  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const noTaskMessage = document.getElementById("noTaskMessage");

  const taskTemplatesArray = [
    "Drink water, keep healthy",
    "Go exercising",
    "Keep reading",
    "Go to bed early",
    "Be grateful for what you have",
    "Take a break",
    "Keep in touch with family",
    "Take pill reminder",
    "Practice smiling and be happy",
    "Go shopping",
  ];

  let tasks = [];
  let history = [];

  const updateNoTaskMessage = () => {
    if (tasks.length === 0) {
      noTaskMessage.style.display = "block";
    } else {
      noTaskMessage.style.display = "none";
    }
  };

  const updateTaskList = () => {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task");
      taskElement.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" id="task-${index}" ${
        task.completed ? "checked" : ""
      }>
                    <label for="task-${index}">${task.text}</label>
                </div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
      taskList.appendChild(taskElement);
    });
    if (tasks.length === 0) {
      taskList.innerHTML = '<p id="noTaskMessage">No Task Added</p>';
    }
  };

  const updateHistoryList = () => {
    historyList.innerHTML = "";
    history.forEach((task, index) => {
      const historyElement = document.createElement("div");
      historyElement.classList.add("task");
      historyElement.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" id="history-task-${index}" ${
        task.completed ? "checked" : ""
      } disabled>
                    <label for="history-task-${index}">${task.text}</label>
                </div>
            `;
      historyList.appendChild(historyElement);
    });
  };

  const clearHistory = () => {
    history = [];
    localStorage.setItem("history", JSON.stringify(history));
    updateHistoryList();
  };

  addTaskBtn.addEventListener("click", () => {
    newTaskPage.style.display = "flex";
  });

  datePickerBtn.addEventListener("click", () => {
    datePicker.style.display = "block";
    flatpickr("#datePicker", {
      onChange: (selectedDates, dateStr) => {
        selectedDate.innerHTML = `Selected Date: ${dateStr}`;
        datePicker.style.display = "none";
      },
    });
  });

  taskTemplateBtn.addEventListener("click", () => {
    taskTemplates.innerHTML = taskTemplatesArray
      .map(
        (task) =>
          `<div class="template-item">
                <button>${task}</button>
            </div>`
      )
      .join("");
    taskTemplates.style.display = "block";
    taskTemplates.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        taskInput.value = button.innerText;
        taskTemplates.style.display = "none";
      });
    });
  });

  submitTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      const task = {
        text: taskText,
        completed: false,
      };
      tasks.push(task);
      updateTaskList();
      updateNoTaskMessage();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      newTaskPage.style.display = "none";
      taskInput.value = "";
      selectedDate.innerHTML = "";
    }
  });

  taskList.addEventListener("change", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
      const index = e.target.id.split("-")[1];
      tasks[index].completed = e.target.checked;
      if (e.target.checked) {
        e.target.parentNode.parentNode.style.backgroundColor = "#007bff";
        e.target.nextElementSibling.style.textDecoration = "line-through";
      } else {
        e.target.parentNode.parentNode.style.backgroundColor = "#e0f7fa";
        e.target.nextElementSibling.style.textDecoration = "none";
      }
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });

  taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const index = e.target.dataset.index;
      history.push(tasks[index]);
      tasks.splice(index, 1);
      updateTaskList();
      updateNoTaskMessage();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("history", JSON.stringify(history));
    }
  });

  historyBtn.addEventListener("click", () => {
    mainPage.style.display = "none";
    historyPage.style.display = "block";
    updateHistoryList();
  });

  backBtn.addEventListener("click", () => {
    historyPage.style.display = "none";
    mainPage.style.display = "block";
  });

  clearHistoryBtn.addEventListener("click", () => {
    clearHistory();
  });

  // Initial load
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  history = JSON.parse(localStorage.getItem("history")) || [];
  updateTaskList();
  updateNoTaskMessage();
});

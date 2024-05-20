document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    // Load tasks from local storage
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
        savedTasks.forEach(taskText => {
            addTaskToList(taskText);
        });
    }

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && taskInput.value.trim() !== "") {
            const taskText = taskInput.value.trim();
            addTaskToList(taskText);
            saveTasksToLocalStorage();
            taskInput.value = "";
        }
    });

    taskList.addEventListener("click", function(event) {
        if (event.target.tagName === "LI") {
            const taskItem = event.target;
            taskItem.classList.toggle("done");
            if (taskItem.classList.contains("done")) {
                playSoundEffect();
            }
            saveTasksToLocalStorage();
        }
    });

    taskList.addEventListener("contextmenu", function(event) {
        event.preventDefault();
        if (event.target.tagName === "LI") {
            event.target.remove();
            saveTasksToLocalStorage();
        }
    });

    function addTaskToList(taskText) {
        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;
        taskList.appendChild(taskItem);
    }

    function playSoundEffect() {
        const audio = new Audio("task-complete.mp3");
        audio.currentTime = 0.2; // Start playback from 200 milliseconds
        audio.play();
    }

    function saveTasksToLocalStorage() {
        const tasks = Array.from(taskList.getElementsByTagName("li")).map(li => li.textContent);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    // Load tasks from local storage
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        addTaskToList(task.text, task.done);
    });

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && taskInput.value.trim() !== "") {
            const taskText = taskInput.value.trim();
            addTaskToList(taskText, false);
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
                setTimeout(() => {
                    taskItem.remove();
                    saveTasksToLocalStorage();
                }, 60000); // 60 seconds
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

    function addTaskToList(taskText, isDone) {
        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;
        if (isDone) {
            taskItem.classList.add("done");
            setTimeout(() => {
                taskItem.remove();
                saveTasksToLocalStorage();
            }, 60000); // 60 seconds
        }
        taskList.appendChild(taskItem);
    }

    function playSoundEffect() {
        const audio = new Audio("task-complete.mp3");
        audio.currentTime = 0.2; // Start playback from 200 milliseconds
        audio.play();
    }

    function saveTasksToLocalStorage() {
        const tasks = Array.from(taskList.getElementsByTagName("li")).map(li => ({
            text: li.textContent,
            done: li.classList.contains("done")
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});

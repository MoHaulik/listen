import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, set, update, remove, on } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc7bWptNXBTrPZleGwat5z537dYfKe4uY",
  authDomain: "todolist-3abdb.firebaseapp.com",
  projectId: "todolist-3abdb",
  storageBucket: "todolist-3abdb.appspot.com",
  messagingSenderId: "221991386067",
  appId: "1:221991386067:web:e0cd5775ddd511b4decd26",
  measurementId: "G-8CN1L9J0PZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    // Load tasks from Firebase
    on(ref(database, 'tasks'), 'value', (snapshot) => {
        const tasks = snapshot.val();
        taskList.innerHTML = ''; // Clear the current list
        for (let id in tasks) {
            addTaskToList(tasks[id].text, tasks[id].done, id);
        }
    });

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && taskInput.value.trim() !== "") {
            const taskText = taskInput.value.trim();
            const newTaskRef = push(ref(database, 'tasks'));
            set(newTaskRef, {
                text: taskText,
                done: false
            });
            taskInput.value = "";
        }
    });

    taskList.addEventListener("click", function(event) {
        if (event.target.tagName === "LI") {
            const taskItem = event.target;
            const taskId = taskItem.getAttribute('data-id');
            const isDone = !taskItem.classList.contains("done");
            taskItem.classList.toggle("done");
            if (isDone) {
                playSoundEffect();
                setTimeout(() => {
                    remove(ref(database, 'tasks/' + taskId));
                }, 60000); // 60 seconds
            }
            update(ref(database, 'tasks/' + taskId), { done: isDone });
        }
    });

    taskList.addEventListener("contextmenu", function(event) {
        event.preventDefault();
        if (event.target.tagName === "LI") {
            const taskId = event.target.getAttribute('data-id');
            remove(ref(database, 'tasks/' + taskId));
        }
    });

    function addTaskToList(taskText, isDone, id) {
        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;
        taskItem.setAttribute('data-id', id);
        if (isDone) {
            taskItem.classList.add("done");
            setTimeout(() => {
                remove(ref(database, 'tasks/' + id));
            }, 60000); // 60 seconds
        }
        taskList.appendChild(taskItem);
    }

    function playSoundEffect() {
        const audio = new Audio("task-complete.mp3");
        audio.currentTime = 0.2; // Start playback from 200 milliseconds
        audio.play();
    }
});

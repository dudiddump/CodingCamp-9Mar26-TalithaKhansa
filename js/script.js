// CLOCK & GREETING
function updateClock() {
    const now = new Date();

    document.getElementById("clock").innerText =
        now.toLocaleTimeString("en-GB");
    document.getElementById("date").innerText =
        now.toDateString();

    let hour = now.getHours();
    let greeting = "Good Night";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else if (hour < 22) greeting = "Good Evening";
    let name = localStorage.getItem("dashboardName") || "Friend";
    document.getElementById("greeting").innerText =
        `${greeting}, ${name}`;
}

setInterval(updateClock, 1000);
updateClock();


function saveName() {
    let name = document.getElementById("nameInput").value.trim();
    if (name) {
        localStorage.setItem("dashboardName", name);
        document.getElementById("nameInput").value = "";
        updateClock();
    }
}


// FOCUS TIMER
let time = 1500;
let interval = null;

const pomodoroSelect = document.getElementById("pomodoroSelect");
const customInput = document.getElementById("customInput");
const timerDisplay = document.getElementById("timer");


function updateTimerDisplay() {
    let m = Math.floor(time / 60);
    let s = time % 60;
    timerDisplay.innerText =
        `${m}:${s < 10 ? "0" + s : s}`;
}

pomodoroSelect.addEventListener("change", (e) => {
    if (e.target.value === "custom") {
        customInput.style.display = "inline-block";
    } else {
        customInput.style.display = "none";
        time = parseInt(e.target.value);
        updateTimerDisplay();
    }
});

customInput.addEventListener("input", (e) => {
    let minutes = parseInt(e.target.value);
    if (minutes > 0) {
        time = minutes * 60;
        updateTimerDisplay();
    }
});

function startTimer() {
    if (interval) return;
    interval = setInterval(() => {
        if (time > 0) {
            time--;
            updateTimerDisplay();
        } else {
            clearInterval(interval);
            interval = null;
            alert("Focus session finished! Time for a break.");
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    stopTimer();
    if (pomodoroSelect.value === "custom" && customInput.value > 0) {
        time = parseInt(customInput.value) * 60;
    } else {
        time = parseInt(pomodoroSelect.value) || 1500;
    }
    updateTimerDisplay();
}

updateTimerDisplay();

// TASKS
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

let tasks = JSON.parse(localStorage.getItem("db_tasks")) || [];

function saveTasks() {
    localStorage.setItem("db_tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    let doneCount = tasks.filter(t => t.done).length;
    if(taskCounter){
        taskCounter.innerText =
            `${doneCount} / ${tasks.length} tasks done`;
    }

    tasks.forEach((task, i) => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.innerHTML = `
            <label>
                <input type="checkbox"
                ${task.done ? "checked" : ""}
                onchange="toggleTask(${i})">
                <span class="${task.done ? "done" : ""}">
                    ${task.text}
                </span>
            </label>

            <div>
                <button onclick="editTask(${i})">Edit</button>
                <button class="btn-del"
                onclick="deleteTask(${i})">✕</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    saveTasks();
}

function addTask() {
    let text = taskInput.value.trim();
    if (!text) return;
    if (tasks.some(t =>
        t.text.toLowerCase() === text.toLowerCase()
    )) {
        alert("Task already exists");
        return;
    }
    tasks.push({
        text: text,
        done: false
    });

    taskInput.value = "";
    renderTasks();
}

function toggleTask(i) {
    tasks[i].done = !tasks[i].done;
    renderTasks();
}

function deleteTask(i) {
    tasks.splice(i, 1);
    renderTasks();
}

function editTask(i) {
    const newText =
        prompt("Edit task:", tasks[i].text);
    if (newText !== null &&
        newText.trim() !== "") {
        tasks[i].text = newText.trim();
        renderTasks();
    }
}

function sortTasks() {
    tasks.sort((a, b) =>
        a.text.localeCompare(b.text)
    );
    renderTasks();
}

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

renderTasks();

// QUICK LINKS
let links = JSON.parse(localStorage.getItem("links")) || [];
const linksContainer =
    document.getElementById("linksContainer");

function saveLinks() {
    localStorage.setItem("links",
        JSON.stringify(links));
}

function renderLinks() {
    linksContainer.innerHTML = "";
    links.forEach((link, i) => {
        const btn = document.createElement("button");
        btn.innerText = link.name;
        btn.onclick = () =>
            window.open(link.url, "_blank");
        btn.oncontextmenu = (e) => {
            e.preventDefault();
            links.splice(i, 1);
            saveLinks();
            renderLinks();
        };
        linksContainer.appendChild(btn);
    });
}

function addLink() {
    const name =
        document.getElementById("linkName").value.trim();
    const url =
        document.getElementById("linkURL").value.trim();
    if (name && url) {
        links.push({
            name,
            url: url.startsWith("http")
                ? url
                : "https://" + url
        });

        saveLinks();
        renderLinks();

        document.getElementById("linkName").value = "";
        document.getElementById("linkURL").value = "";
    }
}

renderLinks();

// THEME TOGGLE
function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark =
        document.body.classList.contains("dark");
    document.getElementById("themeBtn").innerText =
        isDark ? "☀️" : "🌙";
    localStorage.setItem("theme",
        isDark ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
    toggleTheme();
}
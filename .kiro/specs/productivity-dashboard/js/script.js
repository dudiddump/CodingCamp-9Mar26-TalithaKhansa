function updateClock() {
    const now = new Date();

    document.getElementById("clock").innerText =
    now.toLocaleString();

    const hour = now.getHours();
    let greeting = "Hello";
    if(hour < 12){
        greeting = "Good Morning";
    }
    else if(hour < 18) {
        greeting = "Good Afternoon";
    }
    else{
        greeting = "Good Evening";
    }
    document.getElementById("greeting").innerText = greeting;
}

setInterval(updateClock,1000);

updateClock();

let time = 1500;
let timerInterval;

function updateTimer() {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;

    document.getElementById("timer").innerText =
    minutes + ":" + (seconds < 10 ? "0"+seconds : seconds);
}

function startTimer() {
    timerInterval = setInterval(()=>{
        time--;
        updateTimer();
    },1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    time = 1500;
    updateTimer();
}

updateTimer();

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    
    tasks.forEach((task,index)=>{
        const li = document.createElement("li");
        li.innerHTML = `
        ${task}
        <button onclick="deleteTask(${index})">Delete</button>
        `;

        list.appendChild(li);

    });
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value;
    tasks.push(text);
    input.value="";
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index,1);
    renderTasks();
}

renderTasks();

let links = JSON.parse(localStorage.getItem("links")) || [];

function renderLinks() {
    const container = document.getElementById("linksContainer");
    container.innerHTML = "";
    
    links.forEach(link=>{
        const btn = document.createElement("button");
        
        btn.innerText = link.name;
        btn.onclick = ()=>{
            window.open(link.url);
        };
        container.appendChild(btn);
    });
    localStorage.setItem("links",JSON.stringify(links));
}

function addLink() {
    const name = document.getElementById("linkName").value;
    const url = document.getElementById("linkURL").value;
    links.push({name,url});
    renderLinks();
}

renderLinks();
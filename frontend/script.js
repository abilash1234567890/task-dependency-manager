const API = "http://127.0.0.1:8000/api";

/* ================= LOAD TASKS ================= */
async function loadTasks() {
    const res = await fetch(`${API}/tasks/`);
    const tasks = await res.json();

    const list = document.getElementById("taskList");
    const taskSelect = document.getElementById("task");
    const dependsSelect = document.getElementById("dependsOn");

    list.innerHTML = "";
    taskSelect.innerHTML = "";
    dependsSelect.innerHTML = "";

    tasks.forEach(t => {
        const li = document.createElement("li");

        li.innerHTML = `
            <b>${t.title}</b>
            <select onchange="updateStatus(${t.id}, this.value)">
                <option value="pending" ${t.status==="pending"?"selected":""}>Pending</option>
                <option value="in_progress" ${t.status==="in_progress"?"selected":""}>In Progress</option>
                <option value="completed" ${t.status==="completed"?"selected":""}>Completed</option>
                <option value="blocked" ${t.status==="blocked"?"selected":""}>Blocked</option>
            </select>
            <span class="${t.status}">(${t.status})</span>
        `;

        list.appendChild(li);

        taskSelect.add(new Option(t.title, t.id));
        dependsSelect.add(new Option(t.title, t.id));
    });

    drawGraph(tasks);
}

/* ================= UPDATE STATUS ================= */
async function updateStatus(id, status) {
    await fetch(`${API}/tasks/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });

    loadTasks();
}

/* ================= ADD TASK ================= */
async function addTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (!title) {
        alert("Title is required");
        return;
    }

    await fetch(`${API}/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    });

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    loadTasks();
}

/* ================= ADD DEPENDENCY ================= */
async function addDependency() {
    const task = document.getElementById("task").value;
    const depends_on = document.getElementById("dependsOn").value;

    if (task === depends_on) {
        alert("A task cannot depend on itself");
        return;
    }

    const res = await fetch(`${API}/dependencies/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, depends_on })
    });

    if (!res.ok) {
        let message = "Circular dependency detected!";

        try {
            const data = await res.json();
            message =
                data.detail ||
                (data.non_field_errors && data.non_field_errors[0]) ||
                message;
        } catch (e) {
            // fallback if response is not JSON
        }

        alert(message);
        return; // ❗ IMPORTANT: stop here
    }

    loadTasks();
}


/* ================= DRAW GRAPH ================= */
function drawArrow(ctx, from, to) {
    const headLength = 10;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
        to.x - headLength * Math.cos(angle - Math.PI / 6),
        to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        to.x - headLength * Math.cos(angle + Math.PI / 6),
        to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
}

function drawGraph(tasks) {
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = {};

    // positions
    tasks.forEach((t, i) => {
        positions[t.id] = {
            x: 100 + i * 140,
            y: 220
        };
    });

    // draw arrows (dependencies)
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";

    tasks.forEach(t => {
        if (t.dependencies) {
            t.dependencies.forEach(dep => {
                drawArrow(
                    ctx,
                    positions[t.id],
                    positions[dep.depends_on]
                );
            });
        }
    });

    // draw nodes
    tasks.forEach(t => {
        const { x, y } = positions[t.id];

        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);

        if (t.status === "completed") ctx.fillStyle = "green";
        else if (t.status === "in_progress") ctx.fillStyle = "blue";
        else if (t.status === "blocked") ctx.fillStyle = "red";
        else ctx.fillStyle = "gray";

        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(t.title, x, y + 5);
    });
}


/* ================= INITIAL LOAD ================= */
loadTasks();

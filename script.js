// Job structure: { id, name, elapsed, running, lastStart }
let jobs = [];

function saveJobs() {
    localStorage.setItem('jobs', JSON.stringify(jobs));
}

function loadJobs() {
    const data = localStorage.getItem('jobs');
    if (data) {
        jobs = JSON.parse(data);
    } else {
        jobs = [];
    }
}

function renderJobs() {
    const jobsDiv = document.getElementById('jobs');
    jobsDiv.innerHTML = '';
    jobs.forEach((job, idx) => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'job';
        const title = document.createElement('p');
        title.className = 'job-title';
        title.innerText = job.name;
        const timer = document.createElement('span');
        timer.className = 'job-timer';
        timer.id = `timer-${job.id}`;
        timer.innerText = formatTime(getElapsed(job));
        const startBtn = document.createElement('button');
        startBtn.innerText = job.running ? 'Stop' : 'Start';
        startBtn.className = 'open-button';
        startBtn.onclick = () => toggleTimer(idx);
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.className = 'delete-button';
        deleteBtn.onclick = () => deleteJob(idx);
        jobDiv.appendChild(title);
        jobDiv.appendChild(timer);
        jobDiv.appendChild(startBtn);
        jobDiv.appendChild(deleteBtn);
        jobsDiv.appendChild(jobDiv);
    });
}

function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getElapsed(job) {
    if (job.running) {
        return job.elapsed + (Date.now() - job.lastStart);
    }
    return job.elapsed;
}

function updateTimers() {
    jobs.forEach((job) => {
        const timer = document.getElementById(`timer-${job.id}`);
        if (timer) {
            timer.innerText = formatTime(getElapsed(job));
        }
    });
}

setInterval(updateTimers, 1000);

function openJobMenu() {
    document.getElementById("jobs").style.display = "none";
    document.getElementById("bottom-bar").style.display = "none";
    document.getElementById("jobMenu").style.display = "block";
}

function createJob() {
    var jobName = document.getElementById("jobName").value;
    if (jobName.trim() === "") {
        alert("Job name cannot be empty.");
        return;
    }
    const newJob = {
        id: Date.now(),
        name: jobName,
        elapsed: 0,
        running: false,
        lastStart: null
    };
    jobs.push(newJob);
    saveJobs();
    renderJobs();
    document.getElementById("jobMenu").style.display = "none";
    document.getElementById("bottom-bar").style.display = "block";
    document.getElementById("jobs").style.display = "block";
    document.getElementById("jobName").value = '';
}

function toggleTimer(idx) {
    const job = jobs[idx];
    if (job.running) {
        // Stop timer
        job.elapsed += Date.now() - job.lastStart;
        job.running = false;
        job.lastStart = null;
    } else {
        // Start timer
        job.lastStart = Date.now();
        job.running = true;
    }
    saveJobs();
    renderJobs();
}

function deleteJob(idx) {
    if (confirm('Are you sure you want to delete this job?')) {
        jobs.splice(idx, 1);
        saveJobs();
        renderJobs();
    }
}

window.onload = function() {
    loadJobs();
    renderJobs();
    document.getElementById("jobMenu").style.display = "none";
    document.getElementById("bottom-bar").style.display = "block";
    document.getElementById("jobs").style.display = "block";
};
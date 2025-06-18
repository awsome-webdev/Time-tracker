// Job structure: { id, name, intervals: [{start, end}], running }
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
        // Use <details> for intervals dropdown
        const details = document.createElement('details');
        details.className = 'intervals-details';
        const summary = document.createElement('summary');
        summary.innerText = 'Show Times';
        summary.className = 'intervals-summary';
        details.appendChild(summary);
        // Intervals list
        const intervalsList = document.createElement('div');
        intervalsList.className = 'intervals-list';
        if (job.intervals && job.intervals.length > 0) {
            job.intervals.forEach(interval => {
                if (!interval.start) return;
                const entry = document.createElement('div');
                entry.className = 'interval-entry';
                const startStr = formatDateTime(interval.start);
                const endStr = interval.end ? formatDateTime(interval.end) : '...';
                entry.innerText = `${startStr} - ${endStr}`;
                intervalsList.appendChild(entry);
            });
        } else {
            const entry = document.createElement('div');
            entry.innerText = 'No times recorded.';
            intervalsList.appendChild(entry);
        }
        details.appendChild(intervalsList);
        // Expand job element visually when details is open
        details.addEventListener('toggle', function() {
            if (details.open) {
                jobDiv.classList.add('job-expanded');
            } else {
                jobDiv.classList.remove('job-expanded');
            }
        });
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
        jobDiv.appendChild(details);
        jobDiv.appendChild(startBtn);
        jobDiv.appendChild(deleteBtn);
        jobsDiv.appendChild(jobDiv);
    });
}

function formatDateTime(ts) {
    const d = new Date(ts);
    // Format: YYYY-MM-DD HH:mm:ss
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
}

function getElapsed(job) {
    let elapsed = 0;
    if (job.intervals && Array.isArray(job.intervals)) {
        job.intervals.forEach(interval => {
            if (interval.start && interval.end) {
                elapsed += interval.end - interval.start;
            } else if (interval.start && !interval.end && job.running) {
                elapsed += Date.now() - interval.start;
            }
        });
    }
    return elapsed;
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
        intervals: [],
        running: false
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
    if (!job.intervals) job.intervals = [];
    if (job.running) {
        // Stop timer: set end time for last interval
        const lastInterval = job.intervals[job.intervals.length - 1];
        if (lastInterval && !lastInterval.end) {
            lastInterval.end = Date.now();
        }
        job.running = false;
    } else {
        // Start timer: add new interval
        job.intervals.push({ start: Date.now(), end: null });
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
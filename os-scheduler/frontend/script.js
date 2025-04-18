document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculate").addEventListener("click", calculateScheduling);
    document.getElementById("algorithm").addEventListener("change", toggleQuantumField);
});

function toggleQuantumField() {
    let timeQuantumField = document.getElementById("timeQuantum");
    let label = document.getElementById("quantumLabel");

    if (document.getElementById("algorithm").value === "RR") {
        timeQuantumField.style.display = "inline-block";
        label.style.display = "inline-block";
    } else {
        timeQuantumField.style.display = "none";
        label.style.display = "none";
    }
}

// Function to Add Process Rows
function addProcess() {
    const table = document.getElementById("processBody");

    let row = document.createElement("tr");
    row.innerHTML = `
        <td>P${table.children.length + 1}</td>
        <td><input type="number" class="arrival" min="0" required></td>
        <td><input type="number" class="burst" min="1" required></td>
        <td><input type="number" class="priority" min="0" required></td>
        <td><button onclick="removeProcess(this)">❌</button></td>
    `;
    table.appendChild(row);
}

function removeProcess(button) {
    button.parentElement.parentElement.remove();
}

// Scheduling Algorithm Function
function calculateScheduling() {
    let processData = [];
    document.querySelectorAll("#processBody tr").forEach((row, index) => {
        let arrival = parseInt(row.querySelector(".arrival").value);
        let burst = parseInt(row.querySelector(".burst").value);
        let priority = parseInt(row.querySelector(".priority").value);

        if (isNaN(arrival) || isNaN(burst) || burst <= 0) {
            alert("❌ Invalid input! Check arrival and burst times.");
            return;
        }

        processData.push({ id: index + 1, arrival_time: arrival, burst_time: burst, priority: priority });
    });

    const algorithm = document.getElementById("algorithm").value;
    const timeQuantum = algorithm === "RR" ? parseInt(document.getElementById("timeQuantum").value) : null;

    let result = calculateAlgorithm(processData, algorithm, timeQuantum);
    displayGanttChart(result.ganttChart);
    document.getElementById("result").innerHTML = `
        <b>Avg Waiting Time:</b> ${result.avgWaitingTime.toFixed(2)} <br>
        <b>Avg Turnaround Time:</b> ${result.avgTurnaroundTime.toFixed(2)}
    `;
}

// Placeholder Function for Scheduling Logic
function calculateAlgorithm(processes, algorithm, timeQuantum) {
    let ganttChart = [];
    let totalWT = 0, totalTAT = 0;

    processes.sort((a, b) => a.arrival_time - b.arrival_time); // Sort by Arrival Time

    if (algorithm === "FCFS") {
        let time = 0;
        processes.forEach(p => {
            let start = time;
            let end = start + p.burst_time;
            time = end;

            ganttChart.push({ process: `P${p.id}`, start, end });

            totalWT += start - p.arrival_time;
            totalTAT += end - p.arrival_time;
        });
    }

    return {
        ganttChart,
        avgWaitingTime: totalWT / processes.length,
        avgTurnaroundTime: totalTAT / processes.length
    };
}

// Function to Display Gantt Chart
function displayGanttChart(ganttData) {
    const ganttChartContainer = document.getElementById("ganttChart");
    ganttChartContainer.innerHTML = "";

    ganttData.forEach((item) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.width = `${(item.end - item.start) * 20}px`;
        bar.style.backgroundColor = getRandomColor();
        bar.textContent = `${item.process} (${item.start} - ${item.end})`;

        ganttChartContainer.appendChild(bar);
    });
}

// Generate Random Colors for Gantt Bars
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
}

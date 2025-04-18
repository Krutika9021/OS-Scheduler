const express = require('express');
const app = express();
const port = 5000;

app.use(express.json()); // To parse JSON requests

app.post('/calculate', (req, res) => {
    const { processes, algorithm, timeQuantum } = req.body;

    if (!processes || processes.length === 0) {
        return res.status(400).json({ success: false, message: "No processes provided." });
    }

    let ganttChart = [];
    let avgWaitingTime = 0;
    let avgTurnaroundTime = 0;

    // FCFS Algorithm Logic (Example)
    if (algorithm === 'FCFS') {
        let time = 0;
        processes.forEach(process => {
            const waitingTime = time - process.arrival_time;
            const turnaroundTime = waitingTime + process.burst_time;

            avgWaitingTime += waitingTime;
            avgTurnaroundTime += turnaroundTime;

            ganttChart.push({
                process: `P${process.id}`,
                start: time,
                end: time + process.burst_time
            });

            time += process.burst_time; // Update time after process completion
        });

        // Calculate averages
        avgWaitingTime /= processes.length;
        avgTurnaroundTime /= processes.length;
    }

    // Send back the result
    res.json({
        success: true,
        ganttChart,
        avgWaitingTime,
        avgTurnaroundTime
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

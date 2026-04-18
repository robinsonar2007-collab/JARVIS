const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');

// 1. Diagnostics Logic (System stats check)
function getSystemReport() {
    const batteryLevel = "100%"; 
    const cpuLoad = (os.loadavg()[0] * 10).toFixed(1);
    const timeStr = new Date().toLocaleTimeString();
    const hours = new Date().getHours();
    
    let greeting = "Good evening";
    if (hours < 12) greeting = "Good morning";
    else if (hours < 17) greeting = "Good afternoon";

    return `${greeting} Sir. The time is ${timeStr}. System report: Battery is at ${batteryLevel}. CPU load is ${cpuLoad} percent. All systems are functional. I am online.`;
}

// 2. Start Function (HUD open pannum, Memory-la ezhudhum)
function startJARVIS() {
    console.log("----------------------------------------");
    console.log("   JARVIS MARK VII - NEURAL LINK       ");
    console.log("----------------------------------------");

    // HUD (Bridge screen) ah automatic-ah open panna
    exec('start bridge.html', (err) => {
        if (err) {
            console.error(">> HUD Launch Error:", err);
        } else {
            console.log(">> HUD Interface: LAUNCHED");
        }
    });

    // JARVIS unga munnadi folder-ah open panni kaatta (Optional/Ready)
    // exec('start .'); // Idhu unga project folder-ah open pannum

    setTimeout(() => {
        const report = getSystemReport();
        console.log("JARVIS: " + report);
        
        // Memory.txt-la record panna
        fs.appendFileSync('memory.txt', `[${new Date().toLocaleString()}] ${report}\n`);
    }, 2000);
}

// 3. Execution
startJARVIS();

console.log(">> Status: System Online.");
console.log(">> Listening for commands, Sir...");
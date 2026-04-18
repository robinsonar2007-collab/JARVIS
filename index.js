const { exec } = require('child_process');
const say = require('say');
const express = require('express');
const path = require('path');
const si = require('systeminformation');
const robot = require('robotjs'); 
const NodeWebcam = require('node-webcam'); 
const app = express();

let isSpeaking = false;
let briefingDone = false;

// Voice function - Blink matrum Voice sync panna reset logic add pannirukkaen
function speak(text, force = false) {
    if (isSpeaking && !force) return; 
    
    if (force) {
        say.stop();
        isSpeaking = false; 
    }

    isSpeaking = true;
    console.log(`JARVIS: ${text}`);
    
    say.speak(text, null, 1.0, (err) => {
        // Pesi mudichu oru chinna gap-ku apparam dhaan circle blink nippum
        setTimeout(() => {
            isSpeaking = false; 
        }, 800); 
    });
}

// --- EXISTING: DAILY BRIEFING (NO CHANGES) ---
async function dailyBriefing() {
    if (briefingDone) return; 
    try {
        const date = new Date();
        const hours = date.getHours();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        let greeting = "Good evening"; 
        const battery = await si.battery();
        const cpu = await si.currentLoad();
        
        const briefing = `${greeting} Sir. Today is ${day}. The time is ${timeStr}. ` +
                         `System report: Battery is at ${battery.percent} percent. ` +
                         `CPU load is ${cpu.currentLoad.toFixed(1)} percent. ` +
                         `All systems are functional. I am online.`;
        
        speak(briefing);
        briefingDone = true; 
    } catch (e) { speak("System ready, Sir. I am online."); }
}

// --- EXISTING: WEATHER & BATTERY (NO CHANGES) ---
async function getWeatherUpdate() {
    return "Sir, the current temperature is 32 degrees Celsius with clear skies.";
}

// --- ROUTING & COMMANDS (Only Fixes Added) ---
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'bridge.html')));

app.get('/status', (req, res) => {
    res.json({ speaking: isSpeaking });
});

app.get('/wake', (req, res) => {
    if (isSpeaking) return res.send('Busy');
    speak("Yes, Sir?", true);
    res.send('Awake');
});

app.get('/command', async (req, res) => {
    // Loop-ah thadukka pesum podhu command-ah ignore panna logic add pannirukkaen
    if (isSpeaking) return res.send('Speaking');

    let query = req.query.q.toLowerCase().trim();

    // Direct Drive Access (Added Only)
    if (query.includes('open c drive') || query.includes('local disk c')) {
        speak("Accessing Local Disk C, Sir.", true);
        exec('explorer "C:\\"');
        return res.send('Done');
    }

    // Web Search Logic (Who is Iron Man, etc. - Added Only)
    const knownCommands = ['weather', 'play ', 'who is in front', 'take a picture', 'open ', 'battery'];
    const isKnown = knownCommands.some(cmd => query.includes(cmd));

    if (!isKnown && query.length > 2) {
        speak(`I am searching the web for ${query}, Sir.`, true);
        exec(`start https://www.google.com/search?q=${encodeURIComponent(query)}`);
        return res.send('Searching');
    }

    // Existing Commands (Preserved)
    if (query.startsWith('play ')) {
        let song = query.replace('play ', '').trim();
        speak(`Playing ${song} on YouTube, Sir.`, true);
        exec(`start https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`);
        return res.send('Done');
    }

    res.send('OK');
});

const PORT = 3000;
app.listen(PORT, () => {
    // Speed optimized startup (1 second)
    setTimeout(() => {
        dailyBriefing();
    }, 1000); 

    const flags = `--app="http://localhost:3000" --window-size=280,300 --window-position=1100,50 --autoplay-policy=no-user-gesture-required`;
    exec(`start chrome ${flags}`);
});
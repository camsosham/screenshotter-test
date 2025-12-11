////////////////////////
//CONNECT STREAMER.BOT//
////////////////////////

// Parse URL Parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const sbServerAddress = urlParams.get("address") || "127.0.0.1";
const sbServerPort = urlParams.get("port") || "8080";
const endScene = urlParams.get("scene") || "/";
const overlay = urlParams.get("overlay") || "";

// Create Streamer.bot Client
const client = new StreamerbotClient({
	host: sbServerAddress,
	port: sbServerPort,

	onConnect: (data) => {
		console.log(`Streamer.bot successfully connected to ${sbServerAddress}:${sbServerPort}`)
		console.debug(data);
		SetConnectionStatus(true);
	},

	onDisconnect: () => {
		console.error(`Streamer.bot disconnected from ${sbServerAddress}:${sbServerPort}`)
		SetConnectionStatus(false);
	}
});

// Streamer.bot Connection Status Indicator Function
function SetConnectionStatus(connected) {
	let statusContainer = document.getElementById("statusContainer");
	if (connected) {
		statusContainer.style.background = "#2FB774";
		statusContainer.innerText = "Connected!";
		statusContainer.style.opacity = 1;
		setTimeout(() => {
			statusContainer.style.transition = "all 2s ease";
			statusContainer.style.opacity = 0;
		}, 10);
	}
	else {
		statusContainer.style.background = "#D12025";
		statusContainer.innerText = "Connecting...";
		statusContainer.style.transition = "";
		statusContainer.style.opacity = 1;
    }
}

// Timer Countdown Function
function startTimer() {
    let count = 4;
    let timer;
    const countdownElement = document.getElementById('countdown');
    timer = setInterval(function() {
        count--;
        countdownElement.textContent = count;

        if (count < 1) {
            clearInterval(timer);
            count = ' ';
            countdownElement.textContent = count;
            // Perform the desired action here after the countdown ends
            client.callAction("Overlay", "Show Overlay", { OverlayName: overlay });

        }
    }, 1000); // 1000 milliseconds = 1 second
}
//////////////////////////////////////
// CONNECTS STREAMER.BOT TO WEBPAGE //
//////////////////////////////////////

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
		fetchTitle();
	},

	onDisconnect: () => {
		console.error(`Streamer.bot disconnected from ${sbServerAddress}:${sbServerPort}`)
		SetConnectionStatus(false);
	}
});

///////////////////////////////////////////
// PERFORMS CONNECTION STATUS UI UPDATES //
///////////////////////////////////////////

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

//////////////////////////////////////
// CREATES TIMER COUNTDOWN FUNCITON //
//////////////////////////////////////

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

//////////////////////////////////////////////////////////
// GRABS TWITCH TITLE FROM STREAMER.BOT GLOBAL VARIABLE //
//////////////////////////////////////////////////////////

setInterval(fetchTitle, 3000);
async function fetchTitle() {
	const response = await client.getGlobal("twitchTitle", persisted = true);
	console.log("Fetched Twitch Title:", response.variable.value);
}

/////////////////////////////////////
// SUBSCRIBES TO OBS SCENE CHANGES //
/////////////////////////////////////

client.on('Obs.SceneChanged', ({ event, data }) => {
  const currentScene = data.scene.sceneName;
  console.log('Current Scene:', currentScene);
});


if (currentScene == endScene) {
	startTimer();
	console.log("End scene reached, starting timer.");
}
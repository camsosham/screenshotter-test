//////////////////////////////////////
// CONNECTS STREAMER.BOT TO WEBPAGE //
//////////////////////////////////////

// Parses the URL's Parameters for Streamer.bot connection info and sets defaults if not provided
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const sbServerAddress = urlParams.get("address") || "127.0.0.1";
const sbServerPort = urlParams.get("port") || "8080";
const endScene = urlParams.get("scene") || "End Scene";
//const overlay = urlParams.get("overlay") || ""; // For future use of overlay styles

// Creates Streamer.bot Client
const client = new StreamerbotClient({
	host: sbServerAddress,
	port: sbServerPort,

  // Sets up connection and disconnection event handlers
	onConnect: (data) => {
		console.log(`Streamer.bot successfully connected to ${sbServerAddress}:${sbServerPort}`)
		console.debug(data);
		setConnectionStatus(true);
		fetchTitle();
	},

	onDisconnect: () => {
		console.error(`Streamer.bot disconnected from ${sbServerAddress}:${sbServerPort}`)
		setConnectionStatus(false);
	}
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// ALL HTML VARIABLES IN ALPHABETICAL ORDER ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const countdownElement = document.getElementById('countdown');
const dateContainer = document.getElementById('dateContainer');
const dateContainer2 = document.getElementById('dateContainer2');
const overlay = document.getElementById("overlay");
let statusContainer = document.getElementById("statusContainer");
const titleContainer = document.getElementById('titleContainer');
const titleContainer2 = document.getElementById('titleContainer2');


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// ALL HELPER FUNCTIONS IN ALPHABETICAL ORDER //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////
// OVERLAYS THE SCREEN WITH WHITE TO MIMIC A FLASH //
/////////////////////////////////////////////////////

function clearScreenWhite() {
  // Grabs the overlay element from the html and shows it's values in the console for debugging

  console.log(overlay);

  // Changes the overlay element's styles to make it invisible with a smooth transition
  overlay.style.visibility = "hidden";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 1250ms ease, visibility 0ms ease 1250ms";
  
}

///////////////////////////////
// REMOVES THE WHITE OVERLAY //
///////////////////////////////

function coverScreenWhite() {
  // Show's overlay's values in the console for debugging
	console.log(overlay);

  // Changes the overlay element's styles to make it visible instantly
  overlay.style.visibility = "visible";
  overlay.style.opacity = "1";
  overlay.style.transition = "opacity 0ms ease-in, visibility 0ms ease-in 0ms";
  overlay.style.transitionDelay = "0ms";

  // Sets a timeout to call the clearScreenWhite function after 100 milliseconds
  setTimeout(clearScreenWhite, 100)
}

/////////////////////////////////////
// SUBSCRIBES TO OBS SCENE CHANGES //
/////////////////////////////////////

// Creates a variable to store the current scene name
let currentScene = "";

// Subscribes to the OBS Scene Changed event and updates the current scene variable accordingly
client.on('Obs.SceneChanged', ({ event, data }) => {
  currentScene = data.scene.sceneName;
  console.log('Current Scene:', currentScene);

  // Checks if the current scene matches the specified end scene and starts the timer if it does
  if (currentScene === endScene) {
	console.log("End scene reached, starting timer.");
	startTimer();
  }

});

//////////////////////////////////////////////////////////
// GRABS TWITCH TITLE FROM STREAMER.BOT GLOBAL VARIABLE //
//////////////////////////////////////////////////////////

async function fetchTitle() {

  // Fetches the Twitch title from Streamer.bot's global variables
	const response = await client.getGlobal("twitchTitle", persisted = true);
	console.log("Fetched Twitch Title:", response.variable.value);

  // Updates the title and date containers in the HTML with the fetched title and a static date
  dateContainer.innerText = "12/12/2025";
  dateContainer2.innerText = "12/12/2025";
  titleContainer.innerText = response.variable.value;
  titleContainer2.innerText = response.variable.value

}

// Calls the fetchTitle function every 30 seconds to update the Twitch title
setInterval(fetchTitle, 30000);

///////////////////////////////////////////
// PERFORMS CONNECTION STATUS UI UPDATES //
///////////////////////////////////////////

function setConnectionStatus(connected) {

  // Updates the status container's styles and text based on the connection status
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
    timer = setInterval(function() {
      count--;
      countdownElement.textContent = count;

      if (count < 1) {
        clearInterval(timer);
        count = ' ';
        countdownElement.textContent = count;
            
		    coverScreenWhite();
      }
    }, 1000); // 1000 milliseconds = 1 second
}

// Applies a vintage look to the text elements
function vintageLook() {

}

//////////////////////////////////////
// CONNECTS STREAMER.BOT TO WEBPAGE //
//////////////////////////////////////

// Parses the URL's Parameters for Streamer.bot connection info and sets defaults if not provided
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const sbServerAddress = urlParams.get("address") || "127.0.0.1";
const sbServerPort = urlParams.get("port") || "10767";
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
const overlay = document.getElementById("overlay");
const statusContainer = document.getElementById("statusContainer");
const titleContainer = document.getElementById('titleContainer');

let countFont = countdownElement.style.fontFamily;
let countSize = countdownElement.style.fontSize;
let countColor = countdownElement.style.color;
let countShadow = countdownElement.style.textShadow;
let countFilter = countdownElement.style.filter;

let dateFont = dateContainer.style.fontFamily;
let dateSize = dateContainer.style.fontSize;
let dateColor = dateContainer.style.color;
let dateShadow = dateContainer.style.textShadow;
let dateFilter = dateContainer.style.filter;

let titleFont = titleContainer.style.fontFamily;
let titleSize = titleContainer.style.fontSize;
let titleColor = titleContainer.style.color;
let titleShadow = titleContainer.style.textShadow;
let titleFilter = titleContainer.style.filter;

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
  dateContainer.innerText = new Date().toLocaleDateString({ month: "numeric", day: "numeric", year: "numeric" });
  titleContainer.innerText = response.variable.value;

}

// Calls the fetchTitle function every 30 seconds to update the Twitch title
setInterval(fetchTitle, 15000);

///////////////////////////////////////////
// PERFORMS CONNECTION STATUS UI UPDATES //
///////////////////////////////////////////

function setConnectionStatus(connected) {

  // Updates the status container's styles and text based on the connection status
	if (connected) {
		statusContainer.style.background = "#2FB774";
		statusContainer.innerText = "CONNECTED";
		statusContainer.style.opacity = 1;
		setTimeout(() => {
			statusContainer.style.transition = "all 2s ease";
			statusContainer.style.opacity = 0;
		}, 10);
	}
	else {
		statusContainer.style.background = "#D12025";
		statusContainer.innerText = "CONNECTING...";
		statusContainer.style.transition = "";
		statusContainer.style.opacity = 1;
  }
}


//////////////////////////////////////
// CREATES TIMER COUNTDOWN FUNCTION //
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

  countFont = "LCD-2N, sans-serif";
  countSize = "60px";
  countColor = "#f8e757";
  countShadow = "0 0 15px #f908089c, 0 0 15px #f908089c,";
  countFilter = "blur(1.5px)";

  dateFont = "LCD-2N, sans-serif";
  dateSize = "20px";
  dateColor = "#f8e757";
  dateShadow = "0 0 8px #f908089c, 0px 0px 8px #f908089c, 0px 0px 8px #f908089c";
  dateFilter = "blur(1px)";

  titleFont = "LCD-2N, sans-serif";
  titleSize = "20px";
  titleColor = "#f8e757";
  titleShadow = "0 0 8px #f908089c, 0px 0px 8px #f908089c, 0px 0px 8px #f908089c";
  titleFilter = "blur(1px)";

}

vintageLook();
countFont = urlParams.get("font") || "LCD-2N, sans-serif";
countSize = urlParams.get("size") || "60px";
countColor = urlParams.get("color") || "#f8e757";
countShadow = urlParams.get("shadow") || "0 0 15px #f908089c, 0 0 15px #f908089c,";
countFilter = urlParams.get("filter") || "blur(1.5px)";

dateFont = urlParams.get("font") || "LCD-2N, sans-serif";
dateSize = urlParams.get("stampSize") || "20px";
dateColor = urlParams.get("stampColor") || "#f8e757";
dateShadow = urlParams.get("stampShadow") || "0 0 8px #f908089c, 0px 0px 8px #f908089c, 0px 0px 8px #f908089c";
dateFilter = urlParams.get("stampFilter") || "blur(1px)";

titleFont = dateFont;
titleSize = dateSize;
titleColor = dateColor;
titleShadow = dateShadow;
titleFilter =  dateFilter;
//the entry point and initializer/connector of all modules


//Entry point that initializes and connects all modules.
//Sets up event listeners and overall app flow.

import { loadAccessToken } from "./spotify-api.mjs";


const accessToken = await loadAccessToken();
console.log("Access token: ", accessToken);
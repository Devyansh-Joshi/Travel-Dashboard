// import axios from "axios";

// let cachedToken = null;
// let tokenExpiry = 0;

// export async function getAmadeusToken() {
//   const now = Date.now();

//   if (cachedToken && now < tokenExpiry) {
//     return cachedToken;
//   }

//   const res = await axios.post(
//     "https://test.api.amadeus.com/v1/security/oauth2/token",
//     new URLSearchParams({
//       grant_type: "client_credentials",
//       client_id: process.env.AMADEUS_CLIENT_ID,
//       client_secret: process.env.AMADEUS_CLIENT_SECRET,
//     }),
//     { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//   );

//   cachedToken = res.data.access_token;
//   tokenExpiry = now + res.data.expires_in * 1000;

//   return cachedToken;
// }

const axios = require("axios");

let cachedToken = null;
let tokenExpiry = 0;

async function getAmadeusToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const res = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  cachedToken = res.data.access_token;
  tokenExpiry = now + res.data.expires_in * 1000;

  return cachedToken;
}

module.exports = { getAmadeusToken };

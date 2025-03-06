/** I'm not sure what's necessary on the back end for a contact sheet that sends 
 * a message to my email. We'll see later...
*/
// Importing Express
const express = require("express");
const apiRouter = express.Router();



// All api route files need to export the router so that the api.js file can create a link:
module.exports = apiRouter
// This can't be in curlies like function exports
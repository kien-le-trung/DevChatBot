require("dotenv").config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.MY_VERIFY_TOKEN;
//create a verify token - should be a random string
//how it works: you tell facebook your app verify token => Fb checks if your webhook is functional
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

let getHomePage = (req, res) => {
    return res.send("Xin chao the gioi");
};

//Messenger will call this function whenever a webhook product is created
let getWebhook = (req, res) => {
    //parse the query params
    //These are params meter on the url, pasted by Facebook
    //req.query returns parameters on the URL as an object
    let mode = req.query['hub.mode']; //mode is always 'subscribe'
    let token = req.query['hub.verify_token'];//this token will be given by you to facebook for later verification
    let challenge = req.query['hub.challenge']; //must return this to facebook

    //check if a token and a mode is in the query string of the request
    if (mode && token) {
        //check if the mode and the token is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            //respond with a challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // if the token does not match. throw a 'forbidden 403' error
            res.sendStatus(403);
        }
    }
};

//messenger will call this function
let postWebhook = (req, res) => {
    let body = req.body;

    console.log(`Received webhook :`);
    console.dir(body, { depth: null });

    //check that this is the event from the page subscription
    if (body.object === 'page') {
        //Iterate a function over each entry
        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        //return a '200 OK' response to all requests (since it's from page subscription)
        //Tell messenger that 'no need to send again. we received it'
        res.status(200).send('EVENT_RECEIVED');
    } else {
        //return a 404 not found if the event is not from a page subscription
        res.sendStatus(404);
    }
};

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Check if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message - JSON object
        // This is the message you want to send back to the user
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid //to find the intended user to send the message to.
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

module.exports = {
    getHomePage: getHomePage, //key: value
    getWebhook: getWebhook,
    postWebhook: postWebhook
}
//This is the routing file for rthis project!

import express from "express";
import chatbotController, { getHomePage } from "../controllers/chatbotController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/webhook", chatbotController.getWebhook);
    router.post("/webhook",chatbotController.postWebhook);

    return app.use("/", router); //nạp các router đã define trong hàm vào sau "localhost:/";
}

module.exports = initWebRoutes;
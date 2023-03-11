import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser"; //npm package to parse json in http request into available js variables available under red.body
require("dotenv").config(); //import the config function from dotenv

let app = express(); // this is our app

//Config the view engine
configViewEngine(app);

//parse request to json
app.use(bodyParser.json()); //parse json into JS variables for use
app.use(bodyParser.urlencoded( //does the same for URL-encoded request
    {extended: true} //the request is NOT limted to string only
));

//Init web route:
initWebRoutes(app);

//create a port
let port = process.env.PORT || 8080; //PORT is from .env file
app.listen( //app.listen(): listen for the connections between the port and host
    port, 
    () => {
    console.log("hello world! Connection to port" + port); //callback function to be evoked when successful
})
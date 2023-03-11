import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./src/public")); //use(path, callback): mount the required middleware for a path; 
                                //express.static(): serve static files like images or CSS files
    app.set("view engine", "ejs"); //set the name "view engine" to library ejs
    app.set("views", "./src/views"); //app.set() to set names for values; certain names can config the server behaviour
};

module.exports = configViewEngine; //export module de co the dung function o cac file khac
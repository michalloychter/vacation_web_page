const express = require("express");
const cors = require("cors");
const chatLogic=require("./chat-logic");
const fileUpload=require("express-fileupload");


const vacationController=require("./controllers-layer/vacation-controller");
const userController=require("./controllers-layer/user-controller");


const server = express();
server.use(cors());
server.use(express.json());
const config = require("./configuration.json");
server.use("/", vacationController);
server.use("/", userController);

server.use("*", (req, res) => {
    res.status(404).send(`Route not found ${req.originalUrl}`);
});

const listener=server.listen(config.defaultPort, () => {
    console.log(`Listening on ${config.defaultPort}`);
}).on("error", (err) => {
   
    if (err.code === "EADDRINUSE")
        console.log("Error: Address in use");
    else 
        console.log("Error: Unknown error");
});

chatLogic.init(listener);


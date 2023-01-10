const { builtinModules } = require("module");
const { emit } = require("process");
const io = require("socket.io");
const vacationLogic = require("./business-logic-layer/vacation-logic");

let socketsManager;

function init(listener) {

    socketsManager = io(listener, { cors: { origin: "*" } });

    updateVacation = async () => {
        try {
                const result = await vacationLogic.getAllVacationAsync();
                socketsManager.sockets.emit("vacation-update", result);   
        }
        catch (error) {
            console.log(error);
        }
    }
    
    module.exports.updateVacation = updateVacation;

    socketsManager.sockets.on("connection", socket => {
        console.log("A client is connected ");

        socket.on("disconnect", (reason) => {
            console.log("A client is disconnected ");
        });
    })
}

module.exports = { init };


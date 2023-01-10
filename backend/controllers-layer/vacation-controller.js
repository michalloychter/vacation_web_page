const express = require("express");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const chatLogic = require("../chat-logic");
const verifyLoggedIn = require("../middleware/verify_Logged_In");
const verifyAdmin = require("../middleware/admin_verify");
const vacationLogic = require("../business-logic-layer/vacation-logic");


const router = express.Router();
router.use(fileUpload());

router.get("/images/:imageName", (request, response) => {
    try {
        const imageName = request.params.imageName;
        let imageFile = path.join(__dirname, "../images", imageName);
        if (!fs.existsSync(imageFile)) imageFile = locations.notFoundImageFile;
        response.sendFile(imageFile);
    }
    catch (err) {
        response.status(500).send({ message: "Server error" });
    }
});

router.get("/vacation/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const result = await vacationLogic.getVacationAsync(id);
        if (result[0]) { response.send(result) }
        else { response.status(404).send({ message: `Vacation ${id} not found` }) }
    }
    catch (error) {
        response.status(500).send({ message: "Server error" });
        console.log(error);
    }
});


router.get("/allvacation", [verifyLoggedIn], async (request, response) => {
    try {
        const result = await vacationLogic.getAllVacationAsync();
        if (result.length > 0) {
            response.send(result)
        }
        else
            response.status(404).send({ message: `Vacation  not found` })
    }
    catch (error) {
        response.status(500).send({ message: "Server error" });
    }
});

router.get("/imagevacation", async (request, response) => {
    try {
        const result = await vacationLogic.getAllImageAsync();
        let imageFile = path.join(__dirname, "../images", result[0].image);
        console.log(imageFile)
        if (!fs.existsSync(imageFile)) imageFile = locations.notFoundImageFile;
        response.sendFile(imageFile)
    }
    catch (error) {
        response.status(500).send({ message: "Server error" });
    }
});


router.post("/insertvacation", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const vacation = request.body;
        const image = request.files.image;
        const absolutePath = path.join(__dirname, "..", "images", image.name);
        await image.mv(absolutePath);
        const result = await vacationLogic.insertVacationAsync(vacation, image.name);
        const socketEmit = chatLogic.updateVacation;
        if (socketEmit) { socketEmit() }
        response.send(result);
    }
    catch (error) {
        response.status(500).send({ message: "Server error" });
    }
});

router.put("/editvacation/:id", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const id = request.params.id;
        const editVacation = request.body;
        const image = request.files.image;
        const absolutePath = path.join(__dirname, "..", "images", image.name);
        await image.mv(absolutePath);
        console.log(editVacation);
        const result = await vacationLogic.editVacationAsync(editVacation, id, image.name);
        const socketEmit = chatLogic.updateVacation;
        if (socketEmit) { socketEmit() }
        response.send(result)
    }
    catch (error) {
        response.status(500).send({ message: "Server error" });
    }
});

router.delete("/deletevacation/:id", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const id = request.params.id;
        const result = await vacationLogic.deleteVacationAsync(id);
        response.send(result)
        const socketEmit = chatLogic.updateVacation;
        if (socketEmit) { socketEmit() }
    }

    catch (error) {
        response.status(500).send({ message: "Server error" });
    }
});

router.put("/setfollow/:id", async (request, response) => {
    try {
        const id = request.params.id;
        const follow = request.body;
        if (follow.checked) {
            const result = await vacationLogic.increaceFollowAsync(id)
            const socketEmit = chatLogic.updateVacation;
            if (socketEmit) { socketEmit() }
            response.send(result);
        }
        else {
            const result = await vacationLogic.decreaceFollowAsync(id)
            const socketEmit = chatLogic.updateVacation;
            if (socketEmit) { socketEmit() }
            response.send(result);
        }

    }
    catch (error) {
        console.log(error);
        response.status(500).send({ message: "Server error" });
    }
});


module.exports = router;
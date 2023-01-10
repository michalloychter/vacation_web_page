const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel");
const userLogic = require("../business-logic-layer/user-logic");

const router = express.Router();

router.get("/alluser", async (request, response) => {
    try {
        const result = await userLogic.getAllUserAsync();
        response.send(result)
    }

    catch (error) {
        response.status(500).send({ message: "Server error" });
    }
});

router.get("/userFollow/:id", async (request, response) => {
    try {
        const id = request.params.id;
        const result = await userLogic.getUserFollowsAsync(id);
        response.send(result)
    }

    catch (error) {
        console.log(error);
        response.status(500).send({ message: "Server error" });
    }
});

router.post("/insertuser", async (request, response) => {
    try {
        const check = await userLogic.checkData(request.body);
        console.log(check);
        const newUser = new UserModel(request.body);
        let errors = await newUser.validate(check);
        console.log(errors);
        if (errors) { response.send(errors) }
        else {
            const result = await userLogic.insertUserAsync(request.body);
            if (result) {
                const token = await userLogic.logginAsync(request.body);
                response.send(token);
            }
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).send({ message: "Server error" });
    }
});


router.post("/login", async (request, response) => {
    try {
        const token = await userLogic.logginAsync(request.body);
        if (token)
            response.send(token);
        else
            response.send({ massage: "password or user-name are wrong" })
    }
    catch (error) {
        response.status(500).send({ message: "Server error" });
    }
});


router.post("/addUserFollow", async (request, response) => {
    try {
        const result = await userLogic.insertUserFollowAsync(request.body);
        response.send(result);
    }
    catch (error) {
        console.log(error);
        response.status(500).send({ message: "Server error" });
    }
});

router.post("/deleteUserFollow", async (request, response) => {
    try {
        const result = await userLogic.deleteUserFollowAsync(request.body);
        response.send(result);
    }
    catch (error) {
        response.status(500).send({ message: "Server error" });
    }
});
module.exports = router;
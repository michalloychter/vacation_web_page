const dal = require("../data-access-layer/dal");
const jwt = require("jsonwebtoken");
const config = require("../configuration.json");

function getAllUserAsync() {
    return dal.executeQueryAsync(`SELECT * FROM user `);
}


function insertUserAsync(user) {
    return dal.executeQueryAsync(`
    INSERT INTO user
        (name,surName,userName ,password) 
        VALUES 
        ("${user.name}", "${user.surname}", "${user.username}",${user.password})
    `);
}
function checkData(user) {
    const result = dal.executeQueryAsync(`SELECT userName FROM user where userName="${user.username}"`)
    return result;
}

async function logginAsync(userData) {
    const user = await dal.executeQueryAsync(`SELECT isAdmin, userName,name,userID FROM user where userName="${userData.username}"&& password=${userData.password} `)
    if (!user || user.length < 1) return null;
    user[0].token = jwt.sign({ user }, config.tokenKey, { expiresIn: "10 minutes" });
    return user[0].token;
};


function getUserFollowsAsync(id) {
    const result = dal.executeQueryAsync(`SELECT vacationID FROM follow where userID=${id} `);
    return result
}
function getVactionByUserFollowsAsync(id) {
    const result = dal.executeQueryAsync(`SELECT vacationID FROM follow where userID=${id} `);
    const orderVacation = dal.executeQueryAsync(`SELECT * FROM vacation WHERE vacationID IN (${result})
UNION
SELECT * FROM vacation WHERE vacationID NOT IN (${result})`)
    return orderVacation;
}

function insertUserFollowAsync(followData) {
    // const checked=dal.executeQueryAsync(`SELECT * FROM follow where userID=${followData.userID} AND vacationID=${followData.vacationID} `)
    // if(checked ) return null
    // console.log(checked);
    const result = dal.executeQueryAsync(` INSERT INTO follow
    (userID ,vacationID) 
    VALUES 
    ("${followData.userID}", "${followData.vacationID}")
 `);
    return result
}



function deleteUserFollowAsync(followData) {
    const result = dal.executeQueryAsync(`DELETE  FROM follow WHERE vacationID=${followData.vacationID} AND userID=${followData.userID}`)
    return result
}

module.exports = {
    getVactionByUserFollowsAsync,
    deleteUserFollowAsync,
    insertUserFollowAsync,
    getUserFollowsAsync,
    insertUserAsync,
    getAllUserAsync,
    logginAsync,
    checkData

}

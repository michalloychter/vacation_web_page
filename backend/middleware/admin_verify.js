function verifyAdmin(request, response, next) {
const userData=request.user;
    if (userData && userData.isAdmin){
        next();}
    else {
        return response.status(401).send("Unauthorized (admin)");
    }
}

module.exports = verifyAdmin;

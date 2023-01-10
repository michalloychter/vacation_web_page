const dal = require("../data-access-layer/dal");

class UserModel {
    constructor(name,surName,userName ,password,follow) {
        if (arguments.length > 1) {
            this.name = name;
            this.surName = surName;
            this.userName = userName;
            this.password = password;
            this.follow = follow;
           
        }
        else {
            let user = arguments[0];
            this.name = user.name;
            this.surName = user.surName;
            this.userName = user.userName;
            this.password = user.password;
            this.follow = user.follow;
        }
    }



    async validate(reasult) {

        console.log("Validate!!!");
        const errors = {};

        if (reasult.length>0)
            errors.username = "user-name olredy exist";

        const errorsLength = Object.keys(errors).length;
        if (errorsLength <= 0) {
            return null;
        }
        else {
            return errors;
        }
    }
}

module.exports = UserModel;
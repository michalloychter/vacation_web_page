const dal = require("../data-access-layer/dal");

class Vacation {
    constructor(description, place, startDate, endDate, price, follow) {
        if (arguments.length > 1) {
            this.description = description;
            this.place = place;
            //this.image = image;
            this.startDate = startDate;
            this.endDate = endDate;
            this.price = price;
            this.follow = follow
        }
        else {
            let vacation = arguments[0];
            this.description = vacation.description;
            this.place = vacation.place;
            //this.image = vacation.image;
            this.startDate = vacation.startDate;
            this.endDate = vacation.endDate;
            this.price = vacation.price;
            this.follow = vacation.follow;
        }
    }



    validate() {

        console.log("Validate!!!");
        const errors = {};

        const currentDate = new Date();
        if (new Date(this.startDate) < currentDate)
            errors.startDate = `start date should be after ${currentDate}`;

        if (new Date(this.endDate) <= new Date(this.startDate))
            errors.endDate = `end date should be after ${new Date(this.startDate)}`;

        const errorsLength = Object.keys(errors).length;
        if (errorsLength <= 0) {
            return null;

        }
        else {
            return errors;
        }
    }
}

module.exports = Vacation;
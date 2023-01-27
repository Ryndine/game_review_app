class ExpressError extends Error {
    constructor(message, statusCode){
        super(); //calls error constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
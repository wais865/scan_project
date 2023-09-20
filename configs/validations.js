const expressValidator = require('express-validator');

exports.validate = (req, res, next) => {
    [
        expressValidator.query('start').isNumeric().toInt(),
        expressValidator.query('length').isNumeric().toInt(),
        // ... Add more validators for other query parameters if necessary
    ]
    next();
};
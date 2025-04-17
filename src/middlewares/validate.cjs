const { validate } = require('../modules/validator.cjs');

class ValidationMiddleware {

    static async validate(req, res, next) {
        let validation = await validate(req.body.form, req.body);
        if (!validation.passed()) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({
                errors: validation.getErrors()
            }));
        }
        next();
    }
}

module.exports = {
    Validator: ValidationMiddleware,
};
const { ValidationRules } = require('../config/validation.cjs');

const DB = require('../modules/database.cjs');

const Hashing = require('../modules/hashing.cjs');


class Validator {

    errors = [];

    pass = false;

    constructor(form, data) {
        this.form = form;
        this.data = data;
    }

    getRules() {
        try {
            if (ValidationRules.hasOwnProperty(this.form)) {
                return ValidationRules[this.form]
            }
            throw new Error(`${this.form} does not exist in rules`);
        } catch (e) {
            console.error(e);
        }
    }

    async validate() {
        for (let field in this.getRules()) {
            for (let rule in this.getRules()[field]) {
                switch (rule) {
                    case 'required':
                        this.#handleRequired(this.data[field], field, this.getRules()[field][rule])
                        break;
                    case 'min':
                        this.#handleMin(this.data[field], field, this.getRules()[field][rule]);
                        break;
                    case 'min':
                        this.#handleMax(this.data[field], field, this.getRules()[field][rule]);
                        break;
                    case 'pattern':
                        this.#handlePattern(this.data[field], field, this.getRules()[field][rule]);
                        break;
                    case 'unique':
                        await this.#handleUnique(this.data[field], field, this.getRules()[field][rule]);
                        break;
                    case 'verified_by':
                        await this.#handleVerifiedBy(this.data, field, this.getRules()[field][rule]);
                        break;
                    case 'values':
                        this.#handleValues(this.data[field], field, this.getRules()[field][rule]);
                        break;
                }
                if (rule === 'required' && !this.data[field]) break;
            }
        }
        return this;
    }

    #handleRequired(data, field, rule) {
        if (!data && rule) {
            this.errors.push({ message: `${field} is required`, handler: `${field}` })
        }
        return false;
    }

    #handleMin(data, field, rule) {
        if (data.length < rule) {
            this.errors.push({ message: `${field} cannot be less than ${rule}`, handler: `${field}` })
        }
        return false;
    }

    #handleMax(data, field, rule) {
        if (data.length > rule) {
            this.errors.push({ message: `${field} cannot be greater than ${rule}`, handler: `${field}` })
        }
        return false;
    }

    #handlePattern(data, field, rule) {
        if (!rule.test(data)) {
            this.errors.push({ message: `${field} contains invalid characters`, handler: `${field}` })
        }
        return false;
    }

    #handleValues(data, field, rule) {
        if (!rule.includes(data)) {
            this.errors.push({ message: `${field} is invalid`, handler: `${field}` })
        }
        return false;
    }

    async #handleUnique(data, field, rule) {
        const [table, column, exists] = rule.split('|');
        const count = await DB.run().count(table, [column, '=', data]);
        switch (exists) {
            case 'true':
                if (count <= 0) {
                    this.errors.push({ message: `${field} was not found`, handler: `${field}` })
                    return false;
                }
                break;
            case 'false':
                if (count > 0) {
                    this.errors.push({ message: `${field} already exists`, handler: `${field}` })
                    return false;
                }
                break
        }
        return false;
    }

    async #handleVerifiedBy(data, field, rules) {
        const [ref, refTable, refColumn] = rules.split('|');
        if (data[ref].length <= 0) {
            this.errors.push({ message: `You must provide an ${ref}`, handler: `${field}` })
            return false;
        }
        let storedPassword = (await DB.run().select(['password']).from(refTable).where([refColumn, '=', data[ref]]).query());
        storedPassword = storedPassword.getResults();
        if (storedPassword.length <= 0) {
            this.errors.push({ message: `${field} is invalid`, handler: `${field}` })
            return false;
        }
        const verify = await Hashing.verifyPassword(data[field], storedPassword[0].password);
        if (!verify) {
            this.errors.push({ message: `Wrong ${field}`, handler: `${field}` })
            return false;
        }
        return false;
    }


    passed() {
        if (this.errors.length === 0) {
            this.pass = true;
        }
        return this.pass;
    }

    getErrors() {
        return this.errors;
    }
}


async function validate(form, data) {
    return await new Validator(form, data).validate();
}

module.exports = { validate }
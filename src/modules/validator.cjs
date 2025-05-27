const { ValidationRules } = require('../config/rules.cjs');

const DB = require('../modules/database.cjs');

const Hashing = require('../modules/hashing.cjs');


/**
 * Validator class responsible for validating form data based on predefined validation rules.
 */
class Validator {

    /**
     * List of validation errors.
     * @type {Array}
     */
    errors = [];

    /**
     * Flag indicating whether the validation passed or not.
     * @type {boolean}
     */
    pass = false;

    /**
     * Creates an instance of the Validator class.
     * @param {string} form - The form name, used to fetch rules from `ValidationRules`.
     * @param {Object} data - The data to be validated.
     */
    constructor(form, data) {
        this.form = form;
        this.data = data;
        this.errors = [];
    }

    /**
     * Retrieves the validation rules for the given form.
     * @returns {Object} The validation rules for the form.
     * @throws Will throw an error if the form is not found in the validation rules.
     */
    getRules() {
        try {
            if (ValidationRules.hasOwnProperty(this.form)) {
                return ValidationRules[this.form];
            }
            throw new Error(`${this.form} does not exist in rules`);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Validates the data based on the rules for each field.
     * @returns {Validator} The current Validator instance, allowing for method chaining.
     */
    async validate() {
        const rules = this.getRules();

        // Iterate over each field and its corresponding validation rules
        for (let field in rules) {
            const fieldRules = rules[field];

            // Iterate over each rule for the current field
            for (let ruleKey of Object.keys(fieldRules)) {
                const rule = fieldRules[ruleKey];
                const data = this.data[field];

                // Handle the required rule first
                if (ruleKey === 'required') {
                    this.#handleRequired(data, field, rule);
                    if (!data) break; // skip other rules if required fails
                }

                // Handle other rules based on their type
                switch (ruleKey) {
                    case 'min':
                        this.#handleMin(data, field, rule);
                        break;
                    case 'max':
                        this.#handleMax(data, field, rule);
                        break;
                    case 'pattern':
                        this.#handlePattern(data, field, rule);
                        break;
                    case 'unique':
                        await this.#handleUnique(this.data, field, rule);
                        break;
                    case 'verified_by':
                        await this.#handleVerifiedBy(this.data, field, rule);
                        break;
                    case 'values':
                        this.#handleValues(data, field, rule);
                        break;
                }
            }
        }

        return this;
    }

    /**
     * Handles the "required" validation rule.
     * @param {string} data - The value of the field being validated.
     * @param {string} field - The field name.
     * @param {boolean} rule - The required rule value.
     * @returns {boolean} Returns `false` after processing.
     */
    #handleRequired(data, field, rule) {
        if (!data && rule) {
            this.errors.push({ message: `${field} is required`, handler: `${field}` });
        }
        return false;
    }

    /**
     * Handles the "min" validation rule.
     * @param {string} data - The value of the field being validated.
     * @param {string} field - The field name.
     * @param {number} rule - The minimum length value.
     * @returns {boolean} Returns `false` after processing.
     */
    #handleMin(data, field, rule) {
        if (data.length < rule) {
            this.errors.push({ message: `${field} cannot be less than ${rule}`, handler: `${field}` });
        }
        return false;
    }

    /**
     * Handles the "max" validation rule.
     * @param {string} data - The value of the field being validated.
     * @param {string} field - The field name.
     * @param {number} rule - The maximum length value.
     * @returns {boolean} Returns `false` after processing.
     */
    #handleMax(data, field, rule) {
        if (data.length > rule) {
            this.errors.push({ message: `${field} cannot be greater than ${rule}`, handler: `${field}` });
        }
        return false;
    }

    /**
     * Handles the "pattern" validation rule.
     * @param {string} data - The value of the field being validated.
     * @param {string} field - The field name.
     * @param {RegExp} rule - The regular expression for the pattern rule.
     * @returns {boolean} Returns `false` after processing.
     */
    #handlePattern(data, field, rule) {
        if (!rule.test(data)) {
            this.errors.push({ message: `${field} contains invalid characters`, handler: `${field}` });
        }
        return false;
    }

    /**
     * Handles the "values" validation rule.
     * @param {string} data - The value of the field being validated.
     * @param {string} field - The field name.
     * @param {Array} rule - The array of valid values.
     * @returns {boolean} Returns `false` after processing.
     */
    #handleValues(data, field, rule) {
        if (!rule.includes(data)) {
            this.errors.push({ message: `${field} is invalid`, handler: `${field}` });
        }
        return false;
    }

    /**
     * Handles the "unique" validation rule.
     * @param {string} request - The value of the field being validated.
     * @param {string} field - The field name.
     * @param {string} rule - The rule containing the table and column for uniqueness check.
     * @returns {boolean} Returns `false` after processing.
     */
    async #handleUnique(request, field, rule) {
        const [table, column, exists, update, updateId] = rule.split('|');
        const data = request[field];
        const count = await DB.run().count(table, [column, '=', data]);
        switch (exists) {
            case 'true':
                if (count <= 0) {
                    this.errors.push({ message: `${field} was not found`, handler: `${field}` });
                    return false;
                }
                break;
            case 'false':
                if (count > 0 && update === null) {
                    this.errors.push({ message: `${field} already exists`, handler: `${field}` });
                    return false;
                }
                if (update) {
                    const query = await DB.run().select([column]).from(table).where([updateId, '=', request[updateId]]).query();
                    const res = query.getResults();
                    if (data !== res[0][column]) {
                        if (count > 0) {
                            this.errors.push({ message: `${field} already exists`, handler: `${field}` });
                            return false;
                        }
                    }
                }
                break;
        }
        return false;
    }

    /**
     * Handles the "verified_by" validation rule.
     * @param {Object} data - The form data.
     * @param {string} field - The field name.
     * @param {string} rules - The rules for verifying the data.
     * @returns {boolean} Returns `true` if the verification succeeds, otherwise `false`.
     */
    async #handleVerifiedBy(data, field, rules) {
        const [ref, refTable, refColumn] = rules.split('|');
        if (data[ref].length <= 0) {
            this.errors.push({ message: `You must provide an ${ref}`, handler: `${field}` });
            return false;
        }
        let storedPassword = await DB.run().select(['password']).from(refTable).where([refColumn, '=', data[ref]]).query();
        storedPassword = await storedPassword.getResults();
        if (!storedPassword.length) {
            this.errors.push({ message: `${field} is invalid`, handler: `${field}` });
            return false;
        }
        const verify = await Hashing.verifyPassword(data[field], storedPassword[0].password);
        if (!verify) {
            this.errors.push({ message: `Wrong ${field}`, handler: `${field}` });
            return false;
        }
        return true;
    }

    /**
     * Checks whether the validation passed (i.e., no errors occurred).
     * @returns {boolean} Returns `true` if validation passed, otherwise `false`.
     */
    passed() {
        if (this.errors.length === 0) {
            this.pass = true;
        }
        return this.pass;
    }

    /**
     * Retrieves the list of validation errors.
     * @returns {Array} An array of error objects.
     */
    getErrors() {
        return this.errors;
    }
}

/**
 * Validates a form with the given data.
 * @param {string} form - The form name to be validated.
 * @param {Object} data - The form data to be validated.
 * @returns {Validator} The validator instance.
 */
async function validate(form, data) {
    return await new Validator(form, data).validate();
}


module.exports = { validate }
const RegEx = {
    'numbers-only': /^[0-9]+$/,
    'letters-only': /^[A-Za-z]+$/,
    'strings-with-special-chars-no-space': /^[^\s]+$/,
    'strings-with-special-chars-and-space': /^[\S\s]+$/,
    'email': /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}


const ValidationRules = {
    'admin-login': {
        email: {
            required: true,
            pattern: RegEx['email'],
            unique: 'admins|email|true',
        },
        password: {
            required: true,
            pattern: RegEx['strings-with-special-chars-no-space'],
            verified_by: 'email|admins|email'
        }
    },
    'admin-registration': {
        firstname: {
            required: true,
            pattern: RegEx['letters-only'],
            min: 2,
            max: 20,
        },
        lastname: {
            required: true,
            pattern: RegEx['letters-only'],
            min: 2,
            max: 20,
        },
        role: {
            required: true,
            values: ['Super Admin', 'System Admin']
        },
        'phone-no': {
            required: true,
            unique: 'admins|phone_no|false',
            min: 10,
            max: 10,
            pattern: RegEx['numbers-only']
        },
        'email': {
            required: true,
            unique: 'admins|email|false',
            pattern: RegEx['email']
        },
        'password': {
            required: true,
            min: 6,
            max: 20,
            pattern: RegEx['strings-with-special-chars-no-space']
        }


    }
}

module.exports = { ValidationRules };
class Queries {

    static generateOffset(page, limit) {
        return (page - 1) * limit;;
    }

    static generateFields(fields = []) {
        return (fields.length > 0) ? fields : ['*']
    }
}


module.exports = Queries
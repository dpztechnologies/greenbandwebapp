const bcrypt = require('bcryptjs');

/**
 * @author DPZTechnologies
 * @date Wed Apr 16 2025 14:46:12 GMT+0300 (East Africa Time)
 * @module Hahsing Service Provider
 */
class Hashing {

    static #saltRounds = 12;

    /**
     * Hashes a plain password
     * @param {string} plainPassword - The password to be hashed
     * @returns {Promise<string>} - The hashed password
     */
    static async hashPassword(plainPassword) {
        if (typeof plainPassword !== 'string') {
            throw new Error('Password must be a string')
        }
        return await bcrypt.hash(plainPassword, Hashing.#saltRounds);
    }

    /**
     * Verifies a password aganist a hash
     * @param {string} plainPassword 
     * @param {string} hashedPassword 
     * @returns {Promise<boolean>} - true if password matxhes otherwise false
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        if (typeof plainPassword !== 'string' || typeof hashedPassword === 'string') {
            throw new Error('Hashed password and Plain password must be strings')
        }
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = {
    Hashing
}
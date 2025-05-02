/**
 * @author DPZTechnologies
 * @date Sat May 03 2025 00:17:18 GMT+0300 (East Africa Time
 * @abstract App Entry Point
 */
/**
 * Registers all application routes (HTTP endpoints) by importing and executing the route definitions.
 * 
 * @module routes
 */
require('./app/router.js');

/**
 * Initializes and runs the session cleanup/background tasks for managing sessions.
 * 
 * @module sessionworker
 */
require('./app/sessionworker.cjs');

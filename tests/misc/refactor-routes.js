/**
 * 2 Classes
 * 1. Routes
 * 2. Server
 * 
 * -> Make routes and server be in one class
 * -> serve post and get using diffrent methods
 * 
 * const router = require('router.cjs').getInstance()
 * 
 * router.get('/', (req, res) => {
 *      //Executes an anonymous function
 * })
 */

class RouteResolver {

    constructor() {
        this.routes = {};
    }

    /**
     * Create a new route
     * @param {string} path 
     * @param {string} method 
     * @param {CallableFunction} handler 
     */
    addRoute(path, method, handler) {
        if (!this.routes[path]) {
            this.routes[path] = {}
        }
        this.routes[path][method.toLowerCase] = handler
    }

    /**
     * Handles Request and response from server
     * @param {Request} req 
     * @param {Response} res 
     */
    handleRequest(req, res) {
        const parsedURL = url.parse(req.url, true);
        const path = parsedURL.pathname;
        const method = req.method.toLowerCase();
        //Verify route exists and call method handler
        if (this.routes[path] && this.routes[path][method]) {
            //Call path handler
            this.routes[path][method](req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid route / method' }))
        }
    }
}

class RouteProvider {

    constructor() {
        this.port = process.env.PORT;
        this.router = new RouteResolver();
    }

    /**
     * Handle get requests
     * @param {*} path 
     * @param {*} handler 
     */
    get(path, handler) {
        this.router.addRoute(path, 'get', handler);
    }

    /**
     * Handle get post
     * @param {*} path 
     * @param {*} handler 
     */
    post(path, handler) {
        this.router.addRoute(path, 'post', handler);
    }

    /**
     * Start server
     */
    start() {
        const Server = http.createServer((req, res) => {
            this.router.handleRequest(req, res);
        })

        Server.listen(this.port, () => {
            console.log(`Server running on port ${this.port} http://localhost:${port}`)
        })
    }

}



class Router {

    constructor() {
        this.routes = {};
    }

    /**
     * Register routes & Route handlers
     */
    addRoute(path, method, handler) {
        if (!this.routes[path]) {
            this.routes[path] = {};
        }
        this.routes[path][method.toLowerCase()] = handler;
    }

    /**
     * Handle request by matching path and method
     */
    handleRequest(req, res) {
        const parsedURL = url.parse(req.url, true);
        const path = parsedURL.pathname;
        const method = req.method.toLowerCase();

        //Verify route exists and call method handler
        if (this.routes[path] && this.routes[path][method]) {
            //Call path handler
            this.routes[path][method](req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid route / method' }))
        }
    }

}


class Server {

    constructor() {
        this.port = process.env.PORT
        this.router = new Router();
    }


    /**
     * Add route to server
     */
    addRoute(path, method, handler) {
        this.router.addRoute(path, method, handler)
    }

    /**
     * Start server
     */

    start() {
        const Server = http.createServer((req, res) => {
            this.router.handleRequest(req, res);
        })

        Server.listen(this.port, () => {
            console.log(`Server running on port ${this.port} http://localhost:${port}`)
        })
    }
}
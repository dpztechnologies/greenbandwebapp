const Routes = require('../config/routes.cjs');

class Request {

    static sendResults(query, res) {
        const results = (typeof query === 'object') ? query.getResults() : query;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
        return;
    }

    static sendResponse(response, res, type) {
        switch (type) {
            case 'form':
                if (response.success) {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify(response));
                    return;
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify(response));
                    return;
                }
            default:
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
                return;
        };
    }

    static sendErrors(error, res) {
        console.log(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
        return;
    }

    static getRoute(handler, name) {
        if (Routes.hasOwnProperty(handler)) {
            if (Routes[handler].hasOwnProperty(name)) {
                return Routes[handler][name];
            }
            throw new Error(`Invalid route name ${name}`);
        }
        throw new Error(`Invalid handler name ${handler}`);
    }
}

module.exports = Request
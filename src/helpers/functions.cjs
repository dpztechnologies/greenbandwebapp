const fs = require('fs').promises;
const Path = require('../modules/path.cjs');
const Template = require('../modules/template.cjs');
const Utilities = require('../modules/utilities.cjs');
const Request = require('../modules/request.cjs');

async function view(filepath) {
    const viewsDir = Path.relative(Path.getParentDir(__dirname, 2), 'public', 'views');
    const fullPath = Path.getFile(viewsDir, filepath);

    try {
        await fs.access(fullPath);
    } catch (err) {
        throw new Error(`View not found: ${filepath}`);
    }

    return await Template.render(fullPath);
}

function getSuperAdminRoute(name) {
    return Request.getRoute('Super Admin', name);
}

function getSystemAdminRoute(name) {
    return Request.getRoute('System Admin', name);
}


function getFilePath(name) {
    return Utilities.getFilePath(name);
}


async function load(filepath) {
    const fullPath = Path.getFile(Path.getParentDir(__dirname, 2), filepath);

    try {
        await fs.access(fullPath);
    } catch (err) {
        throw new Error(`File not found: ${filepath}`);
    }

    return await Template.render(filepath);
}






module.exports = { view, load, getSuperAdminRoute, getSystemAdminRoute, getFilePath };



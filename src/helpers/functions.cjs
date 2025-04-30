const fs = require('fs').promises;
const Path = require('../modules/path.cjs');
const Template = require('../modules/template.cjs');

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


async function load(filepath) {
    const fullPath = Path.getFile(Path.getParentDir(__dirname, 2), filepath);

    try {
        await fs.access(fullPath);
    } catch (err) {
        throw new Error(`File not found: ${filepath}`);
    }

    return await Template.render(filepath);
}

module.exports = { view, load };



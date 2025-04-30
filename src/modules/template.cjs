const fs = require('fs').promises
const Path = require('./path.cjs')

class Template {


    static async render(filePath) {

        let content;
        try {
            content = await fs.readFile(filePath, 'utf-8');
        } catch (err) {
            return `<!-- Error loading file: ${filePath} ${err} -->`;
        }

        const includeRegexp = /@include\(['"](.+?)['"]\)/g;

        // Replace all @include directives with the content of the referenced file
        content = await Template._replaceAsync(content, includeRegexp, async (_, filePath) => {
            const includeFullPath = Path.getFile(Path.getParentDir(__dirname, 2), filePath);
            try {
                // Recursively render the included file
                return await Template.render(includeFullPath);
            } catch (e) {
                return `<!-- Error loading include: ${filePath} -->`;
            }
        });


        return content;
    }


    static async _replaceAsync(str, regex, asyncFn) {
        const matches = [];
        str.replace(regex, (...args) => {
            matches.push(asyncFn(...args));
            return '';
        });
        const resolved = await Promise.all(matches);
        return str.replace(regex, () => resolved.shift());
    }

}


module.exports = Template
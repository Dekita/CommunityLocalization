const { resolve } = require('path');
const { readdir, lstat} = require('fs').promises;

async function* getFiles(dir, cond=()=>true) {
    const dirents = await readdir(dir);//, { withFileTypes: true });
    for (const dirent of dirents) {
        if (!cond(dirent)) continue;
        const res = resolve(dir, dirent);
        const stats = await lstat(res);
        if (stats.isDirectory()) {
            yield* getFiles(res, cond);
        } else {
            yield res;
        }
    }
}

module.exports = {
    getFiles,
}

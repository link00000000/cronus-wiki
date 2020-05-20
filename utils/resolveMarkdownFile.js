const { existsSync, lstatSync } = require('fs')
const { join } = require('path')

// Get markdown file path from ambiguous path
module.exports = function(staticRoute, path) {
    let filePath = join(process.cwd(), path)

    if(existsSync(filePath) && lstatSync(filePath).isDirectory()) {
        filePath = join(filePath, staticRoute, 'README.md')
    } else {
        filePath += '.md'
    }
    
    return filePath
}

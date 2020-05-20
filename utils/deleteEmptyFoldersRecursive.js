var fs = require('fs')
var path = require('path')

module.exports = function deleteEmptyFoldersRecursive(folder) {

    var isDir = fs.statSync(folder).isDirectory()
    if (!isDir) {
        return
    }
    var files = fs.readdirSync(folder)
    if (files.length > 0) {
        files.forEach(function(file) {
        var fullPath = path.join(folder, file)
        deleteEmptyFoldersRecursive(fullPath)
        })

        // re-evaluate files after deleting subfolder
        // we may have parent folder empty now
        files = fs.readdirSync(folder)
    }

    if (files.length == 0) {
        console.log("removing: " + folder)
        fs.rmdirSync(folder)
        return deleteEmptyFoldersRecursive(path.join(folder, '..'))
    }
}
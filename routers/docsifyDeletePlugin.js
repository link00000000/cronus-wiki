const { join } = require('path')
const { unlinkSync } = require('fs')

const { Router } = require('express')

const resolveMarkdownFile = require('../utils/resolveMarkdownFile')
const deleteEmptyFoldersRecursive = require('../utils/deleteEmptyFoldersRecursive')

const router = Router()

router.delete('/delete', (req, res) => {
    const filePath = resolveMarkdownFile('/static', req.body.path)

    console.log('delete: ' + filePath)

    try {
        unlinkSync(filePath)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    deleteEmptyFoldersRecursive(join(filePath, '..'))
    res.sendStatus(200)
})

module.exports = router

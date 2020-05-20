const { readFile, writeFile } = require('fs')
const { Router } = require('express')

const resolveMarkdownFile = require('../utils/resolveMarkdownFile')

const router = Router()

// Read data from markdown file
router.post('/read', (req, res) => {
    const filePath = resolveMarkdownFile('/static', req.body.path)

    console.log('read: ' + filePath)

    readFile(filePath, null, (err, data) => {
        if (err) {
            console.error(err)
            return res.sendStatus(500)
        }
        return res.send(`${data}`)
    })
})

// Write data to markdown file
router.post('/update', (req, res) => {
    const filePath = resolveMarkdownFile('/static', req.body.path)
    const content = req.body.content

    console.log('update: ' + filePath)

    writeFile(filePath, content, null, (err, data) => {
        if (err) {
            console.error(err)
            return res.sendStatus(500)
        }
        return res.send(`{ "message": "${data}" }`)
    })
})

module.exports = router

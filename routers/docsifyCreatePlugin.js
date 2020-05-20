const { existsSync, mkdirSync, writeFile } = require('fs')
const { join } = require('path')

const { Router } = require('express')

const resolveMarkdownFile = require('../utils/resolveMarkdownFile')

const router = Router()

router.put('/create', (req, res) => {
    const filePath = resolveMarkdownFile('/static', req.body.path)

    console.log('create: ' + filePath)
    
    if(existsSync(filePath))
    {
        console.error('File already exists')
        return res.status(500).send('File already exists')
    }

    mkdirSync(join(filePath, '..'), { recursive: true })
    writeFile(filePath, '# ' + req.body.path, err => {
        if(err) {
            console.error('Error writing file')
            return res.status(500).send('Error writing file')
        }
        return res.sendStatus(200)
    })
})

module.exports = router

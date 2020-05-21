const { readdirSync } = require('fs')
const { join, parse } = require('path')
const { Router } = require('express')

const router = Router()

router.get('/_navbar.md', (req, res) => {
    const root = join(process.cwd(), 'static')
    const markdown = getRoutes(root)

    return res.send(markdown)
})

function getRoutes(root) {
    return readdirSync(root).sort().map(item => {
        if(item === 'README.md') return ''

        const { name, dir } = parse(join(root, item))
        const url = join(dir, name)
            .replace(root, '/')
            .replace(/\\/, '/')
            .replace(/\/\//, '/')

        return `- [${name}](${url})`
    })
        .filter(item => item !== '')
        .join('\n')
}

module.exports = router
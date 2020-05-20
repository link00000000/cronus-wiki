const { readFile, writeFile, existsSync, lstatSync } = require('fs')
const { join } = require('path')

const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT || 8080

app.engine('handlebars', expressHandlebars({ defaultLayout: false }))
app.set('view engine', 'handlebars')

app.use(express.static('static'))
app.use('/lib', express.static('lib'))
app.use(bodyParser.json())
app.listen(PORT, () => console.log('Listening on port ' + PORT))

// Docsify
// example.com/
app.get('/', (_req, res) => {
    return res.render('docsify')
})

// Update document
app.post('/read', (req, res) => {
    const filePath = resolveMarkdownFile(req.body.path)

    console.log(filePath)

    readFile(filePath, null, (err, data) => {
        if (err) return res.sendStatus(500)
        return res.send(`${data}`)
    })
})

// Update document
app.post('/update', (req, res) => {
    const filePath = resolveMarkdownFile(req.body.path)
    const content = req.body.content

    console.log('path: ' + filePath, 'content: ' + content)

    writeFile(filePath, content, null, (err, data) => {
        if (err) return res.sendStatus(500)
        return res.send(`{ "message": "${data}" }`)
    })
})

// Get markdown file path from ambiguous path
function resolveMarkdownFile(path) {
    let filePath = join(__dirname, 'static', path)

    if(existsSync(filePath) && lstatSync(filePath).isDirectory()) {
        filePath = join(filePath, 'README.md')
    } else {
        filePath += '.md'
    }
    
    return filePath
}

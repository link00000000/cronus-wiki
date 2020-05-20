const { readFile, writeFile } = require('fs')
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

// StackEdit
// example.com/edit/*
app.get(/^\/edit\/.*/, (req, res) => {
    let filePath = join(__dirname, 'static', req.url.substr('/edit'.length))
        .replace(/\\/g, '\\\\')

    readFile(filePath, {}, (err, data) => {
        if (err) return res.write('Error reading input file')
        return res.render('stackedit', { fileName: filePath, fileContent: data })
    })
})

// Update document
app.post('/update', (req, res) => {
    const filePath = req.body.path
    const content = req.body.content

    writeFile(filePath, content, null, (err, data) => {
        if (err) return res.sendStatus(500).send(`{ "message": "${err}" }`)
        return res.send(`{ "message": "${data}" }`)
    })
})

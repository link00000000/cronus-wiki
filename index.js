const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT || 8080

app.use(express.static('static'))
app.use('/lib', express.static('lib'))
app.use(bodyParser.json())
app.listen(PORT, () => console.log('Listening on port ' + PORT))

app.use('/', require('./routers/docsifyStackEditPlugin'))
app.use('/', require('./routers/docsifyDeletePlugin'))
app.use('/', require('./routers/docsifyCreatePlugin'))
app.use('/', require('./routers/docsifyNavbar'))

// Docsify
// example.com/
app.get('/', (_req, res) => {
    return res.sendFile('docsify.html', { root: './views' })
})

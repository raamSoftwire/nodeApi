require('dotenv').config()
const express = require('express')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json')

const {Auth, Book, Copy, Loan, User} = require('./routes/index')

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (req, res) => res.send('Hello World!'))

app.use('/auth', Auth)
app.use('/books', Book)
app.use('/copies', Copy)
app.use('/loans', Loan)
app.use('/users', User)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

module.exports = app

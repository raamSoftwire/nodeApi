const express = require('express')
const app = express()
const port = 3000
const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json')

const {User, Book, Copy, Loan} = require('./routes/index')

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (req, res) => res.send('Hello World!'))

app.use('/users', User)
app.use('/books', Book)
app.use('/copies', Copy)
app.use('/loans', Loan)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

module.exports = app

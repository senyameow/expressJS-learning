import express from 'express'

const app = express()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`port is ${PORT}`)
})

app.get('/', (req, res) => {
    res.status(201).send({ message: 'dont give up' })
})

app.get('/api/users', (req, res) => {
    res.send([{ id: 1, name: 'senya', age: 18 }, { id: 20 }])
})

app.get('/api/users/:id', (req, res) => {
    res.send(req.params)
})
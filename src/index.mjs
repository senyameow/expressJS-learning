import express from 'express'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

const users = [{ id: 1, name: 'senya', age: 18 }, { id: 2 }]

app.listen(PORT, () => {
    console.log(`port is ${PORT}`)
})

app.get('/', (req, res) => {
    res.status(201).send({ message: 'dont give up' })
})

app.get('/api/users', (req, res) => {
    const { query: { filter, value } } = req
    console.log(filter, value)
    if (filter && value) return res.send(users.filter(u => u?.[filter]?.includes(value)))
    return res.send(users)
})

app.get('/api/users/:id', (req, res) => {
    const parsedId = parseInt(req.params.id)
    if (isNaN(parsedId)) return res.status(400).send({ message: 'bad request' })

    const user = users.find(user => user.id === parsedId)
    if (!user) return res.status(404)
    return res.send(user)
})

app.post('/api/users', (req, res) => {
    // here we can, for example, create a new record in db
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        ...req.body
    }
    users.push(newUser)
    console.log(users)

    return res.sendStatus(200)
})
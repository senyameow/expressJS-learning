import express, { response } from 'express'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

let users = [{ id: 1, name: 'senya', age: 18 }, { id: 2, name: 'alina', age: 19 }]

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

    return res.status(201).send(newUser)
})

app.put('/api/users/:id', (req, res) => {
    const { body, params: { id } } = req;
    // body contains a data to update
    // id is id of user that we wanna update
    // it's always string, but id is a number in our 'db' -> so let's parse it
    const parsedId = parseInt(id)
    // if id is not a number, or contains characters, it's invalid, so we just return 400
    if (isNaN(parsedId)) return res.sendStatus(400)

    // now let's find the user with that id
    const userId = users.findIndex(user => user.id === parsedId)
    console.log(body, userId)
    // if not found, return 404 - not found error
    if (userId === -1) return res.sendStatus(404)

    // in PUT method we update ENTIRE record (in PATCH, on the other hand, we update partially)
    // if user didn't pass certain properties, we don't care, we update what he told to update, other properties will become null

    users[userId] = { id: parsedId, ...body }
    return res.sendStatus(200)
})

// for example we have a user on our site.
// user decided to change his username
// we don't have to change the whole instance of that user
// in this case we would use PATCH request

app.patch('/api/users/:id', (req, res) => {
    const { body, params: { id } } = req
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) return res.sendStatus(400) // incorrect id

    // find user to update
    const userIndex = users.findIndex(user => user.id === parsedId)
    // if not found send 404 error
    if (userIndex === -1) return res.sendStatus(404)

    // if found, update ONLY THOSE PROPERTIES that are in body
    const oldUser = users[userIndex]
    // first spread oldProperties and then overwrite them by spreading body object
    users[userIndex] = { ...oldUser, ...body }
    console.log(users)

    return res.sendStatus(200)
})

app.delete('/api/users/:id', (req, res) => {
    const { body, params: { id } } = req
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) return res.sendStatus(400)

    const userIndex = users.findIndex(user => user.id === parsedId)
    if (userIndex === -1) return res.sendStatus(404)

    users.splice(userIndex, 1)
    console.log(users)
    return res.sendStatus(200)
})
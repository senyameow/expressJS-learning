import express, { request, response } from 'express'
import { query, validationResult, body as bodyValidator, matchedData, checkSchema } from 'express-validator'
import { createUserSchema } from './utils/schemas'

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

let users = [{ id: 1, name: 'senya', age: 18 }, { id: 2, name: 'alina', age: 19 }]

// middleware

// create a middleware function
const middleware = (req, res, next) => {
    console.log(`${req.method}--${req.url}`)
    next()
}
// we can use middleware 2 different ways
// 1. assign it to all routes
// 2. assign to a specific route / routes

// 1
// app.use(middleware)
// now if I call /api/users/1 with DELETE method, it will log DELETE--/api/users/1, and it works with every route
// when using app.use(), we can pass as much middlewares as we want
// 1 more important thing is that app.use() should be written before route that uses it, otherwise it's not gonna be called

// 2
// to use it for a specific route, pass middleware function as a second param

// in many routes below we have repeated code that can be defined as a middleware function

const resolveUserById = (req, res, next) => {
    const { body, params: { id } } = req
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) return res.sendStatus(400) // incorrect id

    // find user to update
    const userIndex = users.findIndex(user => user.id === parsedId)
    // if not found send 404 error
    if (userIndex === -1) return res.sendStatus(404)
    req.userIndex = userIndex
    req.parsedId = parsedId
    next()
}

app.listen(PORT, () => {
    console.log(`port is ${PORT}`)
})

app.get('/', middleware, (req, res) => {
    res.status(201).send({ message: 'dont give up' })
}) // and now middleware works only when i go to the '/'

// we can even pass more than one middleware to a route, the previous middleware function has an OPTION to call next middleware
// by using next()
// it can be usefull in situations like sign-in, where if we can't find user's hash, we don't wanna next logic to execute, so we don't call next

app.post('/', (req, res, next) => {
    const { body } = req
    res.send(body.message)
    if (body.message.includes('next')) next()
}, (req, res) => {
    const { body } = req
    console.log(body)
}, (req, res) => {
    res.status(201)
}) // and now middleware works only when i go to the '/'


app.get('/api/users', query('filter').isString().notEmpty().isLength({ min: 1, max: 10 }).withMessage('incorrect length'), (req, res) => {
    const result = validationResult(req)
    console.log(result)
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

// to validate body, we need to import body from validator similar as we did with query

app.post('/api/users', checkSchema(createUserSchema), (req, res) => {
    // here we can, for example, create a new record in db
    const result = validationResult(req)
    if (!result.isEmpty()) return res.status(400).send({ errors: result.array() })

    // we can grab fields that were validated, so we assume that these properties are 100 correct
    const data = matchedData(req)
    console.log(data)

    console.log(result)
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        ...req.body
    }
    users.push(newUser)
    console.log(users)

    return res.status(201).send(newUser)
})

// we validated query and body, but it's all the same, we just import what we want to validate and do the same

// but if we want to validate multiple fields in body object, we can pass an array of functions

app.put('/api/users/:id', resolveUserById, (req, res) => {
    const { body } = req;
    // // body contains a data to update
    // // id is id of user that we wanna update
    // // it's always string, but id is a number in our 'db' -> so let's parse it
    // const parsedId = parseInt(id)
    // // if id is not a number, or contains characters, it's invalid, so we just return 400
    // if (isNaN(parsedId)) return res.sendStatus(400)

    // // now let's find the user with that id
    // const userId = users.findIndex(user => user.id === parsedId)
    // console.log(body, userId)
    // // if not found, return 404 - not found error
    // if (userId === -1) return res.sendStatus(404)



    // in PUT method we update ENTIRE record (in PATCH, on the other hand, we update partially)
    // if user didn't pass certain properties, we don't care, we update what he told to update, other properties will become null

    users[req.userIndex] = { id: req.parsedId, ...body }
    return res.send(users)
})

// for example we have a user on our site.
// user decided to change his username
// we don't have to change the whole instance of that user
// in this case we would use PATCH request

app.patch('/api/users/:id', resolveUserById, (req, res) => {


    // if found, update ONLY THOSE PROPERTIES that are in body
    const oldUser = users[userIndex]
    // first spread oldProperties and then overwrite them by spreading body object
    users[userIndex] = { ...oldUser, ...body }
    console.log(users)

    return res.sendStatus(200)
})

app.delete('/api/users/:id', (req, res) => {
    // in DELETE requests we don't really need any payload body, but sometimes it can be usefull
    const { body, params: { id } } = req
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) return res.sendStatus(400)

    const userIndex = users.findIndex(user => user.id === parsedId)
    if (userIndex === -1) return res.sendStatus(404)

    users.splice(userIndex, 1)
    console.log(users)
    return res.sendStatus(200)
})


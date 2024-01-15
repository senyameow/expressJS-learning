// router helps to organize routes.
// as app grows, we can have dozens of api endpoints, and it would be nice to separate them

import { Router } from 'express'
import { query, validationResult, body as bodyValidator, matchedData, checkSchema } from 'express-validator'
import { users } from '../utils/constants.mjs'
import { createUserSchema } from '../utils/schemas.mjs'
import { resolveUserById } from './middlewares.mjs'

const router = Router()

router.get('/api/users', query('filter').isString().notEmpty().isLength({ min: 1, max: 10 }).withMessage('incorrect length'), (req, res) => {
    const result = validationResult(req)
    console.log(result)
    const { query: { filter, value } } = req
    console.log(filter, value)
    if (filter && value) return res.send(users.filter(u => u?.[filter]?.includes(value)))
    return res.send(users)
})

router.post('/api/users', checkSchema(createUserSchema), (req, res) => {
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

router.get('/api/users/:id', (req, res) => {
    const parsedId = parseInt(req.params.id)
    if (isNaN(parsedId)) return res.status(400).send({ message: 'bad request' })

    const user = users.find(user => user.id === parsedId)
    if (!user) return res.status(404)
    return res.send(user)
})

router.put('/api/users/:id', resolveUserById, (req, res) => {
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

router.patch('/api/users/:id', resolveUserById, (req, res) => {


    // if found, update ONLY THOSE PROPERTIES that are in body
    const oldUser = users[userIndex]
    // first spread oldProperties and then overwrite them by spreading body object
    users[userIndex] = { ...oldUser, ...body }
    console.log(users)

    return res.sendStatus(200)
})

router.delete('/api/users/:id', (req, res) => {
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



export default router
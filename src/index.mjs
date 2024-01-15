import express, { request, response } from 'express'
import { query, validationResult, body as bodyValidator, matchedData, checkSchema } from 'express-validator'
import { createUserSchema } from './utils/schemas.mjs'
import usersRouter from './routes/users.mjs'
import { users } from './utils/constants.mjs'
import { resolveUserById } from './routes/middlewares.mjs'

const app = express()


app.use(express.json())
// so to use router now, we need to create it first
// then import
// and then app.use(*router)
app.use(usersRouter)

const PORT = process.env.PORT || 3000


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



// to validate body, we need to import body from validator similar as we did with query



// we validated query and body, but it's all the same, we just import what we want to validate and do the same

// but if we want to validate multiple fields in body object, we can pass an array of functions


// for example we have a user on our site.
// user decided to change his username
// we don't have to change the whole instance of that user
// in this case we would use PATCH request



// cookies will be available every time we send a request!
// they can be really usefull

// they are important because by default HTTP is stateless.
// whenever you make a request server does not know who is that request is comming from
// it knows nothing

// so example:
// I wanna implement ecommerce web-site, and I also wanna implement a cart system, where user can store items and delete them.
// and main function is, when user goes to the website, add item, close site, and come back, item is still in his cart

// without cookies server doesn't know who user is, what items he saved
// with cookies, I can send them back to the server then will know who that user is, and it will help identify user, and all items will remain in his cart

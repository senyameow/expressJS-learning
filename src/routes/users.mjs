// router helps to organize routes.
// as app grows, we can have dozens of api endpoints, and it would be nice to separate them

import { Router } from 'express'
import { query, validationResult, body as bodyValidator, matchedData, checkSchema } from 'express-validator'
import { users } from '../utils/constants.mjs'
import { createUserSchema } from '../utils/schemas.mjs'

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

export default router
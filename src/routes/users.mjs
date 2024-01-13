// router helps to organize routes.
// as app grows, we can have dozens of api endpoints, and it would be nice to separate them

import { Router } from 'express'
import { query, validationResult, body as bodyValidator, matchedData, checkSchema } from 'express-validator'
import { users } from '../utils/constants.mjs'

const router = Router()

router.get('/api/users', query('filter').isString().notEmpty().isLength({ min: 1, max: 10 }).withMessage('incorrect length'), (req, res) => {
    const result = validationResult(req)
    console.log(result)
    const { query: { filter, value } } = req
    console.log(filter, value)
    if (filter && value) return res.send(users.filter(u => u?.[filter]?.includes(value)))
    return res.send(users)
})

export default router
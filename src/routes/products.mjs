import { Router } from "express";

const router = Router()

router.get('/api/products', (req, res) => {
    console.log(req.headers.cookie)
    if (req.cookies.user228 == 'true')
        res.send([{ id: 1, name: 'chicken', price: 499 }])
    else res.sendStatus(403)
})

export default router
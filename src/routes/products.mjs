import { Router } from "express";

const router = Router()

router.get('/api/products', (req, res) => {
    console.log(req.headers.cookie)
    res.send([{ id: 1, name: 'chicken', price: 499 }])
})

export default router
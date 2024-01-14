
export const resolveUserById = (req, res, next) => {
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
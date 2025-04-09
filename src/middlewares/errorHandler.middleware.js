
export const errorHandler = (error, req, res, next) => {
    console.error(error)

    if (error.name === 'ZodError') {
        return res.status(400).json(error.issues)
    }

    if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (error.message === 'BLOCKED') {
        return res.status(403).json({ message: 'Your account has been blocked' })
    }

    if (error.code === '22P02') {
        return res.status(404).json({ message: 'Not Found' })
    }

    // if (error.message === 'DELETED') {
    //     return res.status(403).json({ message: 'Your account has been deleted' })
    // }

    if (error.code === '23505') {
        return res.status(409).json({ message: 'A user with this email already exists' })
    }

    return res.status(500).json({ error })
}
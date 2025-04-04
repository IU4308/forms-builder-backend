
export const errorHandler = (error, req, res, next) => {
    console.error(error)

    if (error.name === 'ZodError') {
        return res.status(400).json(error.issues)
    }

    if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (error.code === '23505') {
        return res.status(409).json({ message: 'A user with this email already exists' })
    }

    return res.status(500).json({ error })
}
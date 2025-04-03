
export const errorHandler = (error, req, res, next) => {
    console.error(error)

    if (error.name === 'ZodError') {
        return res.status(400).json(error.issues)
    }

    return res.status(500).json({ error })
}
/**
 * Manejador de rutas no encontradas (404)
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * Manejador global de errores (Cualquier error en la API cae aquí)
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Manejo específico para errores de MongoDB (ej. CastError al buscar un ID inválido)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    res.status(statusCode).json({
        message,
        // Solo mostrar la pila de ejecución (stack trace) si no estamos en producción
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };

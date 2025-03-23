const successResponse = (data, message = 'Success') => ({
    success: true,
    message,
    data
});

const errorResponse = (message = 'Error occurred', errors = null) => ({
    success: false,
    message,
    errors
});

const paginatedResponse = (data, page, limit, total) => ({
    success: true,
    data,
    pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
    }
});

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse
};

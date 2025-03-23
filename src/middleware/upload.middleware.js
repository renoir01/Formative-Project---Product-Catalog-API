const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./error.middleware');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for memory storage
const multerStorage = multer.memoryStorage();

// Filter only images
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

// Multer upload configuration
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware for processing product images
exports.uploadProductImage = upload.single('image');

exports.resizeProductImage = async (req, res, next) => {
    try {
        if (!req.file) return next();

        // Generate unique filename
        const filename = `product-${req.params.id || Date.now()}.webp`;
        req.file.filename = filename;

        // Process image with sharp
        await sharp(req.file.buffer)
            .resize(800, 800, { // Standard size for product images
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .webp({ quality: 90 })
            .toFile(path.join(uploadDir, filename));

        // Add image URL to request body
        req.body.imageUrl = `/uploads/${filename}`;
        
        next();
    } catch (error) {
        next(new AppError('Error processing image', 500));
    }
};

// Middleware for processing collection images
exports.uploadCollectionImage = upload.single('image');

exports.resizeCollectionImage = async (req, res, next) => {
    try {
        if (!req.file) return next();

        // Generate unique filename
        const filename = `collection-${req.params.id || Date.now()}.webp`;
        req.file.filename = filename;

        // Process image with sharp
        await sharp(req.file.buffer)
            .resize(1200, 600, { // Wide format for collection banners
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 90 })
            .toFile(path.join(uploadDir, filename));

        // Add image URL to request body
        req.body.imageUrl = `/uploads/${filename}`;
        
        next();
    } catch (error) {
        next(new AppError('Error processing image', 500));
    }
};

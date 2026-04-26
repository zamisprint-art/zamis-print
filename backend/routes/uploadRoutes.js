import path from 'path';
import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Use memory storage — we handle the Cloudinary upload manually
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const is3DModel = /\.(glb|gltf)$/.test(ext);
    const isImage   = /\.(jpg|jpeg|png|webp)$/.test(ext);

    if (is3DModel) return cb(null, true);

    if (isImage) {
        const validMime = /image\/(jpeg|png|webp)/.test(file.mimetype);
        return validMime
            ? cb(null, true)
            : cb(new Error('Tipo de imagen no soportado. Usa JPG, PNG o WEBP.'));
    }

    cb(new Error('Solo se permiten imágenes (JPG/PNG/WEBP) y modelos 3D (GLB/GLTF).'));
}

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
    fileFilter: (req, file, cb) => checkFileType(file, cb),
});

// @route   POST /api/upload
// @desc    Upload file to Cloudinary (images or 3D models)
// @access  Private/Admin
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se recibió ningún archivo.' });
        }

        const ext      = path.extname(req.file.originalname).toLowerCase();
        const is3DModel = /\.(glb|gltf)$/.test(ext);

        // Build upload options
        const uploadOptions = {
            folder: 'zamis-print',
            public_id: `${req.file.fieldname}-${Date.now()}`,
            resource_type: is3DModel ? 'raw' : 'auto',
        };

        // Upload buffer to Cloudinary using upload_stream
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        res.json({
            message: 'Archivo subido exitosamente a Cloudinary',
            filePath: result.secure_url,
        });

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({
            message: 'Error al subir el archivo',
            error: error.message,
        });
    }
});

export default router;

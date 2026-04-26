import path from 'path';
import { Readable } from 'stream';
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

        const ext       = path.extname(req.file.originalname).toLowerCase();
        const is3DModel = /\.(glb|gltf)$/.test(ext);

        const uploadOptions = {
            folder:        'zamis-print',
            public_id:     `${req.file.fieldname}-${Date.now()}`,
            resource_type: is3DModel ? 'raw' : 'auto',
            use_filename:  false,
        };

        console.log(`[Upload] ${req.file.originalname} | size: ${req.file.size} bytes | resource_type: ${uploadOptions.resource_type}`);

        // Stream the buffer directly to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('[Cloudinary Error]', JSON.stringify(error));
                        return reject(error);
                    }
                    resolve(result);
                }
            );
            // Pipe the buffer as a readable stream
            Readable.from(req.file.buffer).pipe(uploadStream);
        });

        console.log('[Upload] Success:', result.secure_url);

        res.json({
            message:  'Archivo subido exitosamente',
            filePath: result.secure_url,
        });

    } catch (error) {
        console.error('[Upload] Final error:', error.message, '| HTTP:', error.http_code);
        res.status(500).json({
            message: 'Error al subir el archivo',
            error:   error.message,
            code:    error.http_code || 500,
        });
    }
});

export default router;

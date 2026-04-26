import path from 'path';
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Handle 3D models (.glb, .gltf) as 'raw' resource type in Cloudinary
        const is3DModel = file.originalname.match(/\.(glb|gltf)$/i);
        
        return {
            folder: 'zamis-print',
            resource_type: is3DModel ? 'raw' : 'auto',
            public_id: `${file.fieldname}-${Date.now()}`,
        };
    },
});

function checkFileType(file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const is3DModel = /\.(glb|gltf)$/.test(ext);
    const isImage   = /\.(jpg|jpeg|png|webp)$/.test(ext);

    if (is3DModel) {
        // For 3D models, trust the extension — browsers often send application/octet-stream
        return cb(null, true);
    }

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
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// @route   POST /api/upload
// @desc    Upload file to Cloudinary
// @access  Private/Admin
router.post('/', upload.single('file'), (req, res) => {
    res.send({
        message: 'File Uploaded to Cloudinary',
        filePath: req.file.path, // Cloudinary returns the secure URL in req.file.path
    });
});

export default router;
